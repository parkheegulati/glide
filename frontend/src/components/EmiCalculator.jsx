import { useState } from "react";
import { formatPrice } from "../utils";

export default function EmiCalculator() {
  const [purchaseAmount, setPurchaseAmount] = useState(120000);
  const [tenure, setTenure] = useState(24);

  const tenures = [3, 6, 12, 24, 36, 48, 60];
  const isZeroPercent = tenure <= 24;
  const interestRate = isZeroPercent ? 0 : 10.5;

  // Monthly EMI calculation
  let monthlyEmi = 0;
  if (isZeroPercent) {
    monthlyEmi = Math.round(purchaseAmount / tenure);
  } else {
    const r = interestRate / 100 / 12;
    const n = tenure;
    monthlyEmi = Math.round((purchaseAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
  }

  // Estimated mutual fund return during tenure @ 7.5% p.a.
  const annualMfRate = 0.075;
  const estimatedMfGain = Math.round(
    purchaseAmount * (Math.pow(1 + annualMfRate / 12, tenure) - 1)
  );

  // Credit card comparison (standard 16% reducing interest + 3% processing fee)
  const ccRate = 0.16 / 12;
  const ccMonthly = Math.round((purchaseAmount * ccRate * Math.pow(1 + ccRate, tenure)) / (Math.pow(1 + ccRate, tenure) - 1));
  const ccTotalInterest = ccMonthly * tenure - purchaseAmount + Math.round(purchaseAmount * 0.03);

  return (
    <section id="calculator" className="py-20 bg-page-subtle border-y border-divider">
      <div className="max-w-[1160px] mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-light text-accent text-[12px] font-bold uppercase tracking-wider mb-3">
            <span className="w-2 h-2 rounded-full bg-accent"></span>
            Smart Savings Calculator
          </div>
          <h2 className="text-[32px] sm:text-[38px] font-bold text-primary tracking-[-0.03em] leading-tight">
            See How Much You Save With Mutual Fund Pledging
          </h2>
          <p className="text-[15px] text-secondary mt-3 leading-relaxed">
            Keep your money invested in liquid funds earning compounding returns while paying comfortable no-cost monthly EMIs.
          </p>
        </div>

        {/* Calculator Interactive Box */}
        <div className="bg-white rounded-3xl border border-divider shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Controls Left Column */}
          <div className="lg:col-span-7 p-8 sm:p-10 space-y-8">
            {/* Slider: Purchase Amount */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-[14px] font-bold text-secondary">
                  Gadget Purchase Value
                </label>
                <span className="text-[22px] font-bold text-primary">
                  {formatPrice(purchaseAmount)}
                </span>
              </div>
              <input
                type="range"
                min="20000"
                max="300000"
                step="5000"
                value={purchaseAmount}
                onChange={(e) => setPurchaseAmount(Number(e.target.value))}
                className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#5B21B6]"
              />
              <div className="flex justify-between text-[11px] text-tertiary mt-2">
                <span>₹20,000</span>
                <span>₹1,50,000</span>
                <span>₹3,00,000</span>
              </div>
            </div>

            {/* Tenure Selector */}
            <div>
              <label className="text-[14px] font-bold text-secondary block mb-3">
                Choose EMI Tenure (Months)
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {tenures.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTenure(t)}
                    className={`
                      py-3 rounded-xl font-bold text-[14px] transition-all cursor-pointer border
                      ${
                        tenure === t
                          ? "bg-accent text-white border-accent shadow-sm"
                          : "bg-page-subtle text-primary border-divider hover:border-accent/40"
                      }
                    `}
                  >
                    {t}m
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-3 text-[12px]">
                <span className="text-success font-semibold flex items-center gap-1">
                  <span>✓</span> Up to 24m is 0% No-Cost EMI
                </span>
              </div>
            </div>

            {/* Quick Metrics Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-divider">
              <div className="p-4 bg-page-subtle rounded-2xl border border-divider">
                <span className="text-[12px] font-semibold text-secondary block">
                  Glide Interest Rate
                </span>
                <span className="text-[18px] font-bold text-primary mt-1 block">
                  {isZeroPercent ? "0% Interest (Zero Cost)" : "10.5% p.a."}
                </span>
                <span className="text-[11px] text-tertiary">Zero processing fee</span>
              </div>

              <div className="p-4 bg-success-bg/60 rounded-2xl border border-success/30">
                <span className="text-[12px] font-semibold text-success block">
                  Est. Mutual Fund Return
                </span>
                <span className="text-[18px] font-bold text-success mt-1 block">
                  +{formatPrice(estimatedMfGain)}
                </span>
                <span className="text-[11px] text-success/80">
                  @ ~7.5% p.a. liquid fund growth
                </span>
              </div>
            </div>
          </div>

          {/* Outcome Summary Right Column */}
          <div className="lg:col-span-5 bg-dark text-on-dark p-8 sm:p-10 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-accent-light/80 bg-white/10 px-3 py-1 rounded-full inline-block mb-4">
                Monthly Repayment
              </span>
              <div className="text-[40px] font-bold tracking-tight text-white">
                {formatPrice(monthlyEmi)}
                <span className="text-[16px] font-normal text-gray-400">/mo</span>
              </div>
              <p className="text-[13px] text-gray-400 mt-1">
                for {tenure} months with guaranteed ₹7,500 cashback on device delivery.
              </p>
            </div>

            {/* Value comparison vs Credit Card */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="text-[13px] font-bold text-gray-200 flex items-center justify-between">
                <span>Traditional Credit Card EMI:</span>
                <span className="text-red-400 font-bold">{formatPrice(ccMonthly)}/mo</span>
              </div>
              <div className="text-[12px] text-gray-400">
                You save approx <span className="font-bold text-emerald-400">{formatPrice(ccTotalInterest + estimatedMfGain)}</span> with Glide vs paying high credit card interest!
              </div>
            </div>

            <a
              href="/shop"
              className="w-full py-4 rounded-xl bg-accent text-white text-[15px] font-bold hover:bg-accent-hover transition-colors text-center no-underline shadow-lg flex items-center justify-center gap-2"
            >
              Browse 0% EMI Products →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
