require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ── Helper: generate 7 distinct EMI plans for a given variant price ─────
function emiPlans(variantId, price) {
  const tenures = [
    { months: 3, rate: 0 },
    { months: 6, rate: 0 },
    { months: 12, rate: 0 },
    { months: 24, rate: 0 },
    { months: 36, rate: 10.5 },
    { months: 48, rate: 10.5 },
    { months: 60, rate: 10.5 },
  ];

  const funds = [
    "Axis Liquid Fund",
    "HDFC Liquid Fund",
    "SBI Liquid Fund",
    "ICICI Prudential Liquid Fund",
    "Kotak Liquid Fund",
    "Nippon India Liquid Fund",
    "Aditya Birla Sun Life Liquid Fund",
  ];

  return tenures.map((t, i) => {
    const p = Number(price);
    let monthly;
    if (t.rate === 0) {
      monthly = Math.round(p / t.months);
    } else {
      // standard EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)
      const r = t.rate / 100 / 12;
      const n = t.months;
      monthly = Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    }
    return {
      variantId,
      tenureMonths: t.months,
      monthlyAmount: monthly,
      interestRate: t.rate,
      cashbackAmount: 7500, // flat cashback across plans
      fundName: funds[i],
      isActive: true,
    };
  });
}

async function main() {
  // Clean existing data
  await prisma.emiPlan.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();

  console.log("🗑️  Cleared existing data");

  // ─── Product 1: iPhone 17 Pro (Smartphones) ───────────────────────
  const iphone = await prisma.product.create({
    data: {
      slug: "iphone-17-pro",
      name: "iPhone 17 Pro",
      brand: "Apple",
      category: "Smartphones",
      description:
        "iPhone 17 Pro features the A19 Pro chip, a 48MP fusion camera system with a 5× optical zoom, titanium design, and an all-new Camera Control button. Available in four stunning titanium finishes.",
    },
  });

  const iphoneVariants = [
    {
      productId: iphone.id,
      variantLabel: "256GB · Natural Titanium",
      storage: "256GB",
      color: "Natural Titanium",
      colorHex: "#C2B8A3",
      mrp: 134900,
      price: 127400,
      imageUrl: "/images/iphone-17-pro-natural.png",
      stock: 50,
      isDefault: true,
    },
    {
      productId: iphone.id,
      variantLabel: "256GB · Desert Titanium",
      storage: "256GB",
      color: "Desert Titanium",
      colorHex: "#C4A882",
      mrp: 134900,
      price: 127400,
      imageUrl: "/images/iphone-17-pro-desert.png",
      stock: 35,
      isDefault: false,
    },
    {
      productId: iphone.id,
      variantLabel: "256GB · Black Titanium",
      storage: "256GB",
      color: "Black Titanium",
      colorHex: "#3C3C3C",
      mrp: 134900,
      price: 127400,
      imageUrl: "/images/iphone-17-pro-black.png",
      stock: 45,
      isDefault: false,
    },
    {
      productId: iphone.id,
      variantLabel: "512GB · Natural Titanium",
      storage: "512GB",
      color: "Natural Titanium",
      colorHex: "#C2B8A3",
      mrp: 154900,
      price: 149900,
      imageUrl: "/images/iphone-17-pro-natural.png",
      stock: 25,
      isDefault: false,
    },
    {
      productId: iphone.id,
      variantLabel: "512GB · Desert Titanium",
      storage: "512GB",
      color: "Desert Titanium",
      colorHex: "#C4A882",
      mrp: 154900,
      price: 149900,
      imageUrl: "/images/iphone-17-pro-desert.png",
      stock: 20,
      isDefault: false,
    },
    {
      productId: iphone.id,
      variantLabel: "512GB · Black Titanium",
      storage: "512GB",
      color: "Black Titanium",
      colorHex: "#3C3C3C",
      mrp: 154900,
      price: 149900,
      imageUrl: "/images/iphone-17-pro-black.png",
      stock: 30,
      isDefault: false,
    },
  ];

  // ─── Product 2: Samsung Galaxy S24 Ultra (Smartphones) ────────────
  const samsung = await prisma.product.create({
    data: {
      slug: "samsung-galaxy-s24-ultra",
      name: "Galaxy S24 Ultra",
      brand: "Samsung",
      category: "Smartphones",
      description:
        "Galaxy S24 Ultra, crafted with titanium, features a built-in S Pen, a 200MP camera with AI-enhanced zoom, and the most powerful Snapdragon processor for Galaxy. Epic, just like that.",
    },
  });

  const samsungVariants = [
    {
      productId: samsung.id,
      variantLabel: "256GB · Titanium Gray",
      storage: "256GB",
      color: "Titanium Gray",
      colorHex: "#8E8D8A",
      mrp: 134999,
      price: 119999,
      imageUrl: "/images/samsung-s24-ultra-gray.png",
      stock: 40,
      isDefault: true,
    },
    {
      productId: samsung.id,
      variantLabel: "256GB · Titanium Violet",
      storage: "256GB",
      color: "Titanium Violet",
      colorHex: "#A89BB5",
      mrp: 134999,
      price: 119999,
      imageUrl: "/images/samsung-s24-ultra-violet.png",
      stock: 30,
      isDefault: false,
    },
    {
      productId: samsung.id,
      variantLabel: "512GB · Titanium Gray",
      storage: "512GB",
      color: "Titanium Gray",
      colorHex: "#8E8D8A",
      mrp: 154999,
      price: 144999,
      imageUrl: "/images/samsung-s24-ultra-gray.png",
      stock: 20,
      isDefault: false,
    },
    {
      productId: samsung.id,
      variantLabel: "512GB · Titanium Violet",
      storage: "512GB",
      color: "Titanium Violet",
      colorHex: "#A89BB5",
      mrp: 154999,
      price: 144999,
      imageUrl: "/images/samsung-s24-ultra-violet.png",
      stock: 15,
      isDefault: false,
    },
  ];

  // ─── Product 3: OnePlus 13 (Smartphones) ──────────────────────────
  const oneplus = await prisma.product.create({
    data: {
      slug: "oneplus-13",
      name: "OnePlus 13",
      brand: "OnePlus",
      category: "Smartphones",
      description:
        "OnePlus 13 packs the Snapdragon 8 Elite, a stunning 2K 120Hz LTPO AMOLED display, Hasselblad-tuned triple camera, and a massive 6000mAh battery with 100W SUPERVOOC charging.",
    },
  });

  const oneplusVariants = [
    {
      productId: oneplus.id,
      variantLabel: "256GB · Black Eclipse",
      storage: "256GB",
      color: "Black Eclipse",
      colorHex: "#1A1A1A",
      mrp: 69999,
      price: 65999,
      imageUrl: "/images/oneplus-13-black.png",
      stock: 60,
      isDefault: true,
    },
    {
      productId: oneplus.id,
      variantLabel: "256GB · Midnight Ocean",
      storage: "256GB",
      color: "Midnight Ocean",
      colorHex: "#2B3A5C",
      mrp: 69999,
      price: 65999,
      imageUrl: "/images/oneplus-13-ocean.png",
      stock: 40,
      isDefault: false,
    },
    {
      productId: oneplus.id,
      variantLabel: "512GB · Black Eclipse",
      storage: "512GB",
      color: "Black Eclipse",
      colorHex: "#1A1A1A",
      mrp: 79999,
      price: 76999,
      imageUrl: "/images/oneplus-13-black.png",
      stock: 25,
      isDefault: false,
    },
    {
      productId: oneplus.id,
      variantLabel: "512GB · Midnight Ocean",
      storage: "512GB",
      color: "Midnight Ocean",
      colorHex: "#2B3A5C",
      mrp: 79999,
      price: 76999,
      imageUrl: "/images/oneplus-13-ocean.png",
      stock: 20,
      isDefault: false,
    },
  ];

  // ─── Product 4: MacBook Pro 14" M4 (Laptops) ──────────────────────
  const macbook = await prisma.product.create({
    data: {
      slug: "macbook-pro-14-m4",
      name: 'MacBook Pro 14" M4',
      brand: "Apple",
      category: "Laptops",
      description:
        'The 14-inch MacBook Pro with M4 chip provides powerhouse performance and up to 24 hours of battery life. Liquid Retina XDR display with nano-texture option, advanced connectivity, and Apple Intelligence built-in.',
    },
  });

  const macbookVariants = [
    {
      productId: macbook.id,
      variantLabel: "512GB SSD / 16GB RAM · Space Black",
      storage: "512GB SSD",
      color: "Space Black",
      colorHex: "#2E2F32",
      mrp: 169900,
      price: 159900,
      imageUrl: "/images/macbook-pro-14-black.jpg",
      stock: 30,
      isDefault: true,
    },
    {
      productId: macbook.id,
      variantLabel: "512GB SSD / 16GB RAM · Silver",
      storage: "512GB SSD",
      color: "Silver",
      colorHex: "#E3E4E6",
      mrp: 169900,
      price: 159900,
      imageUrl: "/images/macbook-pro-14-silver.jpg",
      stock: 25,
      isDefault: false,
    },
    {
      productId: macbook.id,
      variantLabel: "1TB SSD / 24GB RAM · Space Black",
      storage: "1TB SSD",
      color: "Space Black",
      colorHex: "#2E2F32",
      mrp: 209900,
      price: 199900,
      imageUrl: "/images/macbook-pro-14-black.jpg",
      stock: 15,
      isDefault: false,
    },
  ];

  // ─── Product 5: Dell XPS 15 OLED (Laptops) ────────────────────────
  const dell = await prisma.product.create({
    data: {
      slug: "dell-xps-15-oled",
      name: "Dell XPS 15 OLED",
      brand: "Dell",
      category: "Laptops",
      description:
        "Immerse yourself in content with a breathtaking 3.5K OLED InfinityEdge touch display, Intel Core Ultra 7 processor, NVIDIA GeForce RTX graphics, and machined aluminum chassis with carbon fiber palm rest.",
    },
  });

  const dellVariants = [
    {
      productId: dell.id,
      variantLabel: "512GB SSD / 16GB RAM · Platinum Silver",
      storage: "512GB SSD",
      color: "Platinum Silver",
      colorHex: "#D8D9DD",
      mrp: 189990,
      price: 174990,
      imageUrl: "/images/dell-xps-15-silver.jpg",
      stock: 20,
      isDefault: true,
    },
    {
      productId: dell.id,
      variantLabel: "1TB SSD / 32GB RAM · Platinum Silver",
      storage: "1TB SSD",
      color: "Platinum Silver",
      colorHex: "#D8D9DD",
      mrp: 224990,
      price: 209990,
      imageUrl: "/images/dell-xps-15-silver.jpg",
      stock: 15,
      isDefault: false,
    },
  ];

  // ─── Product 6: Sony WH-1000XM5 (Audio) ───────────────────────────
  const sony = await prisma.product.create({
    data: {
      slug: "sony-wh-1000xm5",
      name: "Sony WH-1000XM5 Wireless ANC",
      brand: "Sony",
      category: "Audio",
      description:
        "Industry-leading noise canceling with two processors and 8 microphones. Exceptional sound quality with Auto NC Optimizer, 30-hour battery life with quick charging, and crystal clear hands-free calling.",
    },
  });

  const sonyVariants = [
    {
      productId: sony.id,
      variantLabel: "Standard · Black",
      storage: "Standard",
      color: "Black",
      colorHex: "#111111",
      mrp: 34990,
      price: 28990,
      imageUrl: "/images/sony-wh1000xm5-black.jpg",
      stock: 75,
      isDefault: true,
    },
    {
      productId: sony.id,
      variantLabel: "Standard · Silver",
      storage: "Standard",
      color: "Silver",
      colorHex: "#D9D8D2",
      mrp: 34990,
      price: 28990,
      imageUrl: "/images/sony-wh1000xm5-black.jpg",
      stock: 45,
      isDefault: false,
    },
  ];

  // ─── Create all variants and their EMI plans ─────────────────────
  const allVariants = [
    ...iphoneVariants,
    ...samsungVariants,
    ...oneplusVariants,
    ...macbookVariants,
    ...dellVariants,
    ...sonyVariants,
  ];

  for (const v of allVariants) {
    const variant = await prisma.productVariant.create({ data: v });
    const plans = emiPlans(variant.id, v.price);
    await prisma.emiPlan.createMany({ data: plans });
  }

  const totalProducts = await prisma.product.count();
  const totalVariants = await prisma.productVariant.count();
  const totalPlans = await prisma.emiPlan.count();
  console.log(
    `✅ Seeded ${totalProducts} products, ${totalVariants} variants, ${totalPlans} EMI plans across 3 categories!`
  );
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
