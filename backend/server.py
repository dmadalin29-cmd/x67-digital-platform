from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header, Request, Response, Query
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional, Any
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
import httpx
import asyncio
import resend
import secrets
import random

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Config
JWT_SECRET = os.environ.get('JWT_SECRET', 'x67-digital-secret-key')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = 24 * 7  # 7 days

# Resend Config
resend.api_key = os.environ.get('RESEND_API_KEY')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')

# Create the main app
app = FastAPI(title="x67 Digital Competitions Platform")

# Create routers
api_router = APIRouter(prefix="/api")

# ==========================
# PYDANTIC MODELS
# ==========================

# User Models
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    full_name: str = Field(min_length=2)
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    email: str
    full_name: str
    phone: Optional[str] = None
    role: str = "user"
    email_verified: bool = False
    created_at: str

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None

# Auth Response
class AuthResponse(BaseModel):
    token: str
    user: UserResponse

# Competition Models
class CompetitionCreate(BaseModel):
    title: str
    description: str
    category: str  # cars, electronics, cash
    prize_value: float
    ticket_price: float
    total_tickets: int
    draw_date: str  # ISO format
    image_url: str
    featured: bool = False
    auto_draw: bool = True
    is_visible: bool = True

class CompetitionUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    prize_value: Optional[float] = None
    ticket_price: Optional[float] = None
    total_tickets: Optional[int] = None
    draw_date: Optional[str] = None
    image_url: Optional[str] = None
    featured: Optional[bool] = None
    auto_draw: Optional[bool] = None
    is_visible: Optional[bool] = None

class CompetitionResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    competition_id: str
    title: str
    description: str
    category: str
    prize_value: float
    ticket_price: float
    total_tickets: int
    tickets_sold: int = 0
    draw_date: str
    image_url: str
    featured: bool
    auto_draw: bool
    is_visible: bool
    status: str  # live, ending_soon, sold_out, completed
    winner_id: Optional[str] = None
    winner_ticket: Optional[int] = None
    created_at: str

# Ticket/Order Models
class TicketPurchase(BaseModel):
    competition_id: str
    quantity: int = Field(ge=1, le=100)

class OrderResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    order_id: str
    user_id: str
    competition_id: str
    ticket_numbers: List[int]
    quantity: int
    total_price: float
    payment_status: str  # pending, completed, failed, refunded
    payment_id: Optional[str] = None
    created_at: str

# Winner Model
class WinnerResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    winner_id: str
    competition_id: str
    competition_title: str
    user_id: str
    user_name: str
    winning_ticket: int
    prize_value: float
    drawn_at: str

# Payment Models (Viva Payments - MOCKED)
class PaymentCreateRequest(BaseModel):
    order_id: str
    amount: float
    customer_email: str
    customer_name: str

class PaymentResponse(BaseModel):
    payment_id: str
    order_code: str
    checkout_url: str
    status: str

# Admin Stats
class AdminStats(BaseModel):
    total_users: int
    total_competitions: int
    active_competitions: int
    total_orders: int
    total_revenue: float
    tickets_sold_today: int

# Contact/FAQ Models
class FAQItem(BaseModel):
    question: str
    answer: str

class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    message: str

# ==========================
# HELPER FUNCTIONS
# ==========================

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())

