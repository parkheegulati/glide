import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchProduct } from "../api";
import { formatPrice } from "../utils";
import { useCart } from "../context/CartContext";
import VariantSelector from "../components/VariantSelector";
import EmiPlanList from "../components/EmiPlanList";

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Selection state
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Crossfade trigger
  const [imageKey, setImageKey] = useState(0);

  // Fetch product
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchProduct(slug)
      .then((data) => {
        setProduct(data);
        const defaultVariant =
          data.variants.find((v) => v.isDefault) || data.variants[0];
        if (defaultVariant) {
          setSelectedColor(defaultVariant.color);
          setSelectedStorage(defaultVariant.storage);
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  // Derive active variant
  const activeVariant = useMemo(() => {
    if (!product) return null;
    return (
      product.variants.find(
        (v) => v.color === selectedColor && v.storage === selectedStorage
      ) ||
      product.variants.find((v) => v.color === selectedColor) ||
      product.variants.find((v) => v.isDefault) ||
      product.variants[0]
    );
  }, [product, selectedColor, selectedStorage]);

  // Update image and pre-select default 12m or first 0% plan on variant change
  useEffect(() => {
    if (activeVariant?.emiPlans?.length > 0) {
      const defaultPlan =
        activeVariant.emiPlans.find((p) => p.tenureMonths === 12) ||
        activeVariant.emiPlans[0];
      setSelectedPlan(defaultPlan);
    }
    setImageKey((k) => k + 1);
  }, [activeVariant?.id]);

  const handleAddToCart = () => {
    if (!product || !activeVariant || !selectedPlan) return;
    addToCart(product, activeVariant, selectedPlan);
    setToastMessage(`Added ${product.name} (${activeVariant.variantLabel}) to your cart!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleBuyNow = () => {
    if (!product || !activeVariant || !selectedPlan) return;
    addToCart(product, activeVariant, selectedPlan);
    navigate("/cart");
  };

  // ── Loading Skeleton ─────────────────────────────────────────────
  if (loading) {
    return (
      <main className="max-w-[1160px] mx-auto px-6 pt-10 pb-20">
        <div className="h-4 w-44 rounded skeleton mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-6 bg-white rounded-2xl p-8 border border-divider space-y-6">
            <div className="h-6 w-32 rounded skeleton" />
            <div className="aspect-square w-full rounded-xl skeleton" />
            <div className="h-8 w-48 mx-auto rounded skeleton" />
          </div>
          <div className="lg:col-span-6 space-y-5">
            <div className="h-10 w-48 rounded skeleton" />
            <div className="h-4 w-32 rounded skeleton" />
            <div className="space-y-3 pt-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 w-full rounded-xl skeleton" />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ── Error State ──────────────────────────────────────────────────
  if (error || !product || !activeVariant) {
    return (
      <main className="max-w-[1160px] mx-auto px-6 py-20 text-center">
        <div className="bg-white rounded-2xl border border-divider p-10 max-w-md mx-auto shadow-sm">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 mx-auto flex items-center justify-center text-xl font-bold mb-3">
            !
          </div>
          <h2 className="text-[20px] font-bold text-primary mb-2">
            Product Not Found
          </h2>
          <p className="text-[14px] text-secondary mb-6">
            The requested device is currently unavailable in our catalog.
          </p>
          <Link
            to="/shop"
            className="inline-block px-5 py-2.5 rounded-xl bg-accent text-white text-[14px] font-semibold no-underline hover:bg-accent-hover transition-colors"
          >
            ← Back to Catalog
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-[1160px] mx-auto px-6 pt-6 pb-24">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-primary text-white px-5 py-3.5 rounded-xl shadow-xl border border-white/10 flex items-center gap-3 animate-slide-up">
          <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center text-white text-xs font-bold">
            ✓
          </div>
          <span className="text-[14px] font-medium">{toastMessage}</span>
          <Link
            to="/cart"
            className="ml-2 text-[13px] font-bold text-accent-subtle underline hover:text-white"
          >
            View Cart →
          </Link>
        </div>
      )}

      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-[13px] text-secondary">
        <Link to="/" className="hover:text-primary transition-colors no-underline">
          Home
        </Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-primary transition-colors no-underline">
          Shop
        </Link>
        <span>/</span>
        <span className="text-secondary">{product.brand}</span>
        <span>/</span>
        <span className="text-primary font-medium">{product.name}</span>
      </nav>

      {/* 2-Column Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* ── Left Column: Product Image & Specs ───────────────── */}
        <div className="lg:col-span-6 lg:sticky lg:top-24">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-divider shadow-sm">
            {/* Badges and Product Title */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-accent bg-accent-light px-2.5 py-0.5 rounded-full inline-block">
                  {product.category}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-success bg-success-bg px-2.5 py-0.5 rounded-full inline-block">
                  0% EMI Eligible
                </span>
              </div>
              <h1 className="text-[28px] sm:text-[34px] font-bold text-primary tracking-[-0.03em] leading-tight">
                {product.name}
              </h1>
              <p className="text-[15px] font-medium text-secondary">
                {product.brand} • {activeVariant.variantLabel}
              </p>
            </div>

            {/* Product Image */}
            <div className="aspect-square w-full max-w-[400px] mx-auto flex items-center justify-center p-4 my-2 relative">
              <img
                key={imageKey}
                src={activeVariant.imageUrl}
                alt={`${product.name} – ${activeVariant.variantLabel}`}
                className="max-h-full max-w-full object-contain animate-fade-in transition-all duration-300 drop-shadow-md hover:scale-105"
                onError={(e) => {
                  e.target.src = "/images/iphone-17-pro-natural.png";
                }}
              />
            </div>

            {/* Variant Selectors */}
            <div className="pt-6 mt-4 border-t border-divider">
              <VariantSelector
                colors={product.colors}
                storages={product.storages}
                selectedColor={selectedColor}
                selectedStorage={selectedStorage}
                onColorChange={setSelectedColor}
                onStorageChange={setSelectedStorage}
              />
            </div>
          </div>

          {/* Device Overview */}
          <div className="mt-4 p-5 bg-page-subtle rounded-xl border border-divider">
            <h4 className="text-[13px] font-bold text-primary uppercase tracking-wider mb-1.5">
              Device Overview
            </h4>
            <p className="text-[14px] text-secondary leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>

        {/* ── Right Column: Pricing & EMI Stack ────────────────── */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-divider shadow-sm">
            {/* Price Header */}
            <div className="flex items-baseline gap-3">
              <span className="text-[34px] sm:text-[40px] font-bold text-primary tracking-[-0.03em]">
                {formatPrice(activeVariant.price)}
              </span>
              {Number(activeVariant.mrp) > Number(activeVariant.price) && (
                <span className="text-[17px] text-secondary line-through font-normal">
                  {formatPrice(activeVariant.mrp)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-[14px] font-bold text-primary">
                Select Your Mutual Fund Backed EMI Plan
              </span>
            </div>
            <p className="text-[13px] text-secondary mt-0.5">
              Pledge your mutual funds with zero paperwork. Your portfolio keeps compounding!
            </p>

            {/* EMI Plans Radio Group */}
            <div className="mt-5">
              <EmiPlanList
                plans={activeVariant.emiPlans}
                selectedPlanId={selectedPlan?.id}
                onSelectPlan={setSelectedPlan}
              />
            </div>

            {/* Action Buttons: Add to Cart & Buy Now */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
              <button
                type="button"
                disabled={!selectedPlan}
                onClick={handleAddToCart}
                className="w-full py-3.5 px-5 rounded-xl text-[15px] font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 border-2 border-accent text-accent bg-accent-light/40 hover:bg-accent-light"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Add to Cart
              </button>

              <button
                type="button"
                disabled={!selectedPlan}
                onClick={handleBuyNow}
                className="w-full py-3.5 px-5 rounded-xl text-[15px] font-bold tracking-[-0.01em] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 bg-accent text-white hover:bg-accent-hover shadow-md hover:shadow-lg"
              >
                Buy Now →
              </button>
            </div>

            {/* Trust Assurance Bar */}
            <div className="mt-6 pt-5 border-t border-divider flex flex-wrap items-center justify-between text-[12px] text-secondary gap-2">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-success inline-block"></span>
                Instant Digital Lien Marking (CAMS/KFin)
              </span>
              <span className="text-tertiary">SEBI Regulated Custodians</span>
            </div>
          </div>

          {/* "Why EMI with Glide?" Value Strip */}
          <div className="bg-page-subtle rounded-2xl p-6 border border-divider space-y-4">
            <h3 className="text-[15px] font-bold text-primary flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-accent"></span>
              Why EMI with Glide?
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="bg-white p-4 rounded-xl border border-divider">
                <div className="w-8 h-8 rounded-lg bg-accent-light flex items-center justify-center text-accent font-bold mb-2">
                  0%
                </div>
                <h4 className="text-[13px] font-bold text-primary">No Cost Tenures</h4>
                <p className="text-[12px] text-secondary mt-1 leading-snug">
                  Up to 24 months with 0% interest and zero processing fee.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-divider">
                <div className="w-8 h-8 rounded-lg bg-success-bg flex items-center justify-center text-success font-bold mb-2">
                  📈
                </div>
                <h4 className="text-[13px] font-bold text-primary">Funds Keep Earning</h4>
                <p className="text-[12px] text-secondary mt-1 leading-snug">
                  Your investments remain invested and compound in your name.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-divider">
                <div className="w-8 h-8 rounded-lg bg-accent-light flex items-center justify-center text-accent font-bold mb-2">
                  ⚡
                </div>
                <h4 className="text-[13px] font-bold text-primary">Instant Approval</h4>
                <p className="text-[12px] text-secondary mt-1 leading-snug">
                  No CIBIL score checks. 100% paperless OTP verification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
