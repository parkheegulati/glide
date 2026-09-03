import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils";

export default function Checkout() {
  const { cart, totalDeviceValue, totalMonthlyOutflow, totalCashback, clearCart } = useCart();
  const navigate = useNavigate();

  const [panNumber, setPanNumber] = useState("ABCDE1234F");
  const [phone, setPhone] = useState("9876543210");
  const [address, setAddress] = useState("402, Skyline Towers, Indiranagar, Bengaluru, 560038");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderReference, setOrderReference] = useState(null);

  // If cart is empty and not in success screen, redirect or show empty
  if (cart.length === 0 && !isSuccess) {
    return (
      <main className="max-w-[1160px] mx-auto px-6 py-24 text-center">
        <div className="bg-white rounded-3xl border border-divider p-10 max-w-md mx-auto shadow-sm">
          <h2 className="text-[20px] font-bold text-primary mb-2">No Items to Checkout</h2>
          <p className="text-[14px] text-secondary mb-6">
            Please add items to your cart before proceeding to checkout.
          </p>
          <Link
            to="/shop"
            className="inline-block px-6 py-3 rounded-xl bg-accent text-white text-[14px] font-bold hover:bg-accent-hover transition-colors no-underline"
          >
            ← Browse Catalog
          </Link>
        </div>
      </main>
    );
  }

  const handleConfirmPurchase = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate OTP verification & instant pledge creation
    setTimeout(() => {
      const orderId = `GLD-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderReference(orderId);
      setIsProcessing(false);
      setIsSuccess(true);
      clearCart();
    }, 1800);
  };

  // ── Success State Screen ─────────────────────────────────────────
  if (isSuccess) {
    return (
      <main className="max-w-[720px] mx-auto px-6 py-16 text-center animate-fade-in">
        <div className="bg-white rounded-3xl border border-divider p-8 sm:p-12 shadow-xl space-y-6">
          <div className="w-20 h-20 rounded-full bg-success-bg text-success flex items-center justify-center text-3xl mx-auto shadow-inner">
            ✓
          </div>

          <div>
            <span className="text-[12px] font-bold uppercase tracking-wider text-success bg-success-bg px-3 py-1 rounded-full inline-block mb-2">
              Mutual Fund Pledge Successful
            </span>
            <h1 className="text-[32px] font-bold text-primary tracking-[-0.03em]">
              Order Confirmed!
            </h1>
            <p className="text-[15px] text-secondary mt-1">
              Order Reference: <span className="font-bold text-primary">{orderReference}</span>
            </p>
          </div>

          {/* Demonstration Notice */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-[13px] text-amber-800 text-left">
            <span className="font-bold">✨ Demo Simulation:</span> No real money or mutual funds have been deducted. In production, digital lien marking is executed via CAMS/KFintech API in real-time.
          </div>

          <div className="bg-page-subtle rounded-2xl p-6 border border-divider text-left space-y-4">
            <h3 className="text-[15px] font-bold text-primary">EMI & Delivery Schedule</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
              <div>
                <span className="text-secondary block">Monthly EMI Outflow</span>
                <span className="font-bold text-accent text-[16px]">
                  {formatPrice(totalMonthlyOutflow)}/month
                </span>
              </div>
              <div>
                <span className="text-secondary block">First Auto-Debit Date</span>
                <span className="font-bold text-primary">5th of Next Month</span>
              </div>
              <div>
                <span className="text-secondary block">Cashback Credit</span>
                <span className="font-bold text-success">
                  {formatPrice(totalCashback)} (Within 24 hours)
                </span>
              </div>
              <div>
                <span className="text-secondary block">Shipping Status</span>
                <span className="font-bold text-primary">Express Dispatch (2-3 days)</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/shop"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-accent text-white text-[15px] font-bold hover:bg-accent-hover transition-colors shadow-md no-underline"
            >
              Continue Shopping →
            </Link>
            <Link
              to="/"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gray-100 text-primary hover:bg-gray-200 text-[15px] font-semibold transition-colors no-underline"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ── Checkout Form ────────────────────────────────────────────────
  return (
    <main className="max-w-[1160px] mx-auto px-6 pt-8 pb-24">
      <div className="mb-8">
        <h1 className="text-[32px] font-bold text-primary tracking-[-0.03em]">
          Instant Digital Checkout
        </h1>
        <p className="text-[14px] text-secondary mt-0.5">
          Verify mutual fund holdings and confirm your zero-cost installment purchase
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Verification & Details Form */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: MF Portfolio Verification */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-divider shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div>
                <h3 className="text-[17px] font-bold text-primary">
                  Mutual Fund Digital Lien Verification
                </h3>
                <p className="text-[13px] text-secondary">
                  Paperless verification via CAMS / KFintech custodian
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-[13px] font-semibold text-secondary block mb-1.5">
                  PAN Number
                </label>
                <input
                  type="text"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 rounded-xl border border-divider bg-page-subtle text-[14px] font-bold uppercase tracking-wider text-primary focus:bg-white focus:border-accent"
                  required
                />
              </div>
              <div>
                <label className="text-[13px] font-semibold text-secondary block mb-1.5">
                  Aadhaar Linked Mobile
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-divider bg-page-subtle text-[14px] font-semibold text-primary focus:bg-white focus:border-accent"
                  required
                />
              </div>
            </div>

            <div className="p-3.5 bg-success-bg border border-success/20 rounded-xl flex items-center gap-3 text-[13px] text-success">
              <span className="text-lg">✓</span>
              <span>
                <strong>Portfolio Verified:</strong> Eligible for instant pledge approval up to ₹5,00,000.
              </span>
            </div>
          </div>

          {/* Step 2: Delivery Address */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-divider shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div>
                <h3 className="text-[17px] font-bold text-primary">
                  Delivery Address & Details
                </h3>
                <p className="text-[13px] text-secondary">
                  Where should we ship your new gadgets?
                </p>
              </div>
            </div>

            <div>
              <label className="text-[13px] font-semibold text-secondary block mb-1.5">
                Shipping Address
              </label>
              <textarea
                rows="3"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-divider bg-page-subtle text-[14px] text-primary focus:bg-white focus:border-accent"
                required
              />
            </div>
          </div>
        </div>

        {/* Order Summary & Final Confirmation CTA */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-divider shadow-sm space-y-6">
            <h2 className="text-[18px] font-bold text-primary pb-3 border-b border-divider">
              Order Summary
            </h2>

            {/* Items */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-[13px]">
                  <div>
                    <span className="font-bold text-primary block">{item.product.name}</span>
                    <span className="text-secondary text-[12px]">
                      {item.variant.variantLabel} • {item.emiPlan.tenureMonths}m Plan
                    </span>
                  </div>
                  <span className="font-bold text-accent">
                    {formatPrice(item.emiPlan.monthlyAmount)}/mo
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-divider space-y-2 text-[14px]">
              <div className="flex justify-between text-secondary">
                <span>Total Gadget Value</span>
                <span className="font-semibold text-primary">{formatPrice(totalDeviceValue)}</span>
              </div>
              <div className="flex justify-between items-baseline pt-2">
                <span className="font-bold text-primary text-[15px]">Total Monthly EMI</span>
                <span className="text-[22px] font-bold text-accent">
                  {formatPrice(totalMonthlyOutflow)}/mo
                </span>
              </div>
              <div className="flex justify-between text-success font-semibold text-[13px]">
                <span>Cashback Reward</span>
                <span>+{formatPrice(totalCashback)}</span>
              </div>
            </div>

            {/* Confirm Purchase CTA Button */}
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleConfirmPurchase}
              className={`
                w-full py-4 px-6 rounded-xl text-[16px] font-bold text-white transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-md hover:shadow-lg
                ${isProcessing ? "bg-accent/70 cursor-wait" : "bg-accent hover:bg-accent-hover"}
              `}
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  Digitally Marking Lien…
                </>
              ) : (
                "Confirm Purchase (Mock) →"
              )}
            </button>

            <p className="text-[11px] text-tertiary text-center leading-relaxed">
              By confirming, you authorize digital lien marking on your liquid mutual fund units. No funds are liquidated.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