def create_token(user_id: str, role: str = "user") -> str:
    payload = {
        "user_id": user_id,
        "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(authorization: Optional[str] = Header(None), request: Request = None):
    token = None
    
    # Try cookie first
    if request and request.cookies.get("session_token"):
        session_token = request.cookies.get("session_token")
        # Look up session
        session = await db.user_sessions.find_one({"session_token": session_token}, {"_id": 0})
        if session:
            expires_at = session.get("expires_at")
            if isinstance(expires_at, str):
                expires_at = datetime.fromisoformat(expires_at)
            if expires_at.tzinfo is None:
                expires_at = expires_at.replace(tzinfo=timezone.utc)
            if expires_at > datetime.now(timezone.utc):
                user = await db.users.find_one({"user_id": session["user_id"]}, {"_id": 0})
                if user:
                    return user
    
    # Try Authorization header
    if authorization:
        if authorization.startswith("Bearer "):
            token = authorization[7:]
        else:
            token = authorization
    
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("user_id")
        user = await db.users.find_one({"user_id": user_id}, {"_id": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def require_admin(user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

def get_competition_status(comp: dict) -> str:
    if comp.get("winner_id"):
        return "completed"
    if comp.get("tickets_sold", 0) >= comp.get("total_tickets", 0):
        return "sold_out"
    draw_date = comp.get("draw_date")
    if isinstance(draw_date, str):
        draw_date = datetime.fromisoformat(draw_date.replace('Z', '+00:00'))
    if draw_date.tzinfo is None:
        draw_date = draw_date.replace(tzinfo=timezone.utc)
    now = datetime.now(timezone.utc)
    if draw_date <= now:
        return "completed"
    time_left = draw_date - now
    if time_left <= timedelta(hours=24):
        return "ending_soon"
    return "live"

async def send_email(to: str, subject: str, html: str):
    """Send email using Resend (non-blocking)"""
    try:
        params = {
            "from": SENDER_EMAIL,
            "to": [to],
            "subject": subject,
            "html": html
        }
        result = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Email sent to {to}: {result}")
        return result
    except Exception as e:
        logger.error(f"Failed to send email to {to}: {e}")
        return None

# ==========================
# AUTH ENDPOINTS
# ==========================

@api_router.post("/auth/register", response_model=AuthResponse)
async def register(user_data: UserCreate):
    # Check if email exists
    existing = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = f"user_{uuid.uuid4().hex[:12]}"
    now = datetime.now(timezone.utc).isoformat()
    
    user_doc = {
        "user_id": user_id,
        "email": user_data.email,
        "password_hash": hash_password(user_data.password),
        "full_name": user_data.full_name,
        "phone": user_data.phone,
        "role": "user",
        "email_verified": False,
        "created_at": now
    }
    
    await db.users.insert_one(user_doc)
    
    # Send welcome email
    await send_email(
        to=user_data.email,
        subject="Welcome to x67 Digital!",
        html=f"""
        <h1>Welcome to x67 Digital!</h1>
        <p>Hi {user_data.full_name},</p>
        <p>Thank you for joining x67 Digital - the UK's premier competition platform!</p>
        <p>Start entering competitions today for your chance to win amazing prizes.</p>
        <p>Good luck!</p>
        <p>The x67 Digital Team</p>
        """
    )
    
    token = create_token(user_id)
    user_response = UserResponse(
        user_id=user_id,
        email=user_data.email,
        full_name=user_data.full_name,
        phone=user_data.phone,
        role="user",
        email_verified=False,
        created_at=now
    )
    
    return AuthResponse(token=token, user=user_response)

@api_router.post("/auth/login", response_model=AuthResponse)
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user or not verify_password(credentials.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = create_token(user["user_id"], user.get("role", "user"))
    user_response = UserResponse(
        user_id=user["user_id"],
        email=user["email"],
        full_name=user["full_name"],
        phone=user.get("phone"),
        role=user.get("role", "user"),
        email_verified=user.get("email_verified", False),
        created_at=user["created_at"]
    )
    
    return AuthResponse(token=token, user=user_response)

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(user: dict = Depends(get_current_user)):
    return UserResponse(
        user_id=user["user_id"],
        email=user["email"],
        full_name=user["full_name"],
        phone=user.get("phone"),
        role=user.get("role", "user"),
        email_verified=user.get("email_verified", False),
        created_at=user["created_at"]
    )

# Emergent Google OAuth Session Endpoint
@api_router.post("/auth/session")
async def process_google_session(request: Request, response: Response):
    """Process Google OAuth session from Emergent Auth"""
    body = await request.json()
    session_id = body.get("session_id")
    
    if not session_id:
        raise HTTPException(status_code=400, detail="session_id required")
    
    # Call Emergent Auth to get session data
    try:
        async with httpx.AsyncClient() as client:
            auth_response = await client.get(
                "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
                headers={"X-Session-ID": session_id},
                timeout=30.0
            )
            if auth_response.status_code != 200:
                raise HTTPException(status_code=401, detail="Invalid session")
            
            session_data = auth_response.json()
    except Exception as e:
        logger.error(f"Error fetching session data: {e}")
        raise HTTPException(status_code=500, detail="Authentication failed")
    
    email = session_data.get("email")
    name = session_data.get("name")
    picture = session_data.get("picture")
    
    # Find or create user
    user = await db.users.find_one({"email": email}, {"_id": 0})
    
    if not user:
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        now = datetime.now(timezone.utc).isoformat()
        user = {
            "user_id": user_id,
            "email": email,
            "full_name": name,
            "picture": picture,
            "role": "user",
            "email_verified": True,
            "created_at": now
        }
        await db.users.insert_one(user)
    else:
        user_id = user["user_id"]
        # Update name/picture if changed
        await db.users.update_one(
            {"user_id": user_id},
            {"$set": {"full_name": name, "picture": picture}}
        )
    
    # Create session token
    session_token = secrets.token_urlsafe(32)
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    
    await db.user_sessions.insert_one({
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": expires_at.isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    
    # Set httpOnly cookie
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=7 * 24 * 60 * 60
    )
    
    return {
        "user_id": user_id,
        "email": email,
        "full_name": name,
        "picture": picture,
        "role": user.get("role", "user")
    }

@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    session_token = request.cookies.get("session_token")
    if session_token:
        await db.user_sessions.delete_one({"session_token": session_token})
    response.delete_cookie("session_token", path="/")
    return {"message": "Logged out"}

@api_router.put("/auth/profile", response_model=UserResponse)
async def update_profile(profile: UserProfileUpdate, user: dict = Depends(get_current_user)):
    update_data = {}
    if profile.full_name:
        update_data["full_name"] = profile.full_name
    if profile.phone:
        update_data["phone"] = profile.phone
    
    if update_data:
        await db.users.update_one({"user_id": user["user_id"]}, {"$set": update_data})
    
    updated_user = await db.users.find_one({"user_id": user["user_id"]}, {"_id": 0})
    return UserResponse(**updated_user)

# ==========================
# COMPETITION ENDPOINTS
# ==========================

@api_router.get("/competitions", response_model=List[CompetitionResponse])
async def get_competitions(
    category: Optional[str] = None,
    status: Optional[str] = None,
    featured: Optional[bool] = None
):
    query = {"is_visible": True}
    if category:
        query["category"] = category
    if featured is not None:
        query["featured"] = featured
    
    competitions = await db.competitions.find(query, {"_id": 0}).to_list(100)
    
    result = []
    for comp in competitions:
        comp["status"] = get_competition_status(comp)
        if status and comp["status"] != status:
            continue
        result.append(CompetitionResponse(**comp))
    
    return result

@api_router.get("/competitions/featured", response_model=List[CompetitionResponse])
async def get_featured_competitions():
    competitions = await db.competitions.find(
        {"is_visible": True, "featured": True},
        {"_id": 0}
    ).to_list(10)
    
    result = []
    for comp in competitions:
        comp["status"] = get_competition_status(comp)
        if comp["status"] in ["live", "ending_soon"]:
            result.append(CompetitionResponse(**comp))
    
    return result

@api_router.get("/competitions/{competition_id}", response_model=CompetitionResponse)
async def get_competition(competition_id: str):
    comp = await db.competitions.find_one({"competition_id": competition_id}, {"_id": 0})
    if not comp:
        raise HTTPException(status_code=404, detail="Competition not found")
    
    comp["status"] = get_competition_status(comp)
    return CompetitionResponse(**comp)

# ==========================
# TICKET/ORDER ENDPOINTS
# ==========================

@api_router.post("/tickets/purchase", response_model=OrderResponse)
async def purchase_tickets(purchase: TicketPurchase, user: dict = Depends(get_current_user)):
    comp = await db.competitions.find_one({"competition_id": purchase.competition_id}, {"_id": 0})
    if not comp:
        raise HTTPException(status_code=404, detail="Competition not found")
    
    status = get_competition_status(comp)
    if status not in ["live", "ending_soon"]:
        raise HTTPException(status_code=400, detail="Competition is not available for purchase")
    
    tickets_available = comp["total_tickets"] - comp.get("tickets_sold", 0)
    if purchase.quantity > tickets_available:
        raise HTTPException(status_code=400, detail=f"Only {tickets_available} tickets available")
    
    # Generate unique ticket numbers
    existing_tickets = await db.orders.find(
        {"competition_id": purchase.competition_id, "payment_status": "completed"},
        {"ticket_numbers": 1, "_id": 0}
    ).to_list(None)
    
    used_numbers = set()
    for order in existing_tickets:
        used_numbers.update(order.get("ticket_numbers", []))
    
    available_numbers = [i for i in range(1, comp["total_tickets"] + 1) if i not in used_numbers]
    
    if len(available_numbers) < purchase.quantity:
        raise HTTPException(status_code=400, detail="Not enough tickets available")
    
    ticket_numbers = random.sample(available_numbers, purchase.quantity)
    ticket_numbers.sort()
    
    order_id = f"order_{uuid.uuid4().hex[:12]}"
    total_price = comp["ticket_price"] * purchase.quantity
    now = datetime.now(timezone.utc).isoformat()
    
    order_doc = {
        "order_id": order_id,
        "user_id": user["user_id"],
        "competition_id": purchase.competition_id,
        "competition_title": comp["title"],
        "ticket_numbers": ticket_numbers,
        "quantity": purchase.quantity,
        "total_price": total_price,
        "payment_status": "pending",
        "created_at": now
    }
    
    await db.orders.insert_one(order_doc)
    
    return OrderResponse(**order_doc)

@api_router.post("/orders/{order_id}/confirm")
async def confirm_order(order_id: str, user: dict = Depends(get_current_user)):
    """Confirm order after payment (MOCKED payment for demo)"""
    order = await db.orders.find_one({"order_id": order_id, "user_id": user["user_id"]}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if order["payment_status"] == "completed":
        raise HTTPException(status_code=400, detail="Order already completed")
    
    # MOCKED: In production, verify Viva payment status here
    # For now, auto-complete the order
    await db.orders.update_one(
        {"order_id": order_id},
        {"$set": {"payment_status": "completed", "payment_id": f"viva_{uuid.uuid4().hex[:8]}"}}
    )
    
    # Update tickets sold count
    await db.competitions.update_one(
        {"competition_id": order["competition_id"]},
        {"$inc": {"tickets_sold": order["quantity"]}}
    )
    
    # Send confirmation email
    await send_email(
        to=user["email"],
        subject=f"Order Confirmed - x67 Digital #{order_id[:12]}",
        html=f"""
        <h1>Order Confirmed!</h1>
        <p>Hi {user['full_name']},</p>
        <p>Your ticket purchase has been confirmed:</p>
        <ul>
            <li><strong>Order ID:</strong> {order_id}</li>
            <li><strong>Competition:</strong> {order.get('competition_title', 'N/A')}</li>
            <li><strong>Tickets:</strong> {order['quantity']}</li>
            <li><strong>Ticket Numbers:</strong> {', '.join(map(str, order['ticket_numbers']))}</li>
            <li><strong>Total:</strong> £{order['total_price']:.2f}</li>
        </ul>
        <p>Good luck!</p>
        <p>The x67 Digital Team</p>
        """
    )
    
    return {"message": "Order confirmed", "order_id": order_id}

@api_router.get("/orders/my", response_model=List[OrderResponse])
async def get_my_orders(user: dict = Depends(get_current_user)):
    orders = await db.orders.find({"user_id": user["user_id"]}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return [OrderResponse(**o) for o in orders]

@api_router.get("/tickets/my")
async def get_my_tickets(user: dict = Depends(get_current_user)):
    """Get all tickets grouped by competition"""
    orders = await db.orders.find(
        {"user_id": user["user_id"], "payment_status": "completed"},
        {"_id": 0}
    ).to_list(None)
    
    tickets_by_comp = {}
    for order in orders:
        comp_id = order["competition_id"]
        if comp_id not in tickets_by_comp:
            comp = await db.competitions.find_one({"competition_id": comp_id}, {"_id": 0})
            tickets_by_comp[comp_id] = {
                "competition_id": comp_id,
                "competition_title": comp.get("title", "Unknown") if comp else "Unknown",
                "draw_date": comp.get("draw_date") if comp else None,
                "status": get_competition_status(comp) if comp else "unknown",
                "tickets": []
            }
        tickets_by_comp[comp_id]["tickets"].extend(order["ticket_numbers"])
    
    return list(tickets_by_comp.values())

# ==========================
# WINNERS ENDPOINTS
# ==========================

@api_router.get("/winners", response_model=List[WinnerResponse])
async def get_winners():
    winners = await db.winners.find({}, {"_id": 0}).sort("drawn_at", -1).to_list(50)
    return [WinnerResponse(**w) for w in winners]

# ==========================
# PAYMENT ENDPOINTS (MOCKED Viva Payments)
# ==========================

@api_router.post("/payments/create", response_model=PaymentResponse)
async def create_payment(payment: PaymentCreateRequest, user: dict = Depends(get_current_user)):
    """Create payment order (MOCKED - returns simulated checkout URL)"""
    # In production, this would call Viva Payments API
    order_code = f"{random.randint(1000000000, 9999999999)}"
    payment_id = f"pay_{uuid.uuid4().hex[:12]}"
    
    # MOCKED checkout URL
    checkout_url = f"https://demo.vivapayments.com/web/checkout?ref={order_code}"
    
    return PaymentResponse(
        payment_id=payment_id,
        order_code=order_code,
        checkout_url=checkout_url,
        status="pending"
    )

@api_router.post("/payments/webhook")
async def payment_webhook(request: Request):
    """Handle Viva payment webhook (MOCKED)"""
    # In production, verify webhook signature
    body = await request.json()
    logger.info(f"Payment webhook received: {body}")
    return {"status": "ok"}

# ==========================
# ADMIN ENDPOINTS
# ==========================

@api_router.get("/admin/stats", response_model=AdminStats)
async def get_admin_stats(admin: dict = Depends(require_admin)):
    total_users = await db.users.count_documents({})
    total_competitions = await db.competitions.count_documents({})
    active_competitions = await db.competitions.count_documents({"is_visible": True})
    total_orders = await db.orders.count_documents({"payment_status": "completed"})
    
    # Calculate revenue
    orders = await db.orders.find({"payment_status": "completed"}, {"total_price": 1, "_id": 0}).to_list(None)
    total_revenue = sum(o.get("total_price", 0) for o in orders)
    
    # Today's tickets
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    today_orders = await db.orders.find({
        "payment_status": "completed",
        "created_at": {"$gte": today_start.isoformat()}
    }, {"quantity": 1, "_id": 0}).to_list(None)
    tickets_today = sum(o.get("quantity", 0) for o in today_orders)
    
    return AdminStats(
        total_users=total_users,
        total_competitions=total_competitions,
        active_competitions=active_competitions,
        total_orders=total_orders,
        total_revenue=total_revenue,
        tickets_sold_today=tickets_today
    )

@api_router.post("/admin/competitions", response_model=CompetitionResponse)
async def create_competition(comp: CompetitionCreate, admin: dict = Depends(require_admin)):
    competition_id = f"comp_{uuid.uuid4().hex[:12]}"
    now = datetime.now(timezone.utc).isoformat()
    
    comp_doc = {
        "competition_id": competition_id,
        **comp.model_dump(),
        "tickets_sold": 0,
        "status": "live",
        "created_at": now
    }
    
    await db.competitions.insert_one(comp_doc)
    comp_doc["status"] = get_competition_status(comp_doc)
    return CompetitionResponse(**comp_doc)

@api_router.put("/admin/competitions/{competition_id}", response_model=CompetitionResponse)
async def update_competition(competition_id: str, updates: CompetitionUpdate, admin: dict = Depends(require_admin)):
    update_data = {k: v for k, v in updates.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No updates provided")
    
    result = await db.competitions.update_one({"competition_id": competition_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Competition not found")
    
    comp = await db.competitions.find_one({"competition_id": competition_id}, {"_id": 0})
    comp["status"] = get_competition_status(comp)
    return CompetitionResponse(**comp)

@api_router.delete("/admin/competitions/{competition_id}")
async def delete_competition(competition_id: str, admin: dict = Depends(require_admin)):
    result = await db.competitions.delete_one({"competition_id": competition_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Competition not found")
    return {"message": "Competition deleted"}

@api_router.get("/admin/competitions", response_model=List[CompetitionResponse])
async def admin_get_all_competitions(admin: dict = Depends(require_admin)):
    competitions = await db.competitions.find({}, {"_id": 0}).to_list(100)
    result = []
    for comp in competitions:
        comp["status"] = get_competition_status(comp)
        result.append(CompetitionResponse(**comp))
    return result

@api_router.post("/admin/competitions/{competition_id}/draw")
async def draw_winner(competition_id: str, admin: dict = Depends(require_admin)):
    """Manually draw a winner for a competition"""
    comp = await db.competitions.find_one({"competition_id": competition_id}, {"_id": 0})
    if not comp:
        raise HTTPException(status_code=404, detail="Competition not found")
    
    if comp.get("winner_id"):
        raise HTTPException(status_code=400, detail="Winner already drawn")
    
    # Get all completed orders for this competition
    orders = await db.orders.find(
        {"competition_id": competition_id, "payment_status": "completed"},
        {"_id": 0}
    ).to_list(None)
    
    if not orders:
        raise HTTPException(status_code=400, detail="No tickets sold yet")
    
    # Collect all ticket entries
    entries = []
    for order in orders:
        for ticket in order["ticket_numbers"]:
            entries.append({"user_id": order["user_id"], "ticket": ticket})
    
    # Random draw (cryptographically secure)
    winning_entry = secrets.choice(entries)
    winning_user = await db.users.find_one({"user_id": winning_entry["user_id"]}, {"_id": 0})
    
    # Update competition
    await db.competitions.update_one(
        {"competition_id": competition_id},
        {"$set": {"winner_id": winning_entry["user_id"], "winner_ticket": winning_entry["ticket"]}}
    )
    
    # Create winner record
    winner_id = f"win_{uuid.uuid4().hex[:12]}"
    winner_doc = {
        "winner_id": winner_id,
        "competition_id": competition_id,
        "competition_title": comp["title"],
        "user_id": winning_entry["user_id"],
        "user_name": winning_user.get("full_name", "Anonymous"),
        "winning_ticket": winning_entry["ticket"],
        "prize_value": comp["prize_value"],
        "drawn_at": datetime.now(timezone.utc).isoformat()
    }
    await db.winners.insert_one(winner_doc)
    
    # Send winner notification email
    if winning_user:
        await send_email(
            to=winning_user["email"],
            subject=f"🎉 Congratulations! You Won - {comp['title']}!",
            html=f"""
            <h1>🎉 CONGRATULATIONS!</h1>
            <p>Hi {winning_user['full_name']},</p>
            <p>We are thrilled to inform you that you are the WINNER of:</p>
            <h2>{comp['title']}</h2>
            <p><strong>Prize Value:</strong> £{comp['prize_value']:,.2f}</p>
            <p><strong>Winning Ticket:</strong> #{winning_entry['ticket']}</p>
            <p>Our team will be in touch shortly to arrange delivery of your prize.</p>
            <p>Thank you for playing with x67 Digital!</p>
            """
        )
    
    return {"message": "Winner drawn", "winner": winner_doc}

@api_router.get("/admin/users", response_model=List[UserResponse])
async def admin_get_users(admin: dict = Depends(require_admin)):
    users = await db.users.find({}, {"_id": 0, "password_hash": 0}).to_list(1000)
    return [UserResponse(**u) for u in users]

@api_router.get("/admin/orders", response_model=List[OrderResponse])
async def admin_get_orders(admin: dict = Depends(require_admin)):
    orders = await db.orders.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return [OrderResponse(**o) for o in orders]

@api_router.post("/admin/orders/{order_id}/refund")
async def refund_order(order_id: str, admin: dict = Depends(require_admin)):
    order = await db.orders.find_one({"order_id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if order["payment_status"] != "completed":
        raise HTTPException(status_code=400, detail="Order not eligible for refund")
    
    await db.orders.update_one({"order_id": order_id}, {"$set": {"payment_status": "refunded"}})
    
    # Decrease tickets sold
    await db.competitions.update_one(
        {"competition_id": order["competition_id"]},
        {"$inc": {"tickets_sold": -order["quantity"]}}
    )
    
    return {"message": "Order refunded"}

@api_router.put("/admin/users/{user_id}/role")
async def update_user_role(user_id: str, role: str = Query(...), admin: dict = Depends(require_admin)):
    if role not in ["user", "admin"]:
        raise HTTPException(status_code=400, detail="Invalid role")
    
    result = await db.users.update_one({"user_id": user_id}, {"$set": {"role": role}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": f"User role updated to {role}"}

# ==========================
# CONTENT ENDPOINTS (FAQ, Terms, etc.)
# ==========================

@api_router.get("/content/faq")
async def get_faq():
    faqs = await db.content.find_one({"type": "faq"}, {"_id": 0})
    if not faqs:
        return {"items": []}
    return faqs

@api_router.put("/admin/content/faq")
async def update_faq(items: List[FAQItem], admin: dict = Depends(require_admin)):
    await db.content.update_one(
        {"type": "faq"},
        {"$set": {"type": "faq", "items": [i.model_dump() for i in items]}},
        upsert=True
    )
    return {"message": "FAQ updated"}

@api_router.get("/content/terms")
async def get_terms():
    content = await db.content.find_one({"type": "terms"}, {"_id": 0})
    if not content:
        return {"content": ""}
    return content

@api_router.get("/content/privacy")
async def get_privacy():
    content = await db.content.find_one({"type": "privacy"}, {"_id": 0})
    if not content:
        return {"content": ""}
    return content

@api_router.put("/admin/content/{content_type}")
async def update_content(content_type: str, content: str = Query(...), admin: dict = Depends(require_admin)):
    if content_type not in ["terms", "privacy", "cookies"]:
        raise HTTPException(status_code=400, detail="Invalid content type")
    
    await db.content.update_one(
        {"type": content_type},
        {"$set": {"type": content_type, "content": content}},
        upsert=True
    )
    return {"message": f"{content_type} updated"}

# ==========================
# CONTACT ENDPOINT
# ==========================

@api_router.post("/contact")
async def submit_contact(message: ContactMessage):
    contact_id = f"contact_{uuid.uuid4().hex[:12]}"
    await db.contacts.insert_one({
        "contact_id": contact_id,
        **message.model_dump(),
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    return {"message": "Message received", "contact_id": contact_id}

# ==========================
# ROOT ENDPOINT
# ==========================

@api_router.get("/")
async def root():
    return {"message": "x67 Digital Competitions API", "version": "1.0.0"}

# ==========================
# SEED DATA ENDPOINT (for demo)
# ==========================

@api_router.post("/seed")
async def seed_data():
    """Seed demo data for testing"""
    # Check if already seeded
    existing = await db.competitions.count_documents({})
    if existing > 0:
        return {"message": "Data already seeded"}
    
    # Create admin user
    admin_id = f"user_{uuid.uuid4().hex[:12]}"
    now = datetime.now(timezone.utc).isoformat()
    
    await db.users.insert_one({
        "user_id": admin_id,
        "email": "admin@x67digital.co.uk",
        "password_hash": hash_password("admin123"),
        "full_name": "Admin User",
        "role": "admin",
        "email_verified": True,
        "created_at": now
    })
    
    # Create sample competitions
    competitions = [
        {
            "competition_id": f"comp_{uuid.uuid4().hex[:12]}",
            "title": "Mercedes AMG GT 63",
            "description": "Win this stunning Mercedes AMG GT 63 S E Performance with 831bhp! The ultimate hybrid hypercar combines luxury with raw power. Features include AMG Performance seats, MBUX multimedia system, and Burmester® High-End 3D Surround Sound.",
            "category": "cars",
            "prize_value": 175000,
            "ticket_price": 4.99,
            "total_tickets": 4999,
            "tickets_sold": 1247,
            "draw_date": (datetime.now(timezone.utc) + timedelta(days=14)).isoformat(),
            "image_url": "https://images.unsplash.com/photo-1765461734605-34657fa04db2?w=800",
            "featured": True,
            "auto_draw": True,
            "is_visible": True,
            "created_at": now
        },
        {
            "competition_id": f"comp_{uuid.uuid4().hex[:12]}",
            "title": "BMW M4 Competition",
            "description": "Take home this beast! BMW M4 Competition with 503bhp twin-turbo inline-six. Finished in Brooklyn Grey with M Carbon Exterior Package, Carbon ceramic brakes, and full M Performance accessories.",
            "category": "cars",
            "prize_value": 85000,
            "ticket_price": 2.99,
            "total_tickets": 3999,
            "tickets_sold": 892,
            "draw_date": (datetime.now(timezone.utc) + timedelta(days=7)).isoformat(),
            "image_url": "https://images.unsplash.com/photo-1706811422966-24bfa91695c3?w=800",
            "featured": True,
            "auto_draw": True,
            "is_visible": True,
            "created_at": now
        },
        {
            "competition_id": f"comp_{uuid.uuid4().hex[:12]}",
            "title": "Audi RS6 Avant",
            "description": "The ultimate super-estate! Audi RS6 Avant with 621bhp from its twin-turbo V8. Nardo Grey with black optic package, sports exhaust, and panoramic sunroof.",
            "category": "cars",
            "prize_value": 115000,
            "ticket_price": 3.49,
            "total_tickets": 2999,
            "tickets_sold": 456,
            "draw_date": (datetime.now(timezone.utc) + timedelta(days=21)).isoformat(),
            "image_url": "https://images.unsplash.com/photo-1654855383391-765987e87c7f?w=800",
            "featured": False,
            "auto_draw": True,
            "is_visible": True,
            "created_at": now
        },
        {
            "competition_id": f"comp_{uuid.uuid4().hex[:12]}",
            "title": "iPhone 15 Pro Max + £500 Cash",
            "description": "Win the latest iPhone 15 Pro Max 1TB in Natural Titanium PLUS £500 cash! Includes AirPods Pro and MagSafe accessories bundle worth over £300.",
            "category": "electronics",
            "prize_value": 2000,
            "ticket_price": 0.99,
            "total_tickets": 999,
            "tickets_sold": 678,
            "draw_date": (datetime.now(timezone.utc) + timedelta(days=3)).isoformat(),
            "image_url": "https://images.pexels.com/photos/18525574/pexels-photo-18525574.jpeg?w=800",
            "featured": True,
            "auto_draw": True,
            "is_visible": True,
            "created_at": now
        },
        {
            "competition_id": f"comp_{uuid.uuid4().hex[:12]}",
            "title": "PS5 Pro Gaming Bundle",
            "description": "Ultimate gaming setup! PS5 Pro with 2TB storage, DualSense Edge controller, PlayStation VR2, and 10 top-rated games including GTA VI, Spider-Man 2, and FIFA 26.",
            "category": "electronics",
            "prize_value": 1500,
            "ticket_price": 0.79,
            "total_tickets": 1499,
            "tickets_sold": 234,
            "draw_date": (datetime.now(timezone.utc) + timedelta(days=10)).isoformat(),
            "image_url": "https://images.pexels.com/photos/13189290/pexels-photo-13189290.jpeg?w=800",
            "featured": False,
            "auto_draw": True,
            "is_visible": True,
            "created_at": now
        },
        {
            "competition_id": f"comp_{uuid.uuid4().hex[:12]}",
            "title": "£10,000 Cash Prize",
            "description": "Tax-free cash straight to your bank! Win £10,000 to spend however you like. Perfect for a dream holiday, home improvements, or a deposit on your dream car.",
            "category": "cash",
            "prize_value": 10000,
            "ticket_price": 1.99,
            "total_tickets": 2499,
            "tickets_sold": 1123,
            "draw_date": (datetime.now(timezone.utc) + timedelta(days=5)).isoformat(),
            "image_url": "https://images.pexels.com/photos/6805162/pexels-photo-6805162.jpeg?w=800",
            "featured": True,
            "auto_draw": True,
            "is_visible": True,
            "created_at": now
        }
    ]
    
    await db.competitions.insert_many(competitions)
    
    # Create sample FAQ
    faqs = [
        {"question": "How do I enter a competition?", "answer": "Simply browse our competitions, select the one you want to enter, choose how many tickets you want, and complete the secure checkout. Your ticket numbers will be emailed to you instantly."},
        {"question": "How are winners selected?", "answer": "Winners are selected using a cryptographically secure random number generator when the competition ends. All draws are conducted fairly and transparently."},
        {"question": "When will I receive my prize?", "answer": "Once you've been confirmed as a winner, we aim to arrange prize delivery within 14 working days. For vehicles, this includes full handover and registration assistance."},
        {"question": "Are the competitions legitimate?", "answer": "Absolutely! x67 Digital is operated by x67 Digital Media Groupe, a UK registered company. All our competitions comply with UK gambling laws and regulations."},
        {"question": "What payment methods do you accept?", "answer": "We accept all major credit and debit cards through our secure payment provider Viva Payments. All transactions are encrypted and secure."},
        {"question": "Can I get a refund?", "answer": "Tickets are non-refundable once purchased as per our terms and conditions. Please only purchase tickets you intend to keep."}
    ]
    
    await db.content.insert_one({"type": "faq", "items": faqs})
    
    # Create sample winners
    winners = [
        {
            "winner_id": f"win_{uuid.uuid4().hex[:12]}",
            "competition_id": "comp_previous_1",
            "competition_title": "Range Rover Sport SVR",
            "user_id": "user_sample_1",
            "user_name": "James T.",
            "winning_ticket": 1847,
            "prize_value": 95000,
            "drawn_at": (datetime.now(timezone.utc) - timedelta(days=30)).isoformat()
        },
        {
            "winner_id": f"win_{uuid.uuid4().hex[:12]}",
            "competition_id": "comp_previous_2",
            "competition_title": "£25,000 Cash",
            "user_id": "user_sample_2",
            "user_name": "Sarah M.",
            "winning_ticket": 456,
            "prize_value": 25000,
            "drawn_at": (datetime.now(timezone.utc) - timedelta(days=15)).isoformat()
        }
    ]
    
    await db.winners.insert_many(winners)
    
    return {"message": "Data seeded successfully", "admin_email": "admin@x67digital.co.uk", "admin_password": "admin123"}

# Include the router
app.include_router(api_router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
