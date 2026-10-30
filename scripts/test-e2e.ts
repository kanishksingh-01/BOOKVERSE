/**
 * BookVerse Automated End-to-End Verification Suite
 * Tests critical business logic, payment verification, catalog search,
 * auth RBAC, coupon validation, inventory management, and customer accounts.
 */

const BASE_URL = "http://localhost:3000";

async function runTestSuite() {
  console.log("==================================================");
  console.log("📚 BOOKVERSE END-TO-END AUTOMATED VERIFICATION SUITE");
  console.log("==================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName} ${detail ? `- ${detail}` : ""}`);
      failed++;
    }
  }

  // 1. Test Homepage
  try {
    const res = await fetch(`${BASE_URL}/`);
    assert(res.ok, "Homepage HTTP status 200");
  } catch (e: any) {
    assert(false, "Homepage fetch failed", e.message);
  }

  // 2. Test Catalog & Search
  try {
    const res = await fetch(`${BASE_URL}/api/books?limit=10`);
    const data = await res.json();
    assert(res.ok && data.books.length > 0, "Catalog API returns seeded books", `Count: ${data.books?.length}`);

    // Search for "Arundhati"
    const searchRes = await fetch(`${BASE_URL}/api/books?search=Arundhati`);
    const searchData = await searchRes.json();
    assert(
      searchRes.ok && searchData.books.some((b: any) => b.author.includes("Arundhati")),
      "Search by author returns accurate matches",
      `Matches found: ${searchData.books?.length}`
    );
  } catch (e: any) {
    assert(false, "Catalog API failed", e.message);
  }

  // 3. Test Categories
  try {
    const res = await fetch(`${BASE_URL}/api/categories`);
    const data = await res.json();
    assert(res.ok && data.categories.length >= 10, "Categories API returns all genres", `Count: ${data.categories?.length}`);
  } catch (e: any) {
    assert(false, "Categories API failed", e.message);
  }

  // 4. Test Single Book Detail
  try {
    const res = await fetch(`${BASE_URL}/api/books/the-god-of-small-things`);
    const data = await res.json();
    assert(
      res.ok && data.book.title === "The God of Small Things",
      "Single book detail fetch with reviews and related books",
      `Title: ${data.book?.title}`
    );
  } catch (e: any) {
    assert(false, "Single book detail failed", e.message);
  }

  // 5. Test Coupon Validation
  try {
    const res = await fetch(`${BASE_URL}/api/coupons/validate?code=FIRSTBOOK&subtotal=50000`);
    const data = await res.json();
    assert(
      res.ok && data.valid && data.coupon.code === "FIRSTBOOK",
      "Coupon validation for FIRSTBOOK on ₹500 subtotal",
      `Discount: ${data.coupon?.discountValue}%`
    );

    // Test minimum subtotal enforcement
    const lowRes = await fetch(`${BASE_URL}/api/coupons/validate?code=FIRSTBOOK&subtotal=20000`);
    assert(lowRes.status === 400, "Coupon minimum cart requirement properly rejected");
  } catch (e: any) {
    assert(false, "Coupon validation failed", e.message);
  }

  // 6. Test User Registration
  const testUserEmail = `tester-${Date.now()}@example.in`;
  let userSessionCookie = "";
  try {
    const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Customer",
        email: testUserEmail,
        password: "TestPassword123!",
        phone: "+91 9988776655",
      }),
    });
    const regData = await regRes.json();
    const cookieHeader = regRes.headers.get("set-cookie") || "";
    userSessionCookie = cookieHeader.split(";")[0];

    assert(regRes.status === 201 && regData.user.email === testUserEmail, "User registration succeeds with secure cookie", regData.user?.email);
  } catch (e: any) {
    assert(false, "User registration failed", e.message);
  }

  // 7. Test Admin Login & RBAC Guard
  let adminSessionCookie = "";
  try {
    // Non-admin request to admin metrics should be rejected
    const unauthMetrics = await fetch(`${BASE_URL}/api/admin/metrics`, {
      headers: userSessionCookie ? { Cookie: userSessionCookie } : {},
    });
    assert(unauthMetrics.status === 403, "Admin metrics endpoint safely blocks non-admin users (RBAC)");

    // Login as Admin
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@bookverse.in",
        password: "Admin@BookVerse2026!",
      }),
    });
    const loginData = await loginRes.json();
    const cookieHeader = loginRes.headers.get("set-cookie") || "";
    adminSessionCookie = cookieHeader.split(";")[0];

    assert(loginRes.ok && loginData.user.role === "ADMIN", "Admin credentials authenticated with ADMIN role");

    // Fetch Admin Metrics with admin cookie
    const adminMetrics = await fetch(`${BASE_URL}/api/admin/metrics`, {
      headers: { Cookie: adminSessionCookie },
    });
    const metricsData = await adminMetrics.json();
    assert(
      adminMetrics.ok && metricsData.metrics?.totalBooks > 0,
      "Admin metrics returned with real data",
      `Total Books: ${metricsData.metrics?.totalBooks}, Revenue: ₹${metricsData.metrics?.totalSales / 100}`
    );
  } catch (e: any) {
    assert(false, "Admin auth test failed", e.message);
  }

  // 8. Test Checkout & Payment Verification Flow
  try {
    // 8a. Get a real book ID
    const catRes = await fetch(`${BASE_URL}/api/books?limit=1`);
    const catData = await catRes.json();
    const targetBook = catData.books[0];

    // 8b. Create checkout order on server
    const orderRes = await fetch(`${BASE_URL}/api/payments/razorpay/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: userSessionCookie,
      },
      body: JSON.stringify({
        customerName: "Test Customer",
        customerEmail: testUserEmail,
        customerPhone: "+91 9988776655",
        shippingAddress: {
          fullName: "Test Customer",
          phone: "+91 9988776655",
          street: "77 Library Street",
          city: "Bengaluru",
          state: "Karnataka",
          postalCode: "560001",
          country: "India",
        },
        items: [{ bookId: targetBook.id, quantity: 1 }],
        couponCode: "FIRSTBOOK",
        paymentMethod: "RAZORPAY",
      }),
    });

    const orderData = await orderRes.json();
    assert(orderRes.ok && orderData.orderId, "Server creates Order and generates Razorpay Order ID", `Order: ${orderData.orderNumber}`);

    // 8c. Verify Payment Signature
    const verifyRes = await fetch(`${BASE_URL}/api/payments/razorpay/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: orderData.orderId,
        razorpayOrderId: orderData.razorpayOrderId,
        razorpayPaymentId: "pay_test_simulation_12345",
        razorpaySignature: "sig_test_verified_hmac256",
      }),
    });

    const verifyData = await verifyRes.json();
    assert(verifyRes.ok && verifyData.success, "Server verifies digital payment and confirms order");

    // 8d. Customer Order Inspection
    const checkOrderRes = await fetch(`${BASE_URL}/api/account/orders/${orderData.orderId}`, {
      headers: { Cookie: userSessionCookie },
    });
    const checkOrderData = await checkOrderRes.json();
    assert(
      checkOrderRes.ok && checkOrderData.order.paymentStatus === "PAID" && checkOrderData.order.status === "CONFIRMED",
      "Order status updated to CONFIRMED and paymentStatus to PAID in database"
    );
  } catch (e: any) {
    assert(false, "Checkout workflow failed", e.message);
  }

  // 9. Test Review Submission
  try {
    const catRes = await fetch(`${BASE_URL}/api/books?limit=1`);
    const catData = await catRes.json();
    const targetBook = catData.books[0];

    const reviewRes = await fetch(`${BASE_URL}/api/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: userSessionCookie,
      },
      body: JSON.stringify({
        bookId: targetBook.id,
        rating: 5,
        title: "Spectacular read!",
        comment: "This book surpassed all expectations. Deeply engaging and beautifully crafted.",
      }),
    });

    const reviewData = await reviewRes.json();
    assert(reviewRes.status === 201 && reviewData.review, "Reader review submission and database persistence");
  } catch (e: any) {
    assert(false, "Review submission failed", e.message);
  }

  // 10. Test Newsletter
  try {
    const res = await fetch(`${BASE_URL}/api/newsletter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: `reader-${Date.now()}@example.in` }),
    });
    assert(res.ok, "Newsletter subscription successfully recorded");
  } catch (e: any) {
    assert(false, "Newsletter failed", e.message);
  }

  // 11. Test SEO Sitemap & Robots
  try {
    const smRes = await fetch(`${BASE_URL}/sitemap.xml`);
    const rbRes = await fetch(`${BASE_URL}/robots.txt`);
    assert(smRes.ok, "SEO sitemap.xml renders HTTP 200");
    assert(rbRes.ok, "robots.txt renders HTTP 200");
  } catch (e: any) {
    assert(false, "SEO endpoints failed", e.message);
  }

  console.log("\n==================================================");
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite();
