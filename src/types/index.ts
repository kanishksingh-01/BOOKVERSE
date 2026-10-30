export type Role = "CUSTOMER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string | null;
  avatar?: string | null;
  createdAt?: string | Date;
}

export interface Address {
  id: string;
  userId?: string;
  fullName: string;
  phone: string;
  street: string;
  landmark?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string | null;
  sortOrder?: number;
  bookCount?: number;
}

export interface Book {
  id: string;
  title: string;
  slug: string;
  author: string;
  publisher: string;
  isbn: string;
  description: string;
  originalPrice: number; // in paise
  sellingPrice: number;  // in paise
  discountPercent?: number;
  stock: number;
  pages: number;
  language: string;
  coverImage: string;
  featured?: boolean;
  bestseller?: boolean;
  staffPick?: boolean;
  categoryId: string;
  category?: Category;
  rating?: number;
  reviewCount?: number;
  reviews?: Review[];
  createdAt?: string | Date;
}

export interface CartItem {
  id: string;
  bookId: string;
  book: Book;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  grandTotal: number;
  appliedCoupon?: Coupon | null;
}

export interface WishlistItem {
  id: string;
  bookId: string;
  book: Book;
  addedAt: string | Date;
}

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface OrderItem {
  id: string;
  orderId: string;
  bookId: string;
  book?: Book;
  title: string;
  author: string;
  coverImage: string;
  price: number; // in paise
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: Address;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: "RAZORPAY" | "COD";
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

export interface Review {
  id: string;
  bookId: string;
  userId: string;
  userName: string;
  userAvatar?: string | null;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  isApproved: boolean;
  createdAt: string | Date;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number | null;
  isActive: boolean;
  validUntil: string | Date;
}

export interface FilterState {
  search: string;
  category: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStockOnly?: boolean;
  sortBy: "popularity" | "price-asc" | "price-desc" | "newest" | "rating";
  page: number;
  limit: number;
}
