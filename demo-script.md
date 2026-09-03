# 🎬 Glide — Video Demo Script
> Estimated runtime: ~4–5 minutes

---

## [00:00 – 00:15] COLD OPEN (Screen is black)

> *In a calm, confident voice:*

"What if you could buy a ₹1.5 lakh iPhone — and pay zero interest — using the mutual funds already sitting in your portfolio?

That's exactly what Glide does. Let me walk you through it."

---

## [00:15 – 00:45] HOMEPAGE — HERO SECTION

> *Screen shows: `localhost:5173` — the Glide homepage hero*

"This is Glide — a full-stack fintech shopping platform I built from scratch. The name 'Glide' captures the experience: frictionless, effortless purchasing, powered by your investments.

Right at the top, you can see the tagline:
*'Shop today. Pay later. Powered by your mutual funds.'*

No credit score required. No interest. Your funds keep compounding while you repay."

> *Click the 'Check Eligibility' button in the hero — modal opens*

"There's a quick eligibility modal that explains the 1.5× rule — hold mutual funds worth 1.5 times the product price, and you're instantly eligible. No bank visit. No documents. No CIBIL impact."

> *Close modal, scroll down slowly*

---

## [00:45 – 01:15] HOMEPAGE — HOW IT WORKS + BENEFITS

> *Scroll to the 'How It Works' section*

"The platform walks users through exactly how LAMF — Loan Against Mutual Funds — works:

Step 1: Choose your gadget.
Step 2: Select your EMI tenure — 3 months all the way to 60 months.
Step 3: Your MF units are digitally pledged — they're not sold, they keep earning.
Step 4: EMI is auto-debited monthly. Done."

> *Continue scrolling to the Benefits cards*

"The six benefit cards are designed to answer the biggest objections upfront — no CIBIL check, no credit card required, zero interest for up to 24 months, and your mutual funds continue to compound."

---

## [01:15 – 01:45] EMI CALCULATOR

> *Scroll to the calculator section*

"This is my favorite part of the homepage — an interactive savings calculator.

Drag this slider to change the product price — say, ₹1.2 lakhs for a MacBook Pro.
Pick a 12-month EMI plan.

The calculator shows you exactly how much more you'd pay with a traditional credit card — assuming 18% APR — versus using Glide at 0%.

The difference is immediately visible. This is the core value proposition made tangible."

> *Move slider to ₹1,20,000, let the numbers update*

---

## [01:45 – 02:15] SHOP + PRODUCT CATALOG

> *Click 'Shop Now' in navbar — navigates to /shop*

"Let's head to the shop. You can filter by category — Smartphones, Laptops, Audio — or search by keyword.

Every product card shows the brand, name, MRP with a strikethrough, and the monthly EMI starting price in bold.

That '0% for 24m' badge is key — it's the first thing a value-conscious buyer looks for."

> *Click 'Laptops' filter*

"Filtering is instant — the API query goes to the backend with a category parameter, Neon PostgreSQL returns the result, and the UI updates in milliseconds."

> *Click a laptop product card (e.g., MacBook Pro)*

---

## [02:15 – 03:00] PRODUCT DETAIL PAGE

> *Now on `/products/macbook-pro-14-m4`*

"This is the product detail page. On the left, I have the product image with a gallery. On the right — all the buying decisions.

First: variant selection. I can switch storage — 16GB, 32GB — and the image, price, and EMI plans all update instantly.

Notice the color swatches — clicking midnight black, for instance, crossfades the image with a smooth transition.

Now the EMI plans — these are fetched live from the database. I can see 7 plan options. The first four — 3, 6, 12, and 24 months — show a green '0% Interest' badge. Plans beyond 24 months are at 10.5% annually.

Every plan also shows the liquid mutual fund name backing it — Parag Parikh Liquid Fund, Mirae Asset Liquid Fund — and a flat ₹7,500 cashback."

> *Select 12-month plan, click Add to Cart*

