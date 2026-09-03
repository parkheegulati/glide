import { useState } from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../utils";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const defaultVariant = product.defaultVariant;
  const lowestEmi = defaultVariant?.lowestEmi;
  const mrp = defaultVariant?.mrp;
  const price = defaultVariant?.price;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!defaultVariant) return;

    // Build default EMI plan
    const defaultPlan = {
      id: `default-${defaultVariant.id}`,
      tenureMonths: lowestEmi?.tenureMonths || 24,
      monthlyAmount: lowestEmi?.monthlyAmount || Math.round(Number(price) / 24),
      interestRate: 0,
      cashbackAmount: 7500,
      fundName: "Axis Liquid Fund",
    };

    addToCart(product, defaultVariant, defaultPlan);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="group bg-white rounded-2xl border border-divider hover:border-accent/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden relative">
      {/* Top badges */}
      <div className="p-5 pb-0 flex items-center justify-between">
        <span className="text-[11px] font-bold text-accent bg-accent-light px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          {product.brand}
        </span>
        <span className="text-[11px] font-bold text-success bg-success-bg border border-success/20 px-2 py-0.5 rounded-full">
          0% Interest
        </span>
      </div>

      {/* Product Image */}
      <Link
        to={`/products/${product.slug}`}
        className="block p-6 text-center no-underline"
      >
        <div className="aspect-square w-full max-w-[200px] mx-auto flex items-center justify-center relative my-2">
          {defaultVariant?.imageUrl ? (
            <img
              src={defaultVariant.imageUrl}
              alt={product.name}
              className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
              onError={(e) => {
                e.target.src = "/images/iphone-17-pro-natural.png";
              }}
            />
          ) : (
            <div className="w-full h-full bg-page-subtle rounded-xl flex items-center justify-center text-tertiary">
              No Image
            </div>
          )}
        </div>
      </Link>

      {/* Content Info */}
      <div className="p-5 pt-0 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <Link
            to={`/products/${product.slug}`}
            className="block no-underline group-hover:text-accent transition-colors"
          >
            <h3 className="text-[16px] font-bold text-primary tracking-[-0.01em] line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-[12px] text-secondary mt-0.5 line-clamp-1">
            {defaultVariant?.variantLabel || product.category}
          </p>

          {/* Pricing & EMI */}
          <div className="mt-3 pt-3 border-t border-divider flex items-baseline justify-between">
            <div>
              <span className="text-[11px] font-semibold text-secondary uppercase block">
                Starting from
              </span>
              <div className="text-[17px] font-bold text-accent">
                {lowestEmi ? (
                  <>
                    {formatPrice(lowestEmi.monthlyAmount)}
                    <span className="text-[12px] font-normal text-secondary">
                      /mo
                    </span>
                  </>
                ) : (
                  formatPrice(price)
                )}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[14px] font-bold text-primary block">
                {formatPrice(price)}
              </span>
              {mrp && Number(mrp) > Number(price) && (
                <span className="text-[11px] text-tertiary line-through">
                  {formatPrice(mrp)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Row */}
        <div className="grid grid-cols-5 gap-2 pt-1">
          <Link
            to={`/products/${product.slug}`}
            className="col-span-4 py-2.5 px-3 rounded-xl bg-page-subtle hover:bg-accent hover:text-white border border-divider hover:border-accent text-primary text-[13px] font-bold text-center transition-all no-underline"
          >
            View Details
          </Link>

          <button
            type="button"
            onClick={handleQuickAdd}
            title="Quick Add to Cart (Default 24m 0% Plan)"
            aria-label="Quick Add to Cart"
            className={`
              col-span-1 py-2.5 rounded-xl border flex items-center justify-center transition-all cursor-pointer
              ${
                added
                  ? "bg-success text-white border-success"
                  : "bg-white hover:bg-accent-light border-divider text-accent hover:border-accent"
              }
            `}
          >
            {added ? (
              <span className="text-xs font-bold">✓</span>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
