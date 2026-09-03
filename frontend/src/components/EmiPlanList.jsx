import { formatPrice } from "../utils";

export default function EmiPlanList({ plans, selectedPlanId, onSelectPlan }) {
  if (!plans || plans.length === 0) {
    return (
      <div className="py-6 text-center text-secondary text-[14px]">
        Loading EMI plans…
      </div>
    );
  }

  return (
    <div className="space-y-2.5" role="radiogroup" aria-label="Available EMI plans">
      {plans.map((plan) => {
        const isSelected = selectedPlanId === plan.id;
        const isZeroPercent = Number(plan.interestRate) === 0;

        return (
          <div
            key={plan.id}
            onClick={() => onSelectPlan(plan)}
            role="radio"
            aria-checked={isSelected}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectPlan(plan);
              }
            }}
            className={`
              relative p-4 rounded-xl cursor-pointer transition-all duration-200 border
              ${
                isSelected
                  ? "bg-accent-light/50 border-accent shadow-[0_0_0_1.5px_#5B21B6]"
                  : "bg-white border-divider hover:border-accent/40 hover:bg-page-subtle"
              }
            `}
          >
            <div className="flex items-start justify-between gap-3">
              {/* Left Column: Radio + Amount */}
              <div className="flex items-start gap-3 min-w-0">
                {/* Radio Indicator */}
                <div
                  className={`
                    mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
                    ${isSelected ? "border-accent bg-accent" : "border-divider-strong bg-white"}
                  `}
                >
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>

                {/* Tenure & EMI */}
                <div>
                  <div className="text-[16px] sm:text-[17px] font-bold text-primary tracking-[-0.01em]">
                    {formatPrice(plan.monthlyAmount)}{" "}
                    <span className="font-normal text-secondary text-[14px]">
                      / month × {plan.tenureMonths} mos
                    </span>
                  </div>

                  {plan.cashbackAmount && Number(plan.cashbackAmount) > 0 && (
                    <div className="text-[12px] font-semibold text-success mt-0.5 flex items-center gap-1">
                      <span>Includes ₹{Number(plan.cashbackAmount).toLocaleString("en-IN")} instant cashback</span>
                    </div>
                  )}

                  <div className="text-[11px] text-tertiary mt-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent/60 inline-block"></span>
                    Secured by {plan.fundName}
                  </div>
                </div>
              </div>

              {/* Right Column: Interest badge */}
              <div className="text-right flex-shrink-0">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-bold ${
                    isZeroPercent
                      ? "text-success bg-success-bg border border-success/20"
                      : "text-secondary bg-gray-100"
                  }`}
                >
                  {isZeroPercent ? "0% interest" : `${plan.interestRate}% p.a.`}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
