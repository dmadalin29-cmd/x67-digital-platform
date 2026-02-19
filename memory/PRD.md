# x67 Digital Competition Platform - PRD

## Project Overview
**Brand**: x67 Digital  
**Legal Entity**: x67 Digital Media Groupe  
**Domain**: x67digital.co.uk

UK-based prize competition platform for cars, electronics, and cash prizes.

---

## User Personas

### 1. Competition Entrant (Primary)
- UK adults 18+ interested in prize competitions
- Wants to win luxury cars, electronics, cash
- Values trust, transparency, and ease of use

### 2. Admin/Operator
- Platform manager
- Needs to create/manage competitions
- Draw winners, process refunds, view analytics

---

## Core Requirements (Static)

1. **Competitions System**
   - Categories: Cars, Electronics, Cash
   - Auto-draw when timer ends or sold out
   - Countdown timers, ticket numbering
   - Random winner generator

2. **User System**
   - Registration/Login (Email + Google OAuth)
   - User dashboard (tickets, orders, entries)
   - Email verification

3. **Payment System**
   - Viva Payments integration (MOCKED)
   - Order confirmation emails

4. **Admin Panel**
   - CRUD for competitions
   - User management
   - Order management
   - Revenue analytics
   - Winner draws

5. **Legal Pages**
   - Terms & Conditions
   - Privacy Policy
   - FAQ

---

## What's Been Implemented (Jan 2026)

### Backend (FastAPI + MongoDB)
- [x] User authentication (JWT + Google OAuth via Emergent)
- [x] Competition CRUD APIs
- [x] Ticket purchase system
- [x] Order management
- [x] Winner drawing (cryptographically secure)
- [x] Admin statistics
- [x] Email notifications (Resend)
- [x] FAQ/Content management

### Frontend (React 19 + TailwindCSS)
- [x] Homepage with hero, featured competitions
- [x] Competitions listing with filters
- [x] Competition detail with countdown, purchase
- [x] Login/Register with Google OAuth
- [x] User dashboard (tickets, orders)
- [x] Admin dashboard (overview, competitions, users, orders)
- [x] Winners page
- [x] FAQ page with accordion
- [x] Terms & Privacy pages
- [x] Mobile-responsive dark theme UI

### Design System
- Unbounded font for headings
- Manrope for body text
- Gold (#D4AF37) primary accent
- Cyan (#00F0FF) secondary accent
- Dark background (#050505)
- Glass-morphism effects

---

## Prioritized Backlog

### P0 - Critical (Before Launch)
- [ ] Integrate real Viva Payments (requires API keys)
- [ ] Email verification flow
- [ ] Invoice/receipt generation
- [ ] GDPR cookie consent banner

### P1 - High Priority
- [ ] Live draw animation page
- [ ] Referral system
- [ ] Discount codes
- [ ] Newsletter signup

### P2 - Medium Priority
- [ ] Abandoned cart recovery
- [ ] Homepage banners management (admin)
- [ ] CSV export for participants
- [ ] System logs viewer

### P3 - Nice to Have
- [ ] Email marketing integration
- [ ] Testimonials management
- [ ] Social sharing buttons
- [ ] Mobile app (React Native)

---

## Next Action Items

1. **Viva Payments Integration** - Replace mocked payments with real integration (requires merchant credentials)
2. **Email Verification** - Add verification token flow for new registrations
3. **SEO Optimization** - Add meta tags, structured data for competitions
4. **Live Draw Page** - Create animated draw experience for transparency
5. **Cookie Consent** - GDPR-compliant cookie banner

---

## Technical Notes

- **GitHub**: https://github.com/dmadalin29-cmd/x67-digital-platform
- **Admin Credentials**: admin@x67digital.co.uk / admin123
- **Payment Status**: MOCKED (auto-confirms orders for testing)
- **Email Service**: Resend API integrated

---

*Last Updated: January 2026*
