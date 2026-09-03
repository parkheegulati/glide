import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils";

export default function Cart() {
  const {
    cart,
    totalDeviceValue,
    totalMonthlyOutflow,
    totalCashback,
    removeFromCart,
    updateItemPlan,
    clearCart,
  } = useCart();
  const navigate = useNavigate();

  // State to manage in-cart plan picker modal
  const [editingItem, setEditingItem] = useState(null);

  // Available sample tenure options for in-cart modification
  const getTenureOptions = (price) => {
    const tenures = [
      { months: 3, rate: 0, fund: "Axis Liquid Fund" },
      { months: 6, rate: 0, fund: "HDFC Liquid Fund" },
      { months: 12, rate: 0, fund: "SBI Liquid Fund" },
      { months: 24, rate: 0, fund: "ICICI Prudential Liquid Fund" },
      { months: 36, rate: 10.5, fund: "Kotak Liquid Fund" },
      { months: 48, rate: 10.5, fund: "Nippon India Liquid Fund" },
      { months: 60, rate: 10.5, fund: "Aditya Birla Liquid Fund" },
    ];

    return tenures.map((t) => {
      let monthly;
      if (t.rate === 0) {
        monthly = Math.round(price / t.months);
      } else {
        const r = t.rate / 100 / 12;
        const n = t.months;
        monthly = Math.round((price * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
      }
      return {
        id: `custom-plan-${t.months}`,
        tenureMonths: t.months,
        monthlyAmount: monthly,
        interestRate: t.rate,
        cashbackAmount: 7500,
        fundName: t.fund,
      };
    });
  };

  if (cart.length === 0) {
    return (
      <main className="max-w-[1160px] mx-auto px-6 py-24 text-center">
        <div className="bg-white rounded-3xl border border-divider p-12 max-w-lg mx-auto shadow-sm">
          <div className="w-20 h-20 rounded-full bg-accent-light flex items-center justify-center text-3xl mx-auto mb-5 text-accent">
            🛒
          </div>
          <h1 className="text-[26px] font-bold text-primary tracking-[-0.02em] mb-2">
            Your Cart is Empty
          </h1>
          <p className="text-[15px] text-secondary leading-relaxed mb-8">
            Explore our curated catalog of flagships and laptops backed by zero-cost mutual fund EMI plans.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-accent text-white text-[15px] font-bold hover:bg-accent-hover transition-colors shadow-md hover:shadow-lg no-underline"
          >
            Start Shopping →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-[1160px] mx-auto px-6 pt-8 pb-24">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[32px] font-bold text-primary tracking-[-0.03em]">
            Shopping Cart
          </h1>
          <p className="text-[14px] text-secondary mt-0.5">
            {cart.length} {cart.length === 1 ? "device" : "devices"} configured with mutual fund EMI
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-[13px] font-semibold text-secondary hover:text-red-600 transition-colors cursor-pointer"
        >
          Clear entire cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Line Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-6 border border-divider shadow-sm transition-all hover:border-accent/30"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-divider">
                {/* Product Thumbnail & Details */}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-page-subtle rounded-xl p-2 flex items-center justify-center flex-shrink-0 border border-divider">
                    <img
                      src={item.variant.imageUrl}
                      alt={item.product.name}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        e.target.src = "/images/iphone-17-pro-natural.png";
                      }}
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-accent bg-accent-light px-2 py-0.5 rounded-md inline-block mb-1">
                      {item.product.brand}
                    </span>
                    <h3 className="text-[17px] font-bold text-primary">
                      {item.product.name}
                    </h3>
                    <p className="text-[13px] text-secondary">
                      {item.variant.variantLabel} •{" "}
                      <span className="font-semibold text-primary">
                        {formatPrice(item.variant.price)}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  aria-label="Remove item"
                  className="text-secondary hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer text-[13px] font-medium flex items-center gap-1 self-end sm:self-center"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Remove
                </button>
              </div>

              {/* Selected Plan Details + In-cart Plan Changer */}
              <div className="pt-4 flex flex-wrap items-center justify-between gap-3 bg-page-subtle -mx-6 -mb-6 p-6 rounded-b-2xl border-t border-divider">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[16px] font-bold text-primary">
                      {formatPrice(item.emiPlan.monthlyAmount)}{" "}
                      <span className="text-[13px] font-normal text-secondary">
                        / month × {item.emiPlan.tenureMonths} mos
                      </span>
                    </span>
                    <span className="text-[11px] font-bold text-success bg-success-bg px-2 py-0.5 rounded-full border border-success/20">
                      {item.emiPlan.interestRate === 0
                        ? "0% Interest"
                        : `${item.emiPlan.interestRate}% p.a.`}
                    </span>
                  </div>
                  <p className="text-[12px] text-tertiary">
                    Backed by {item.emiPlan.fundName} • Includes {formatPrice(item.emiPlan.cashbackAmount)} cashback
                  </p>
                </div>

                {/* Change EMI Plan button */}
                <button
                  type="button"
                  onClick={() => setEditingItem(item)}
                  className="px-4 py-2 rounded-xl bg-white border border-accent text-accent hover:bg-accent-light text-[13px] font-bold transition-all cursor-pointer shadow-sm"
                >
                  Change Tenure Plan ⚙️
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Panel */}
        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-divider shadow-sm space-y-6">
            <h2 className="text-[18px] font-bold text-primary tracking-[-0.02em] pb-3 border-b border-divider">
              Payment & Outflow Summary
            </h2>

            {/* Total Device Value */}
            <div className="space-y-3 text-[14px]">
              <div className="flex justify-between text-secondary">
                <span>Total Gadget Value</span>
                <span className="font-semibold text-primary">
                  {formatPrice(totalDeviceValue)}
                </span>
              </div>

              {/* Monthly Outflow Breakdown */}
              <div className="pt-3 border-t border-divider space-y-2">
                <span className="text-[13px] font-bold text-primary block">
                  Monthly EMI Outflow Breakdown:
                </span>
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-[13px] text-secondary pl-2 border-l-2 border-accent"
                  >
                    <span className="truncate max-w-[180px]">{item.product.name} ({item.emiPlan.tenureMonths}m)</span>
                    <span className="font-semibold text-primary">
                      {formatPrice(item.emiPlan.monthlyAmount)}/mo
                    </span>
                  </div>
                ))}
              </div>

              {/* Total Monthly Outflow */}
              <div className="pt-3 border-t border-divider flex justify-between items-baseline">
                <span className="font-bold text-primary text-[15px]">
                  Total Monthly Outflow
                </span>
                <span className="text-[22px] font-bold text-accent">
                  {formatPrice(totalMonthlyOutflow)}
                  <span className="text-[13px] font-normal text-secondary">/mo</span>
                </span>
              </div>

              {/* Total Cashback */}
              <div className="bg-success-bg/80 border border-success/30 p-3.5 rounded-xl flex items-center justify-between text-[13px]">
                <span className="text-success font-semibold flex items-center gap-1.5">
                  <span>🎁</span> Total Guaranteed Cashback
                </span>
                <span className="font-bold text-success text-[15px]">
                  {formatPrice(totalCashback)}
                </span>
              </div>
            </div>

            {/* Mutual Fund Guarantee Note */}
            <div className="p-3.5 bg-accent-light/50 rounded-xl border border-accent-subtle text-[12px] text-accent space-y-1">
              <div className="font-bold flex items-center gap-1">
                <span>🛡️</span> Zero Out-of-Pocket Expense
              </div>
              <p className="text-secondary text-[11px] leading-relaxed">
                Your mutual funds are pledged digitally. Dividends & daily returns continue crediting to your account.
              </p>
            </div>

            {/* Proceed to Checkout CTA */}
            <button
              type="button"
              onClick={() => navigate("/checkout")}
              className="w-full py-4 px-6 rounded-xl bg-accent text-white text-[16px] font-bold hover:bg-accent-hover transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2"
            >
              Proceed to Instant Checkout →
            </button>
          </div>
        </div>
      </div>

      {/* In-Cart Plan Switcher Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-divider space-y-6 max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-divider">
              <div>
                <h3 className="text-[18px] font-bold text-primary">
                  Select EMI Plan for {editingItem.product.name}
                </h3>
                <p className="text-[13px] text-secondary">
                  Choose your preferred tenure & liquid fund
                </p>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-secondary font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5">
              {getTenureOptions(editingItem.variant.price).map((plan) => {
                const isSelected = editingItem.emiPlan.tenureMonths === plan.tenureMonths;
                return (
                  <div
                    key={plan.id}
                    onClick={() => {
                      updateItemPlan(editingItem.id, plan);
                      setEditingItem(null);
                    }}
                    className={`
                      p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3
                      ${
                        isSelected
                          ? "bg-accent-light/60 border-accent shadow-sm ring-1 ring-accent"
                          : "bg-white border-divider hover:border-accent/40 hover:bg-page-subtle"
                      }
                    `}
                  >
                    <div>
                      <div className="text-[15px] font-bold text-primary">
                        {formatPrice(plan.monthlyAmount)} / month
                      </div>
                      <div className="text-[12px] text-secondary">
                        {plan.tenureMonths} months • {plan.fundName}
                      </div>
                    </div>
                    <span
                      className={`text-[12px] font-bold px-2.5 py-0.5 rounded-full ${
                        plan.interestRate === 0
                          ? "text-success bg-success-bg border border-success/20"
                          : "text-secondary bg-gray-100"
                      }`}
                    >
                      {plan.interestRate === 0 ? "0% Interest" : `${plan.interestRate}% p.a.`}
                    </span>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className="w-full py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-primary text-[14px] font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
