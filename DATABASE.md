# 🗄️ BookVerse Database Architecture Documentation

This document describes the PostgreSQL database schema and data models managed by Prisma ORM for the **BookVerse** e-commerce platform.

---

## 1. Relational Entity Diagram

```
 +---------------------------------------------------------------+
 |                             USER                              |
 | id (UUID), name, email, passwordHash, role, phone, avatar     |
 +-------------------+-----------------------+-------------------+
                     |                       |
                     | 1..*                  | 1..*
            +--------v-------+      +--------v--------+
            |    ADDRESS     |      |     ORDER       |
            +----------------+      +--------+--------+
                                             |
                                             | 1..1
                                    +--------v--------+
                                    |    PAYMENT      |
                                    +-----------------+

 +---------------------------------------------------------------+
 |                           CATEGORY                            |
 | id (UUID), name, slug, description, image, sortOrder          |
 +-------------------------------+-------------------------------+
                                 | 1..*
                                 |
                        +--------v--------+
                        |      BOOK       |
                        +--------+--------+
                                 |
         +-----------------------+-----------------------+
         | 1..*                  | 1..*                  | 1..*
+--------v-------+      +--------v--------+     +--------v--------+
|   CART_ITEM    |      |  WISHLIST_ITEM  |     |   ORDER_ITEM    |
+----------------+      +-----------------+     +-----------------+
```

---

## 2. Models Breakdown & Specifications

### 2.1. `User`
- **Primary Key**: `id` (UUID)
- **Email**: Unique, index applied for fast authentication lookups.
- **Role**: `Role` enum (`CUSTOMER`, `ADMIN`).
- **Security**: Passwords hashed using `bcrypt` (10 salt rounds). Plaintext passwords are never stored.

### 2.2. `Book`
- **Primary Key**: `id` (UUID)
- **Slug**: Unique, indexed for SEO-friendly URLs (`/books/[slug]`).
- **Prices**: `originalPrice` and `sellingPrice` stored as **integer paise** (e.g. ₹389.00 = `38900`). This completely avoids floating-point roundoff issues.
- **Stock**: Non-negative integer representing physical stock in the warehouse.
- **Flags**: `featured`, `bestseller`, `staffPick` for curated editorial merchandising.
- **Indexes**: Composite and single indexes on `[categoryId]`, `[slug]`, `[title]`, `[author]`, `[isbn]`.

### 2.3. `Category`
- **Primary Key**: `id` (UUID)
- **Slug**: Unique, indexed for `/categories/[slug]`.
- **Relationship**: One-to-many with `Book`.

### 2.4. `Order` & `OrderItem`
- **Primary Key**: `id` (UUID)
- **Order Number**: Unique human-readable code formatted as `BV-YYYY-XXXXXX`.
- **Status Lifecycle**: `PENDING` -> `CONFIRMED` -> `PROCESSING` -> `SHIPPED` -> `DELIVERED` | `CANCELLED`.
- **Payment Status**: `PENDING` -> `PAID` | `FAILED` | `REFUNDED`.
- **Price Immutability**: `OrderItem.price` preserves the exact price at the moment of checkout, shielding the order history from future catalog price changes.
- **Shipping Address**: Stored as snapshot JSON within `shippingAddressJson` so subsequent address edits by the customer do not alter past shipment records.

### 2.5. `Payment`
- **Primary Key**: `id` (UUID)
- **Relationship**: Strict one-to-one with `Order`.
- **Provider**: Default `"RAZORPAY"`.
- **Transaction Identifiers**: Stores `transactionId` (`razorpay_payment_id`) and digital HMAC `signature`.

### 2.6. `Coupon` & `CouponUsage`
- **Primary Key**: `id` (UUID)
- **Discount Types**: `PERCENTAGE` or `FIXED` amount in paise.
- **Rules**: Supports `minOrderAmount`, `maxDiscountAmount`, `maxUses`, and `validUntil` timestamps.
- **Tracking**: `CouponUsage` logs every redemption tied to `userId` and `orderId`.

### 2.7. `Review`
- **Primary Key**: `id` (UUID)
- **Rating**: Integer between 1 and 5.
- **Verification**: `verifiedPurchase` boolean automatically flagged if the user has an existing confirmed order containing the book.
- **Moderation**: `isApproved` flag allows administrators to hide or show reviews.

---

## 3. Database Maintenance Commands

- **Push Schema changes to PostgreSQL**:
  ```bash
  npx prisma db push
  ```
- **Re-seed Catalog**:
  ```bash
  npx tsx prisma/seed.ts
  ```
- **Inspect Database via Prisma Studio GUI**:
  ```bash
  npx prisma studio
  ```
