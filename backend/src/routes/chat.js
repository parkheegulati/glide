const express = require("express");
const router = express.Router();

const FAQ_KNOWLEDGE = [
  {
    keywords: ["what is glide", "about glide", "what is this", "how glide works"],
    reply:
      "Glide is a mutual-fund-backed shopping platform that allows you to buy flagship gadgets with 0% interest EMI. Instead of traditional credit checks or high credit card interest, your existing mutual fund investments secure your purchase while continuing to earn market returns!",
  },
  {
    keywords: ["eligibility", "eligible", "cibil", "credit score", "credit check", "qualify"],
    reply:
      "No CIBIL or credit score check is required! Anyone holding liquid, debt, or equity mutual funds with top AMCs (like Axis, HDFC, SBI, ICICI) worth at least 1.5× the gadget value is instantly eligible.",
  },
  {
    keywords: ["interest", "interest rate", "0%", "zero cost", "charges", "hidden fees", "fee"],
    reply:
      "We offer 0% interest on 3, 6, 12, and 24-month tenures! For longer flexible tenures (36, 48, and 60 months), our rate is a transparent 10.5% p.a. There are zero processing fees, zero foreclosure penalties, and no hidden charges.",
  },
  {
    keywords: ["cashback", "offer", "discount", "reward", "7500", "deal"],
    reply:
      "Every purchase on Glide includes a flat ₹7,500 instant cashback credited directly to your linked account upon digital pledge confirmation.",
  },
  {
    keywords: ["document", "documents", "paperwork", "kyc", "pan", "aadhaar"],
    reply:
      "Glide is 100% paperless! You only need your PAN and Aadhaar-linked mobile number to complete instant OTP verification and digital fund pledging via CAMS / KFintech.",
  },
  {
    keywords: ["fund", "mutual fund", "returns", "pledge", "redeem", "safe"],
    reply:
      "Your mutual funds remain 100% in your name and continue compounding daily! They are simply lien-marked digitally until the EMI tenure completes, after which the lien is automatically released.",
  },
  {
    keywords: ["iphone", "apple", "phone", "samsung", "oneplus", "macbook", "dell", "sony", "laptop", "headphone", "recommend", "best"],
    reply:
      "We feature top flagships like Apple iPhone 17 Pro, Samsung Galaxy S24 Ultra, OnePlus 13, MacBook Pro 14\" M4, Dell XPS 15 OLED, and Sony WH-1000XM5. Check out our Shop catalog to see exact monthly EMI breakdowns from ₹1,208/month!",
  },
  {
    keywords: ["cart", "checkout", "buy", "purchase", "order", "how to buy"],
    reply:
      "Simply choose your gadget on the Shop or Product page, select your preferred color, storage, and EMI tenure (up to 24 months 0% interest), click 'Add to Cart' or 'Buy Now', and proceed to the instant verification checkout!",
  },
  {
    keywords: ["early", "prepay", "foreclose", "foreclosure"],
    reply:
      "You can prepay or foreclose your EMI plan anytime with zero foreclosure charges! Once cleared, your mutual fund lien is unblocked within 24 hours.",
  },
];

// ── POST /api/chat ─────────────────────────────────────────────────────
router.post("/", (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    const cleanInput = message.toLowerCase().trim();

    // Check FAQ knowledge base for match
    for (const item of FAQ_KNOWLEDGE) {
      if (item.keywords.some((k) => cleanInput.includes(k))) {
        return res.json({
          reply: item.reply,
          source: "rule-based",
        });
      }
    }

    // Default friendly fallback
    res.json({
      reply:
        "I'm here to help with your Glide shopping experience! You can ask about our 0% EMI tenures, mutual fund backing, instant eligibility, ₹7,500 cashback, or product recommendations.",
      source: "fallback",
    });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Internal chat error" });
  }
});

module.exports = router;
