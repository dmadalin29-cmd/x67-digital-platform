# x67 Digital Competition Platform

UK-based prize competition platform for cars, electronics, and cash prizes.

## 🚀 Features

- **Competition System** - Cars, Electronics, Cash categories with countdown timers
- **User Authentication** - Email/Password + Google OAuth
- **Ticket Purchase** - Secure ticket allocation with unique numbers
- **Admin Dashboard** - Full CRUD, winner draws, analytics
- **Modern UI** - Dark theme, responsive, animated

## 🛠 Tech Stack

### Backend
- FastAPI (Python)
- MongoDB
- JWT Authentication
- Resend (Email)

### Frontend
- React 19
- TailwindCSS
- Framer Motion
- Shadcn/UI

## 📋 Setup

### Backend

```bash
cd backend
pip install -r requirements.txt
# Create .env with:
# MONGO_URL=mongodb://localhost:27017
# DB_NAME=x67_digital
# JWT_SECRET=your-secret-key
# RESEND_API_KEY=your-resend-key
uvicorn server:app --reload --port 8001
```

### Frontend

```bash
cd frontend
yarn install
# Create .env with:
# REACT_APP_BACKEND_URL=http://localhost:8001
yarn start
```

## 🔐 Admin Access

- **Email**: admin@x67digital.co.uk
- **Password**: admin123

Run `/api/seed` to populate demo data.

## 📁 Structure

```
/app
├── backend/
│   ├── server.py      # FastAPI application
│   ├── .env           # Environment variables
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/     # Page components
│   │   ├── components/ # UI components
│   │   └── context/   # Auth context
│   └── package.json
```

## 💳 Payment

Currently using **MOCKED Viva Payments**. To enable real payments:
1. Get Viva Payments merchant credentials
2. Add to `.env`:
   - `VIVA_MERCHANT_ID`
   - `VIVA_API_KEY`
   - `VIVA_CLIENT_ID`
   - `VIVA_CLIENT_SECRET`

## 📜 License

x67 Digital Media Groupe © 2026
