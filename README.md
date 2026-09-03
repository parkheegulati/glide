# Glide — Mutual Fund-Backed No-Cost EMI Shopping Platform

**"Shop today. Pay later. Powered by your mutual funds."**

Glide is a portfolio-grade, full-stack fintech shopping platform inspired by **1fi.in** (India's leading LAMF — Loan Against Mutual Funds — shopping platform). It enables users to purchase flagship smartphones, laptops, and audio gear with **0% interest EMI plans** backed by their existing liquid mutual fund investments.

---

## 🌟 Key Features

1. **Fintech Marketing Homepage (`/`)**:
   - Confident fintech design system (`#5B21B6` deep violet token, `#FAF9FC` soft background, `#15803D` 0% badge).
   - Rotating hero product showcase with interactive switcher pills.
   - Best Sellers grid linking directly to Product Detail Pages.
   - 4-step "How it Works" guide and 6-card "Key Benefits" grid.
   - Interactive **Savings & EMI Calculator** comparing mutual fund compounding growth vs credit cards.
   - Verified customer stories carousel and FAQ accordion.
   - Instant Credit Eligibility checker modal.
2. **Product Catalog & Shop (`/shop`)**:
   - Filter by Category (Smartphones, Laptops, Audio), search keyword, price slider, and sort options.
   - Direct "Add to Cart" quick-action alongside "View Details".
3. **Product Detail Page (`/products/:slug`)**:
   - Interactive finish swatches and storage capacity selector with smooth cross-fade.
   - 7-tier EMI plan selector (3, 6, 12, 24m at 0% interest, 36, 48, 60m at 10.5%).
   - "Add to Cart" (toast notification) and "Buy Now" (routes directly to `/cart`).
   - "Why EMI with Glide?" trust strip.
4. **Cart (`/cart`)**:
   - Line items with product thumbnail, variant details, and selected EMI breakdown.
   - **In-cart plan switcher**: change EMI tenure on the fly per line item.
   - Order summary with breakdown of total device value, monthly EMI outflow by item, and total cashback.
   - Automatic `localStorage` persistence via global `CartContext`.
5. **Instant Digital Checkout (`/checkout`)**:
   - Mock paperless mutual fund pledge simulator via CAMS / KFintech.
   - Instant order confirmation screen with EMI repayment dates and tracking info.
6. **Floating Fintech Assistant Chatbot (All Pages)**:
   - Expandable chat widget with fintech knowledge base, quick prompt chips, and typing indicator.
   - Backed by `POST /api/chat`.

---

## 🏗️ Architecture & Demo vs Production Scope

| Layer / Feature | Scope | Implementation Details |
|---|---|---|
| **Products & Variants** | **Backend-driven** | Stored in Neon PostgreSQL via Prisma (`Product`, `ProductVariant`). Served via Express REST APIs. |
| **EMI Plans & Logic** | **Backend-driven** | 7-tier plans per variant in PostgreSQL (`EmiPlan`), calculated with standard financial amortization and liquid fund data. |
| **Catalog Filtering & Search** | **Backend-driven + Frontend UI** | Supported via `GET /api/products?category=&search=` with server-side SQL queries + fast client filters. |
| **Chatbot API** | **Backend-driven** | Handled via Express `POST /api/chat` with fintech FAQ rule engine. |
| **Cart State** | **Frontend-only Demo** | Managed via React Context and persisted in browser `localStorage`. (No backend session table needed for demo scope). |
| **Checkout & KYC Simulation** | **Frontend-only Demo** | Simulated digital lien marking & OTP flow with order confirmation screen (clearly labeled demo). |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, React Router v7, Tailwind CSS v4, Context API |
| **Backend** | Node.js, Express, CORS, dotenv |
| **Database** | PostgreSQL ([Neon](https://neon.tech)) |
| **ORM** | Prisma 6 |

---

## 📁 Repository Structure

```
1fi/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx               # Header with wordmark, links, and cart badge
│   │   │   ├── Footer.jsx               # Dark footer band (#0F0A1A)
│   │   │   ├── ProductCard.jsx          # Catalog card with MRP, 0% badge, quick add
│   │   │   ├── VariantSelector.jsx      # Storage and color swatch picker
│   │   │   ├── EmiPlanList.jsx          # Radio group for 7 EMI plans
│   │   │   ├── EmiCalculator.jsx        # Interactive compounding savings calculator
│   │   │   ├── TestimonialsCarousel.jsx # Customer quotes carousel
│   │   │   ├── FaqAccordion.jsx         # Expandable FAQ questions
│   │   │   └── ChatWidget.jsx           # Floating assistant chatbot
│   │   ├── context/
│   │   │   └── CartContext.jsx          # Global cart state with localStorage sync
│   │   ├── pages/
│   │   │   ├── Home.jsx                 # Full 1fi-style marketing homepage
│   │   │   ├── Shop.jsx                 # Filterable product catalog
│   │   │   ├── ProductDetail.jsx        # 2-column PDP with EMI stack
│   │   │   ├── Cart.jsx                 # Shopping cart with in-cart plan changer
│   │   │   └── Checkout.jsx             # Mutual fund pledge checkout flow
│   │   ├── api.js                       # API client helpers
│   │   ├── index.css                    # Design tokens & animations
│   │   └── App.jsx                      # Route definitions
│   └── vite.config.js                   # Vite dev server + backend proxy
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma                # Relational schema (Product, Variant, EmiPlan)
│   │   └── seed.js                      # Seed data: 6 products, 21 variants, 147 EMI plans
│   ├── src/
│   │   ├── index.js                     # Express app setup
│   │   └── routes/
│   │       ├── products.js              # GET /api/products, /api/products/:slug
│   │       └── chat.js                  # POST /api/chat
│   └── public/images/                   # High-res product imagery
├── package.json                         # Monorepo scripts (concurrent dev)
└── README.md                            # Documentation
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Neon PostgreSQL database connection string (`DATABASE_URL`)

### 1. Installation

```bash
# Clone the repository
git clone <repo-url>
cd 1fi

# Install dependencies across monorepo
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### 2. Configure Environment

Create `backend/.env`:
```env
DATABASE_URL="postgresql://<user>:<password>@<host>/<db>?sslmode=require"
PORT=3001
```

### 3. Migrate and Seed Database

```bash
cd backend
npx prisma db push
node prisma/seed.js
cd ..
```

*This seeds 6 products (iPhone 17 Pro, Galaxy S24 Ultra, OnePlus 13, MacBook Pro 14" M4, Dell XPS 15, Sony WH-1000XM5) across 3 categories with 21 variants and 147 EMI plans.*

### 4. Start Development Servers

From the root directory:
```bash
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001

---

## 📡 API Reference

### `GET /api/products`
Fetch products with optional category and search filters.

**Query Parameters:**
- `category` *(optional)*: `Smartphones`, `Laptops`, `Audio`
- `search` *(optional)*: Search query string

**Response:**
```json
[
  {
    "id": "3275959d-a2b9-450b-8782-48a3f165edfa",
    "slug": "iphone-17-pro",
    "name": "iPhone 17 Pro",
    "brand": "Apple",
    "category": "Smartphones",
    "description": "iPhone 17 Pro features the A19 Pro chip...",
    "defaultVariant": {
      "id": "9a4862b7-590a-4671-a1fe-ffcd2e02c630",
      "variantLabel": "256GB · Natural Titanium",
      "mrp": "134900.00",
      "price": "127400.00",
      "imageUrl": "/images/iphone-17-pro-natural.png",
      "lowestEmi": {
        "monthlyAmount": "2738.00",
        "tenureMonths": 60
      }
    }
  }
]
```

---

### `GET /api/products/:slug`
Full product details including all variants and EMI plans.

**Response:**
```json
{
  "id": "3275959d-a2b9-450b-8782-48a3f165edfa",
  "slug": "iphone-17-pro",
  "name": "iPhone 17 Pro",
  "brand": "Apple",
  "category": "Smartphones",
  "colors": [
    { "name": "Natural Titanium", "hex": "#C2B8A3" },
    { "name": "Desert Titanium", "hex": "#C4A882" },
    { "name": "Black Titanium", "hex": "#3C3C3C" }
  ],
  "storages": ["256GB", "512GB"],
  "variants": [
    {
      "id": "9a4862b7-590a-4671-a1fe-ffcd2e02c630",
      "variantLabel": "256GB · Natural Titanium",
      "storage": "256GB",
      "color": "Natural Titanium",
      "colorHex": "#C2B8A3",
      "mrp": "134900.00",
      "price": "127400.00",
      "imageUrl": "/images/iphone-17-pro-natural.png",
      "stock": 50,
      "isDefault": true,
      "emiPlans": [
        {
          "id": "plan-uuid",
          "tenureMonths": 12,
          "monthlyAmount": "10617.00",
          "interestRate": "0.00",
          "cashbackAmount": "7500.00",
          "fundName": "SBI Liquid Fund"
        }
      ]
    }
  ]
}
```

---

### `POST /api/chat`
Fintech chatbot query endpoint.

**Request:**
```json
{
  "message": "Am I eligible for 0% EMI?"
}
```

**Response:**
```json
{
  "reply": "No CIBIL or credit score check is required! Anyone holding liquid, debt, or equity mutual funds with top AMCs worth at least 1.5× the gadget value is instantly eligible.",
  "source": "rule-based"
}
```

---

## 🗄️ Database Schema & ER Diagram

```
Product
  ├── id          UUID (PK)
  ├── slug        String (unique)
  ├── name        String
  ├── brand       String
  ├── category    String
  ├── description String
  └── createdAt   DateTime

ProductVariant
  ├── id           UUID (PK)
  ├── productId    UUID (FK → Product)
  ├── variantLabel String
  ├── storage      String
  ├── color        String
  ├── colorHex     String
  ├── mrp          Decimal(12,2)
  ├── price        Decimal(12,2)
  ├── imageUrl     String
  ├── stock        Int
  └── isDefault    Boolean

EmiPlan
  ├── id             UUID (PK)
  ├── variantId      UUID (FK → ProductVariant)
  ├── tenureMonths   Int
  ├── monthlyAmount  Decimal(12,2)
  ├── interestRate   Decimal(5,2)
  ├── cashbackAmount Decimal(12,2)
  ├── fundName       String
  └── isActive       Boolean
```

**Relationship:**
```
Product (1) ──< ProductVariant (1) ──< EmiPlan (*)
```

---

## 🚢 Deployment Guide

### Deploying Backend (Render / Railway)
- **Environment Variables**: `DATABASE_URL`, `PORT=3001`
- **Build Command**: `npm install && npx prisma db push`
- **Start Command**: `node src/index.js`

### Deploying Frontend (Vercel)
- **Environment Variables**: `VITE_API_BASE_URL=https://your-backend.onrender.com`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

---

## ⚖️ License & Disclaimer

This project is built for technical portfolio and educational demonstration purposes. All trademarked brand names and logos (Apple, Samsung, Dell, Sony, Axis, HDFC, SBI) belong to their respective owners.
