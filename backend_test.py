import requests
import sys
import json
from datetime import datetime

class X67DigitalAPITester:
    def __init__(self, base_url="https://x67-live-draws.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.token = None
        self.admin_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "test": name,
            "passed": success,
            "details": details
        })

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        if headers:
            test_headers.update(headers)
        
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers)

            success = response.status_code == expected_status
            if success:
                try:
                    response_data = response.json()
                    print(f"   Status: {response.status_code}")
                    self.log_test(name, True)
                    return True, response_data
                except:
                    print(f"   Status: {response.status_code} (no JSON response)")
                    self.log_test(name, True)
                    return True, {}
            else:
                error_msg = f"Expected {expected_status}, got {response.status_code}"
                try:
                    error_data = response.json()
                    error_msg += f" - {error_data.get('detail', '')}"
                except:
                    error_msg += f" - {response.text[:100]}"
                print(f"   Status: {response.status_code}")
                self.log_test(name, False, error_msg)
                return False, {}

        except Exception as e:
            error_msg = f"Request failed: {str(e)}"
            print(f"   Error: {error_msg}")
            self.log_test(name, False, error_msg)
            return False, {}

    def test_basic_endpoints(self):
        """Test basic API endpoints"""
        print("\n=== TESTING BASIC ENDPOINTS ===")
        
        # Test root endpoint
        self.run_test("API Root", "GET", "", 200)
        
        # Test public endpoints
        self.run_test("Get Competitions", "GET", "competitions", 200)
        self.run_test("Get Featured Competitions", "GET", "competitions/featured", 200)
        self.run_test("Get Winners", "GET", "winners", 200)
        self.run_test("Get FAQ", "GET", "content/faq", 200)

    def test_user_registration(self):
        """Test user registration flow"""
        print("\n=== TESTING USER REGISTRATION ===")
        
        test_email = f"test_{datetime.now().strftime('%Y%m%d_%H%M%S')}@example.com"
        user_data = {
            "email": test_email,
            "password": "testpass123",
            "full_name": "Test User",
            "phone": "07123456789"
        }
        
        success, response = self.run_test("User Registration", "POST", "auth/register", 200, user_data)
        if success and 'token' in response:
            self.token = response['token']
            print(f"   Registered user: {response['user']['email']}")
            return True
        return False

    def test_user_login(self):
        """Test regular user login"""
        print("\n=== TESTING USER LOGIN ===")
        
        # Try to login with test credentials (if registration worked)
        if hasattr(self, 'registered_email') and hasattr(self, 'registered_password'):
            login_data = {
                "email": self.registered_email,
                "password": self.registered_password
            }
            success, response = self.run_test("User Login", "POST", "auth/login", 200, login_data)
            if success and 'token' in response:
                self.token = response['token']
                return True
        return False

    def test_admin_login(self):
        """Test admin login"""
        print("\n=== TESTING ADMIN LOGIN ===")
        
        admin_data = {
            "email": "admin@x67digital.co.uk",
            "password": "admin123"
        }
        
        success, response = self.run_test("Admin Login", "POST", "auth/login", 200, admin_data)
        if success and 'token' in response:
            self.admin_token = response['token']
            print(f"   Logged in as: {response['user']['email']} ({response['user']['role']})")
            return True
        return False

    def test_protected_endpoints(self):
        """Test protected endpoints with token"""
        if not self.token:
            print("\n⚠️  Skipping protected endpoint tests - no user token available")
            return
            
        print("\n=== TESTING PROTECTED ENDPOINTS ===")
        
        headers = {"Authorization": f"Bearer {self.token}"}
        
        # Test /auth/me
        self.run_test("Get Current User", "GET", "auth/me", 200, headers=headers)
        
        # Test getting user orders
        self.run_test("Get My Orders", "GET", "orders/my", 200, headers=headers)
        
        # Test getting user tickets
        self.run_test("Get My Tickets", "GET", "tickets/my", 200, headers=headers)

    def test_admin_endpoints(self):
        """Test admin-only endpoints"""
        if not self.admin_token:
            print("\n⚠️  Skipping admin endpoint tests - no admin token available")
            return
            
        print("\n=== TESTING ADMIN ENDPOINTS ===")
        
        headers = {"Authorization": f"Bearer {self.admin_token}"}
        
        # Test admin stats
        self.run_test("Get Admin Stats", "GET", "admin/stats", 200, headers=headers)
        
        # Test admin competitions list
        self.run_test("Get All Competitions (Admin)", "GET", "admin/competitions", 200, headers=headers)
        
        # Test admin users list
        self.run_test("Get All Users (Admin)", "GET", "admin/users", 200, headers=headers)
        
        # Test admin orders list
        self.run_test("Get All Orders (Admin)", "GET", "admin/orders", 200, headers=headers)

    def test_competition_flow(self):
        """Test competition-related endpoints"""
        print("\n=== TESTING COMPETITION FLOW ===")
        
        # Get competitions and test specific competition
        success, competitions = self.run_test("Get Competitions", "GET", "competitions", 200)
        
        if success and competitions:
            # Test first competition detail
            first_comp = competitions[0]
            comp_id = first_comp['competition_id']
            self.run_test("Get Competition Detail", "GET", f"competitions/{comp_id}", 200)
            
            # Test ticket purchase (if user logged in)
            if self.token:
                headers = {"Authorization": f"Bearer {self.token}"}
                purchase_data = {
                    "competition_id": comp_id,
                    "quantity": 1
                }
                success, order = self.run_test("Purchase Tickets", "POST", "tickets/purchase", 200, purchase_data, headers=headers)
                
                if success and 'order_id' in order:
                    order_id = order['order_id']
                    # Test order confirmation (MOCKED payment)
                    self.run_test("Confirm Order (MOCKED)", "POST", f"orders/{order_id}/confirm", 200, headers=headers)

    def test_data_seeding(self):
        """Test data seeding endpoint"""
        print("\n=== TESTING DATA SEEDING ===")
        
        self.run_test("Seed Demo Data", "POST", "seed", 200)

    def print_summary(self):
        """Print test summary"""
        print("\n" + "="*60)
        print(f"TEST SUMMARY")
        print("="*60)
        print(f"Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Tests Failed: {self.tests_run - self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%" if self.tests_run > 0 else "No tests run")
        
        if self.tests_run - self.tests_passed > 0:
            print("\nFailed Tests:")
            for result in self.test_results:
                if not result['passed']:
                    print(f"  ❌ {result['test']}: {result['details']}")
        
        return self.tests_passed == self.tests_run

def main():
    print("🚀 Starting x67 Digital API Tests...")
    print(f"Testing API at: https://x67-live-draws.preview.emergentagent.com/api")
    
    tester = X67DigitalAPITester()
    
    # Run all tests in sequence
    tester.test_basic_endpoints()
    tester.test_data_seeding()  # Seed data first
    
    # Test authentication flows
    tester.test_user_registration()
    tester.test_admin_login()
    
    # Test protected endpoints
    tester.test_protected_endpoints()
    tester.test_admin_endpoints()
    
    # Test core functionality
    tester.test_competition_flow()
    
    # Print final results
    success = tester.print_summary()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())