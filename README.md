# 📖 BookVerse – Complete Full-Stack Online Bookstore

> *"Every Book Opens a New World."*

BookVerse is a full-stack e-commerce online bookstore tailored for Indian readers, inspired by the cozy, editorial aesthetic of independent literary bookstores (such as Bahrisons in Delhi, Daunt Books in London, and Powell’s in Portland). 

The platform features a customer-facing storefront, complete catalog filtering, persistent shopping cart and wishlist, Razorpay payments, customer order tracking, and a role-protected administrative management console.

---

## 🎨 1. Brand Identity & Design System

- **Warm Ivory (`#F8F5EF`)**: Primary background canvas providing clean literary whitespace.
- **Espresso Brown (`#3D3028`)**: Primary typography and high-contrast navigational elements.
- **Terracotta (`#B87555`)**: Primary brand actions, CTA buttons, and highlight badges.
- **Muted Sage (`#89917B`)**: Secondary genre labels, trust badges, and stock availability tags.
- **Soft Cream (`#FFFDF8`)**: Card backgrounds and drawer panels.
- **Light Beige (`#EDE5D9`)**: Borders, dividers, and pill backgrounds.
- **Typography**: Headings set in *Playfair Display* (classic editorial serif); body typography set in *Plus Jakarta Sans / Inter*.
- **Currency**: Indian Rupees (₹ - INR) stored accurately as integer paise in PostgreSQL.

---

## 🚀 2. Architecture & Technical Stack