"Adding to cart — you see a toast notification appear in the corner with a 'View Cart' quick link. This is non-blocking; I can keep shopping."

---

## [03:00 – 03:30] CART + CHECKOUT

> *Navigate to /cart*

"The cart shows the item — MacBook Pro, Midnight Black, 1TB — the selected EMI plan details, and the monthly outflow.

I love this in-cart plan switcher. Without leaving the cart, I can change my EMI from 12 months to 24 months, and the monthly amount updates instantly. No page refresh, no re-adding the item.

The order summary at the bottom shows total device value and total monthly EMI. Cart state is persisted in localStorage — so even if I refresh, my cart is intact."

> *Click 'Proceed to Checkout'*

"Checkout walks through a mock pledge flow — enter your PAN, complete Aadhaar OTP verification, and confirm the digital lien on your mutual fund portfolio.

In a production system, this connects to BSE StarMF and the NSDL pledge API. For this demo, it's a realistic simulation."

> *Submit — confirmation screen appears*

"And here's the confirmation — unique order reference, expected delivery, auto-debit start date, and cashback credit within 24 hours. Clean, reassuring, and informative."

---

## [03:30 – 03:55] CHATBOT

> *Navigate back to homepage, open the chat widget*

"Finally — the floating assistant. It appears on every page. Let me open it."

> *Click the chatbot button, wait for it to expand*

"I can click a quick-reply chip — 'Am I eligible?' — and instantly get an answer. The response is rule-based on the server, so there's zero latency and no LLM API costs. It covers all the common fintech questions — eligibility, CIBIL impact, fund safety, cashback, documents needed."

> *Click 'What documents do I need?'*

"It's designed to reduce drop-off by answering hesitations at exactly the moment the user has them — right when they're considering buying."

---

## [03:55 – 04:20] TECH STACK CALLOUT (Optional — show a split screen or code briefly)

"Under the hood, Glide is a proper full-stack monorepo.

The **backend** is Node.js and Express, with a Prisma ORM connected to a Neon serverless PostgreSQL database. The database is seeded with 6 products, 21 variants, and 147 EMI plans.

The **frontend** is React 19 with Vite, using React Router v7 for SPA navigation and Tailwind CSS v4 for the design system. All cart state lives in a React Context backed by localStorage.

The **chatbot** runs on the server — a keyword-matching FAQ engine — no external LLM dependencies, instant and free.

Everything is production-ready — just swap in a real `DATABASE_URL` and deploy the frontend to Vercel."

---

## [04:20 – 04:40] CLOSING

> *Go back to the homepage hero*

"That's Glide — a portfolio-grade fintech app with a real backend, a live database, and a complete user journey from browsing to checkout.

The design is inspired by 1fi.in, one of India's leading LAMF platforms. The concept is real, the tech is real, and the user experience is production-quality.

If you'd like to explore the code, the README at the root of the repository documents every API, the database schema, and local setup instructions.

Thanks for watching."

> *Fade out.*

---

## 📋 Quick Cheat Sheet for Recording

| Timestamp | What to show |
|-----------|-------------|
| 00:00 | Black screen / logo fade |
| 00:15 | Homepage hero — `localhost:5173` |
| 00:35 | Eligibility modal (click, then close) |
| 00:45 | Scroll → How It Works |
| 01:00 | Scroll → Benefits cards |
| 01:15 | EMI Calculator — move slider |
| 01:45 | Click 'Shop' → /shop |
| 01:55 | Click 'Laptops' filter |
| 02:05 | Click MacBook Pro card |
| 02:15 | PDP — switch variant, select 12m plan |
| 02:40 | Click Add to Cart → toast |
| 03:00 | Navigate to /cart |
| 03:10 | Switch plan in cart |
| 03:20 | Checkout → confirmation |
| 03:30 | Open chatbot, click quick reply |
| 03:55 | Optional: brief code/terminal shot |
| 04:20 | Back to hero, closing words |

