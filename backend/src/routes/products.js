const express = require("express");
const { neon } = require("@neondatabase/serverless");

const router = express.Router();
const sql = neon(process.env.DATABASE_URL);

// Simple in-memory cache
const cache = new Map();
const CACHE_TTL_MS = 30 * 1000; // 30 seconds

function getCached(key) {
  const item = cache.get(key);
  if (item && Date.now() - item.timestamp < CACHE_TTL_MS) {
    return item.data;
  }
  cache.delete(key);
  return null;
}

function setCached(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

// ── GET /api/products ──────────────────────────────────────────────────
// List products with optional ?category= and ?search= query params
router.get("/", async (req, res) => {
  try {
    const { category, search } = req.query;
    const cacheKey = `products:list:${category || "all"}:${search || "none"}`;
    const cached = getCached(cacheKey);
    if (cached) return res.json(cached);

    let query;
    if (category && search) {
      const searchPattern = `%${search}%`;
      query = sql`
        SELECT p.id, p.slug, p.name, p.brand, p.category, p.description,
               pv.id as "variantId", pv."variantLabel", pv.mrp, pv.price, pv."imageUrl",
               ep."monthlyAmount", ep."tenureMonths"
        FROM "Product" p
        LEFT JOIN "ProductVariant" pv ON pv."productId" = p.id AND pv."isDefault" = true
        LEFT JOIN LATERAL (
          SELECT "monthlyAmount", "tenureMonths"
          FROM "EmiPlan"
          WHERE "variantId" = pv.id AND "isActive" = true
          ORDER BY "monthlyAmount" ASC
          LIMIT 1
        ) ep ON true
        WHERE p.category ILIKE ${category}
          AND (p.name ILIKE ${searchPattern} OR p.brand ILIKE ${searchPattern} OR p.description ILIKE ${searchPattern})
        ORDER BY p."createdAt" ASC
      `;
    } else if (category) {
      query = sql`
        SELECT p.id, p.slug, p.name, p.brand, p.category, p.description,
               pv.id as "variantId", pv."variantLabel", pv.mrp, pv.price, pv."imageUrl",
               ep."monthlyAmount", ep."tenureMonths"
        FROM "Product" p
        LEFT JOIN "ProductVariant" pv ON pv."productId" = p.id AND pv."isDefault" = true
        LEFT JOIN LATERAL (
          SELECT "monthlyAmount", "tenureMonths"
          FROM "EmiPlan"
          WHERE "variantId" = pv.id AND "isActive" = true
          ORDER BY "monthlyAmount" ASC
          LIMIT 1
        ) ep ON true
        WHERE p.category ILIKE ${category}
        ORDER BY p."createdAt" ASC
      `;
    } else if (search) {
      const searchPattern = `%${search}%`;
      query = sql`
        SELECT p.id, p.slug, p.name, p.brand, p.category, p.description,
               pv.id as "variantId", pv."variantLabel", pv.mrp, pv.price, pv."imageUrl",
               ep."monthlyAmount", ep."tenureMonths"
        FROM "Product" p
        LEFT JOIN "ProductVariant" pv ON pv."productId" = p.id AND pv."isDefault" = true
        LEFT JOIN LATERAL (
          SELECT "monthlyAmount", "tenureMonths"
          FROM "EmiPlan"
          WHERE "variantId" = pv.id AND "isActive" = true
          ORDER BY "monthlyAmount" ASC
          LIMIT 1
        ) ep ON true
        WHERE p.name ILIKE ${searchPattern} OR p.brand ILIKE ${searchPattern} OR p.description ILIKE ${searchPattern}
        ORDER BY p."createdAt" ASC
      `;
    } else {
      query = sql`
        SELECT p.id, p.slug, p.name, p.brand, p.category, p.description,
               pv.id as "variantId", pv."variantLabel", pv.mrp, pv.price, pv."imageUrl",
               ep."monthlyAmount", ep."tenureMonths"
        FROM "Product" p
        LEFT JOIN "ProductVariant" pv ON pv."productId" = p.id AND pv."isDefault" = true
        LEFT JOIN LATERAL (
          SELECT "monthlyAmount", "tenureMonths"
          FROM "EmiPlan"
          WHERE "variantId" = pv.id AND "isActive" = true
          ORDER BY "monthlyAmount" ASC
          LIMIT 1
        ) ep ON true
        ORDER BY p."createdAt" ASC
      `;
    }

    const rows = await query;

    const result = rows.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      brand: p.brand,
      category: p.category,
      description: p.description,
      defaultVariant: p.variantId
        ? {
            id: p.variantId,
            variantLabel: p.variantLabel,
            mrp: p.mrp,
            price: p.price,
            imageUrl: p.imageUrl,
            lowestEmi: p.monthlyAmount
              ? {
                  monthlyAmount: p.monthlyAmount,
                  tenureMonths: p.tenureMonths,
                }
              : null,
          }
        : null,
    }));

    setCached(cacheKey, result);
    res.json(result);
  } catch (err) {
    console.error("GET /api/products error:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// ── GET /api/products/:slug ────────────────────────────────────────────
// Full product detail with all variants + EMI plans
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const cacheKey = `product:${slug}`;
    const cached = getCached(cacheKey);
    if (cached) return res.json(cached);

    const products = await sql`
      SELECT id, slug, name, brand, category, description
      FROM "Product"
      WHERE slug = ${slug}
      LIMIT 1
    `;

    if (products.length === 0) {
      return res.status(404).json({ error: `Product "${slug}" not found` });
    }

    const product = products[0];

    // Fetch all variants for this product
    const variants = await sql`
      SELECT id, "productId", "variantLabel", storage, color, "colorHex",
             mrp, price, "imageUrl", stock, "isDefault"
      FROM "ProductVariant"
      WHERE "productId" = ${product.id}
      ORDER BY "isDefault" DESC, storage ASC, color ASC
    `;

    // Fetch all EMI plans for all variants
    const variantIds = variants.map((v) => v.id);
    let allPlans = [];
    if (variantIds.length > 0) {
      allPlans = await sql`
        SELECT id, "variantId", "tenureMonths", "monthlyAmount", "interestRate",
               "cashbackAmount", "fundName", "isActive"
        FROM "EmiPlan"
        WHERE "variantId" = ANY(${variantIds}) AND "isActive" = true
        ORDER BY "tenureMonths" ASC
      `;
    }

    // Group plans by variantId
    const plansByVariant = {};
    allPlans.forEach((plan) => {
      if (!plansByVariant[plan.variantId]) {
        plansByVariant[plan.variantId] = [];
      }
      plansByVariant[plan.variantId].push({
        id: plan.id,
        tenureMonths: plan.tenureMonths,
        monthlyAmount: plan.monthlyAmount,
        interestRate: plan.interestRate,
        cashbackAmount: plan.cashbackAmount,
        fundName: plan.fundName,
      });
    });

    // Extract unique colors and storages
    const colors = [];
    const seenColors = new Set();
    variants.forEach((v) => {
      if (!seenColors.has(v.color)) {
        seenColors.add(v.color);
        colors.push({ name: v.color, hex: v.colorHex });
      }
    });

    const storages = [...new Set(variants.map((v) => v.storage))];

    const result = {
      id: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      category: product.category,
      description: product.description,
      colors,
      storages,
      variants: variants.map((v) => ({
        id: v.id,
        variantLabel: v.variantLabel,
        storage: v.storage,
        color: v.color,
        colorHex: v.colorHex,
        mrp: v.mrp,
        price: v.price,
        imageUrl: v.imageUrl,
        stock: v.stock,
        isDefault: v.isDefault,
        emiPlans: plansByVariant[v.id] || [],
      })),
    };

    setCached(cacheKey, result);
    res.json(result);
  } catch (err) {
    console.error("GET /api/products/:slug error:", err);
    res.status(500).json({ error: "Failed to fetch product detail" });
  }
});

