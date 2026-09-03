import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchProducts } from "../api";
import ProductCard from "../components/ProductCard";
import EmiCalculator from "../components/EmiCalculator";
import TestimonialsCarousel from "../components/TestimonialsCarousel";
import FaqAccordion from "../components/FaqAccordion";
import { formatPrice } from "../utils";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeHeroIdx, setActiveHeroIdx] = useState(0);
  const [showEligibilityModal, setShowEligibilityModal] = useState(false);
  const [mfValue, setMfValue] = useState(250000);
  const [eligibilityResult, setEligibilityResult] = useState(null);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  // Featured showcase products for Hero carousel
  const heroProducts = products.slice(0, 4);

  // Auto rotate hero cards
  useEffect(() => {
    if (heroProducts.length === 0) return;
    const timer = setInterval(() => {
      setActiveHeroIdx((prev) => (prev + 1) % heroProducts.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [heroProducts.length]);

  const handleCheckEligibility = (e) => {
    e.preventDefault();
    const approvedLimit = Math.round(mfValue * 0.7); // 70% of portfolio value
    setEligibilityResult(approvedLimit);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* ── 1. Hero Section ────────────────────────────────────────── */}
      <section className="relative pt-12 pb-20 md:pt-18 md:pb-28 bg-gradient-to-b from-page-subtle via-white to-white overflow-hidden border-b border-divider">
        <div className="max-w-[1160px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Copy */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-light text-accent text-[12px] font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-accent"></span>
                Mutual Fund Backed Installments
              </div>

              {/* Tagline */}
              <h1 className="text-[40px] sm:text-[56px] font-bold text-primary tracking-[-0.035em] leading-[1.08]">
                Shop today. <br className="hidden sm:inline" />
                Pay later. <br />
                <span className="text-accent">Powered by your mutual funds.</span>
              </h1>

              {/* Sub-line */}
              <p className="text-[17px] sm:text-[18px] text-secondary leading-relaxed max-w-xl mx-auto lg:mx-0">
                No credit score required. No interest. Fully backed by your investments while they keep growing.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/shop"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-accent text-white text-[15px] font-bold hover:bg-accent-hover transition-all duration-200 shadow-md hover:shadow-lg text-center no-underline flex items-center justify-center gap-2"
                >
                  Start Shopping
                  <span>→</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setEligibilityResult(null);
                    setShowEligibilityModal(true);
                  }}
                  className="w-full sm:w-auto px-7 py-4 rounded-xl border-2 border-accent text-accent bg-white hover:bg-accent-light/50 text-[15px] font-bold transition-all duration-200 cursor-pointer text-center"
                >
                  Check Eligibility ⚡
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-[13px] text-secondary">
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="text-success font-bold">✓</span> 0% Interest Up to 24m
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="text-success font-bold">✓</span> Flat ₹7,500 Cashback
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="text-success font-bold">✓</span> Zero Paperwork
                </div>
              </div>
            </div>

            {/* Hero Right: Rotating Showcase of Featured Products */}
            <div className="lg:col-span-6 relative">
              {loading ? (
                <div className="aspect-square w-full max-w-[440px] mx-auto rounded-3xl skeleton" />
              ) : heroProducts.length > 0 ? (
                <div className="relative max-w-[460px] mx-auto">
                  {/* Glowing background halo */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-accent/15 to-purple-400/10 rounded-3xl blur-2xl -z-10"></div>

                  {/* Active Featured Card */}
                  <div className="bg-white rounded-3xl p-7 border border-divider shadow-xl relative overflow-hidden transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-accent bg-accent-light px-3 py-1 rounded-full">
                        Featured Flagship
                      </span>
                      <span className="text-[12px] font-bold text-success bg-success-bg px-3 py-1 rounded-full border border-success/20">
                        0% Interest • 24 Months
                      </span>
                    </div>

                    {/* Image */}
                    <div className="aspect-square w-full max-w-[280px] mx-auto flex items-center justify-center p-2 relative my-2">
                      <img
                        src={heroProducts[activeHeroIdx]?.defaultVariant?.imageUrl}
                        alt={heroProducts[activeHeroIdx]?.name}
                        className="max-h-full max-w-full object-contain animate-fade-in drop-shadow-lg"
                        onError={(e) => {
                          e.target.src = "/images/iphone-17-pro-natural.png";
                        }}
                      />
                    </div>

                    {/* Info */}
                    <div className="pt-4 border-t border-divider flex items-center justify-between">
                      <div>
                        <h3 className="text-[20px] font-bold text-primary">
                          {heroProducts[activeHeroIdx]?.name}
                        </h3>
                        <p className="text-[13px] text-secondary">
                          Starting at{" "}
                          <span className="font-bold text-accent">
                            {formatPrice(
                              heroProducts[activeHeroIdx]?.defaultVariant?.lowestEmi?.monthlyAmount
                            )}
                            /mo
                          </span>
                        </p>
                      </div>

                      <Link
                        to={`/products/${heroProducts[activeHeroIdx]?.slug}`}
                        className="px-5 py-2.5 rounded-xl bg-accent text-white text-[13px] font-bold hover:bg-accent-hover transition-colors shadow-sm no-underline"
                      >
                        Buy on EMI →
                      </Link>
                    </div>
                  </div>

                  {/* Rotating Switcher Pills */}
                  <div className="flex items-center justify-center gap-2 mt-5">
                    {heroProducts.map((p, idx) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setActiveHeroIdx(idx)}
                        className={`
                          px-3 py-1 rounded-full text-[12px] font-bold transition-all cursor-pointer border
                          ${
                            activeHeroIdx === idx
                              ? "bg-accent text-white border-accent shadow-xs"
                              : "bg-white text-secondary border-divider hover:border-accent/40"
                          }
                        `}
                      >
                        {p.name.split(" ")[0]} {p.name.split(" ")[1] || ""}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Best Sellers Section ───────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-[1160px] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-light text-accent text-[12px] font-bold uppercase tracking-wider mb-3">
                <span className="w-2 h-2 rounded-full bg-accent"></span>
                Trending Flagships
              </div>
              <h2 className="text-[32px] sm:text-[38px] font-bold text-primary tracking-[-0.03em]">
                Best Selling Devices
              </h2>
              <p className="text-[15px] text-secondary mt-1">
                Zero-downpayment EMI plans backed by top SEBI-registered liquid funds.
              </p>
            </div>

            <Link
              to="/shop"
              className="text-[14px] font-bold text-accent hover:text-accent-hover flex items-center gap-1 self-start md:self-end no-underline group"
            >
              View all products
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. How It Works Section ───────────────────────────────── */}
      <section id="how-it-works" className="py-20 bg-page-subtle border-y border-divider">
        <div className="max-w-[1160px] mx-auto px-6">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-light text-accent text-[12px] font-bold uppercase tracking-wider mb-3">
              <span className="w-2 h-2 rounded-full bg-accent"></span>
              Simple 4-Step Process
            </div>
            <h2 className="text-[32px] sm:text-[38px] font-bold text-primary tracking-[-0.03em]">
              How Glide Works
            </h2>
            <p className="text-[15px] text-secondary mt-2 leading-relaxed">
              Experience the future of asset-backed shopping in four seamless steps with zero paperwork.
            </p>
          </div>

          {/* 4 Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Choose Product & Plan",
                desc: "Select your favorite smartphone, laptop, or gadget and pick a 3 to 60-month EMI plan with up to 24m at 0% interest.",
                icon: "📱",
              },
              {
                step: "02",
                title: "Check Instant Eligibility",
                desc: "Verify your PAN & mobile via OTP. Your mutual fund holdings across CAMS/KFintech are detected in under 30 seconds.",
                icon: "⚡",
              },
              {
                step: "03",
                title: "Confirm Purchase",
                desc: "Digital lien marking is approved with a single click. No money is deducted from your portfolio and units keep earning.",
                icon: "🛡️",
              },
              {
                step: "04",
                title: "Track in Dashboard",
                desc: "Receive express delivery of your device and flat ₹7,500 cashback. Repay comfortably via automated monthly auto-debit.",
                icon: "📦",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-7 border border-divider shadow-xs relative flex flex-col justify-between hover:border-accent/40 transition-all hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[28px] font-bold text-accent/30 font-mono">
                      {item.step}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-accent-light flex items-center justify-center text-xl">
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="text-[17px] font-bold text-primary tracking-tight mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[13px] text-secondary leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Key Benefits Section ───────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-[1160px] mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-light text-accent text-[12px] font-bold uppercase tracking-wider mb-3">
              <span className="w-2 h-2 rounded-full bg-accent"></span>
              Why Choose Glide
            </div>
            <h2 className="text-[32px] sm:text-[38px] font-bold text-primary tracking-[-0.03em]">
              The Smarter Way to Buy Technology
            </h2>
            <p className="text-[15px] text-secondary mt-2 leading-relaxed">
              Designed specifically for smart Indian investors who want to maximize portfolio compounding.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "0% Interest EMI",
                desc: "Pay strictly the gadget price split evenly over 3, 6, 12, or 24 months without a single rupee in hidden charges.",
                icon: "🏷️",
                badge: "Zero Cost",
              },
              {
                title: "Instant Approval",
                desc: "Automated digital verification with zero paper upload. Get approved and purchase in under 60 seconds.",
                icon: "⚡",
                badge: "Under 60s",
              },
              {
                title: "No CIBIL Check",
                desc: "Your credit score is completely untouched. Your existing mutual fund investments serve as your creditworthiness.",
                icon: "🛡️",
                badge: "100% Unaffected",
              },
              {
                title: "Flexible Tenures (3–60m)",
                desc: "From short 3-month plans up to relaxed 5-year repayment schedules tailored to your monthly cash flow.",
                icon: "📅",
                badge: "3 to 60 Mos",
              },
              {
                title: "Zero Foreclosure Charges",
                desc: "Prepay anytime you receive a bonus or dividend. No penalty or foreclosure locks apply on your loans.",
                icon: "🔓",
                badge: "Prepay Free",
              },
              {
                title: "Funds Keep Compounding",
                desc: "Your mutual fund units stay in your name and earn 7–12% annual market returns throughout the tenure.",
                icon: "📈",
                badge: "Stay Invested",
              },
            ].map((card, idx) => (
              <div
                key={idx}
                className="bg-page-subtle rounded-3xl p-7 border border-divider hover:border-accent/40 transition-all hover:shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-divider flex items-center justify-center text-xl shadow-xs">
                      {card.icon}
                    </div>
                    <span className="text-[11px] font-bold text-accent bg-accent-light px-2.5 py-0.5 rounded-full">
                      {card.badge}
                    </span>
                  </div>
                  <h3 className="text-[17px] font-bold text-primary mb-2">
                    {card.title}
                  </h3>
                  <p className="text-[13px] text-secondary leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Interactive EMI Calculator ──────────────────────────── */}
      <EmiCalculator />

      {/* ── 6. Testimonials Carousel ──────────────────────────────── */}
      <TestimonialsCarousel />

      {/* ── 7. FAQ Accordion ──────────────────────────────────────── */}
      <FaqAccordion />

      {/* ── Eligibility Check Modal ───────────────────────────────── */}
      {showEligibilityModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-divider space-y-6 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-divider">
              <div>
                <h3 className="text-[18px] font-bold text-primary">
                  Check Instant Credit Limit
                </h3>
                <p className="text-[12px] text-secondary">
                  Based on your mutual fund portfolio
                </p>
              </div>
              <button
                onClick={() => setShowEligibilityModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-secondary font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {eligibilityResult === null ? (
              <form onSubmit={handleCheckEligibility} className="space-y-4">
                <div>
                  <label className="text-[13px] font-bold text-secondary block mb-1.5">
                    Total Mutual Fund Holdings Value
                  </label>
                  <input
                    type="number"
                    min="10000"
                    step="5000"
                    value={mfValue}
                    onChange={(e) => setMfValue(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-divider bg-page-subtle text-[15px] font-bold text-primary focus:bg-white focus:border-accent"
                    required
                  />
                  <span className="text-[11px] text-tertiary mt-1 block">
                    Across all AMCs (Axis, HDFC, SBI, ICICI, etc.)
                  </span>
                </div>

                <div className="p-3.5 bg-accent-light/50 border border-accent-subtle rounded-xl text-[12px] text-accent space-y-1">
                  <span className="font-bold block">🔒 Privacy Guaranteed</span>
                  <p className="text-secondary text-[11px]">
                    No credit bureau query will be triggered. This calculation is solely based on mutual fund collateral.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-accent text-white text-[15px] font-bold hover:bg-accent-hover transition-colors cursor-pointer shadow-md"
                >
                  Calculate My Limit ⚡
                </button>
              </form>
            ) : (
              <div className="text-center space-y-4 py-2">
                <div className="w-16 h-16 rounded-full bg-success-bg text-success text-2xl flex items-center justify-center mx-auto">
                  ✓
                </div>
                <div>
                  <span className="text-[12px] font-bold uppercase tracking-wider text-success">
                    Instant Pre-Approval
                  </span>
                  <div className="text-[34px] font-bold text-primary mt-1">
                    {formatPrice(eligibilityResult)}
                  </div>
                  <p className="text-[13px] text-secondary mt-1">
                    Approved shopping limit at 0% interest on Glide!
                  </p>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <Link
                    to="/shop"
                    onClick={() => setShowEligibilityModal(false)}
                    className="w-full py-3.5 rounded-xl bg-accent text-white text-[14px] font-bold hover:bg-accent-hover transition-colors no-underline block text-center"
                  >
                    Browse Gadgets Within My Limit →
                  </Link>
                  <button
                    type="button"
                    onClick={() => setEligibilityResult(null)}
                    className="w-full py-2.5 rounded-xl text-[13px] text-secondary hover:text-primary font-medium"
                  >
                    Check Another Value
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