- **Framework**: [Next.js 14](https://nextjs.org/) App Router (React 18, TypeScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom design tokens & `@tailwindcss/typography`
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma ORM 5](https://www.prisma.io/)
- **Authentication**: JWT session tokens stored in HTTP-only, secure, `SameSite=Lax` cookies with `jose` and `bcryptjs` password hashing
- **Payments**: [Razorpay](https://razorpay.com/) (UPI, RuPay, Visa, Mastercard, NetBanking) with server-side HMAC-SHA256 signature verification
- **Icons**: [Lucide React](https://lucide.dev/)
- **Toast Notifications**: [Sonner](https://sonner.emilkowal.ski/)
- **Asset Storage**: Cloudinary CDN support & high-resolution remote image optimization

---

## 📂 3. Project Structure

```
├── prisma/
│   ├── schema.prisma       # 17 PostgreSQL models with relations, indexes, cascades
│   └── seed.ts             # Seed script: 31 real books across 11 genres, admin/customer accounts
├── scripts/
│   └── test-e2e.ts         # Automated end-to-end verification suite (18 test scenarios)
├── src/
│   ├── app/
│   │   ├── (store)/
│   │   │   ├── page.tsx                    # Complete 15-section homepage
│   │   │   ├── shop/page.tsx               # Full catalogue with live filters & pagination
│   │   │   ├── categories/[slug]/page.tsx  # Dynamic category landing pages
│   │   │   ├── books/[slug]/page.tsx       # Book details, specs, reviews, related titles
│   │   │   ├── cart/page.tsx               # Reading satchel, stock limit, coupons, delivery
│   │   │   ├── checkout/page.tsx           # Multi-step checkout, addresses, Razorpay / COD
│   │   │   ├── wishlist/page.tsx           # Saved books reading queue
│   │   │   ├── about/page.tsx              # Bookstore heritage & philosophy
│   │   │   └── contact/page.tsx            # Contact form with server-side processing
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx              # Sign-in with 1-click Demo credentials
│   │   │   ├── register/page.tsx           # Customer registration
│   │   │   └── forgot-password/page.tsx    # Password reset request flow
│   │   ├── account/
│   │   │   ├── page.tsx                    # Account hub
│   │   │   ├── orders/page.tsx             # Customer order history
│   │   │   ├── orders/[id]/page.tsx        # Tax invoice & shipment tracking timeline
│   │   │   └── addresses/page.tsx          # Saved delivery locations
│   │   ├── admin/
│   │   │   ├── layout.tsx                  # Protected RBAC layout
│   │   │   ├── page.tsx                    # Executive KPIs & low-stock warnings
│   │   │   ├── books/page.tsx              # Book CRUD with modals & stock controls
│   │   │   ├── categories/page.tsx         # Category taxonomy management
│   │   │   ├── orders/page.tsx             # Fulfillment, courier tracking, refunds
│   │   │   ├── inventory/page.tsx          # Real-time stock audit & inline restock
│   │   │   ├── customers/page.tsx          # Customer directory & lifetime spend
│   │   │   ├── coupons/page.tsx            # Voucher creation & usage tracking
│   │   │   └── reviews/page.tsx            # Reader reviews content moderation
│   │   ├── api/                            # RESTful server route handlers
│   │   ├── robots.ts                       # SEO robots.txt
│   │   └── sitemap.ts                      # SEO dynamic sitemap.xml
│   ├── components/
│   │   ├── layout/                         # AnnouncementBar, Navbar, Footer, CartDrawer, SearchModal
│   │   ├── home/                           # Hero, FeaturedCategories, BookShowcase, Testimonials, Newsletter
│   │   └── books/                          # BookCard, BookGrid, FilterSidebar, MobileFilterDrawer, BookReviews
│   ├── context/                            # AuthContext, CartContext, WishlistContext
│   ├── lib/
│   │   ├── db/prisma.ts                    # Prisma Client singleton
│   │   ├── auth/                           # JWT sign, verify, and session guards (requireAdmin, requireAuth)
│   │   ├── payments/razorpay.ts            # Razorpay order generation & HMAC verification
│   │   └── utils.ts                        # INR currency formatting, date helpers, slugify
│   └── types/                              # TypeScript interfaces
├── .env.example                            # Template environment configuration
├── docker-compose.yml                      # Optional Docker compose for PostgreSQL 16
└── README.md
```

---

## ⚡ 4. Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v24.20)
- PostgreSQL 14+ (or Docker / Colima)

### Installation & Setup

1. **Clone & Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Create a `.env` file in the project root:
   ```env
   # PostgreSQL Connection String
   DATABASE_URL="postgresql://nirikshak:nirikshak_dev_pass@localhost:5432/bookverse?schema=public"

   # Auth & Session Security
   NEXTAUTH_SECRET="bookverse-editorial-bookstore-jwt-secret-2026-secure"
   NEXTAUTH_URL="http://localhost:3000"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"

   # Razorpay Credentials (Test Mode)
   RAZORPAY_KEY_ID="rzp_test_BookVerse2026"
   RAZORPAY_KEY_SECRET="rv9YpLkqQ3t5M6Z7W8B1C2D3"
   NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_BookVerse2026"

   # Cloudinary (Optional)
   CLOUDINARY_CLOUD_NAME="bookverse"
   CLOUDINARY_API_KEY="123456789012345"
   CLOUDINARY_API_SECRET="cloudinary_secret_key_placeholder"
   ```

3. **Initialize Database & Seed Realistic Catalog**
   ```bash
   npx prisma db push
   npx tsx prisma/seed.ts
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

5. **Production Build & Verification**
   ```bash
   npm run build
   npm run start
   ```

---

## 🔐 5. Demo Accounts

The application includes built-in demo accounts pre-seeded with realistic data:

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@bookverse.in` | `Admin@BookVerse2026!` | Full access to `/admin`, book CRUD, inventory, order status updates, and refunds |
| **Customer** | `aarav.sharma@example.in` | `Customer@2026!` | Storefront shopping, order history (`/account/orders`), saved addresses |
| **Customer** | `priya.patel@example.in` | `Customer@2026!` | Storefront shopping, reviews, saved addresses |

> 💡 *Tip: On the `/login` page, you can click "1-Click Customer Demo" or "1-Click Admin Demo" to sign in instantly without typing credentials.*

---

## 🎟️ 6. Active Promotional Coupons

Test these voucher codes during checkout:

- `FIRSTBOOK`: 15% discount (up to ₹150) on minimum cart value of ₹499.
- `BOOKVERSE10`: 10% discount (up to ₹250) on minimum cart value of ₹699.
- `READMORE`: Flat ₹100 discount on minimum cart value of ₹899.

---

## 🧪 7. Automated Testing Suite

To run the automated end-to-end verification suite:

```bash
npx tsx scripts/test-e2e.ts
```

The test runner tests:
1. Storefront HTTP 200 response
2. Catalog API pagination & author/title search
3. Category taxonomy retrieval
4. Single book page data & review aggregations
5. Coupon code validation & minimum order rejection
6. User registration & secure cookie emission
7. Role-Based Access Control (RBAC): verifies admin endpoints reject non-admin users
8. Admin login & metrics calculation
9. Server-side order creation & Razorpay payment signature verification
10. Database stock decrement and order status transition to `CONFIRMED`
11. Reader review publication
12. Newsletter subscription
13. SEO `sitemap.xml` & `robots.txt`

---

## 🛡️ 8. Security Highlights

- **Server-Side Validation**: All forms, coupon calculations, and checkout totals are strictly computed on the server using Zod schemas. Frontend prices are never trusted.
- **Cryptographic Signature Verification**: Razorpay payment signatures are validated using HMAC-SHA256 with the secret key before order confirmation.
- **Role-Based Authorization**: Client-provided roles are rejected. Privileged actions verify the signed session cookie and database user record.
- **Atomic Database Transactions**: Payments, order confirmation, and stock decrements execute inside Prisma `$transaction` blocks to prevent race conditions or negative inventory.

---

## 📜 License
Developed with passion for book lovers. All book descriptions, titles, and cover references correspond to published literary works.