// ── GET /api/products/:slug/variants/:variantId/emi-plans ──────────────
router.get("/:slug/variants/:variantId/emi-plans", async (req, res) => {
  try {
    const { slug, variantId } = req.params;
    const cacheKey = `emi:${slug}:${variantId}`;
    const cached = getCached(cacheKey);
    if (cached) return res.json(cached);

    const variants = await sql`
      SELECT pv.id, pv."variantLabel", pv.price, pv.mrp, p.slug
      FROM "ProductVariant" pv
      JOIN "Product" p ON p.id = pv."productId"
      WHERE pv.id = ${variantId} AND p.slug = ${slug}
      LIMIT 1
    `;

    if (variants.length === 0) {
      return res.status(404).json({
        error: `Variant "${variantId}" not found for product "${slug}"`,
      });
    }

    const variant = variants[0];

    const plans = await sql`
      SELECT id, "tenureMonths", "monthlyAmount", "interestRate",
             "cashbackAmount", "fundName"
      FROM "EmiPlan"
      WHERE "variantId" = ${variantId} AND "isActive" = true
      ORDER BY "tenureMonths" ASC
    `;

    const result = {
      variantId: variant.id,
      variantLabel: variant.variantLabel,
      price: variant.price,
      mrp: variant.mrp,
      plans: plans.map((e) => ({
        id: e.id,
        tenureMonths: e.tenureMonths,
        monthlyAmount: e.monthlyAmount,
        interestRate: e.interestRate,
        cashbackAmount: e.cashbackAmount,
        fundName: e.fundName,
      })),
    };

    setCached(cacheKey, result);
    res.json(result);
  } catch (err) {
    console.error("GET emi-plans error:", err);
    res.status(500).json({ error: "Failed to fetch EMI plans" });
  }
});

module.exports = router;
