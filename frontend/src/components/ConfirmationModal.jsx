import { useEffect, useRef } from "react";
import { formatPrice } from "../utils";

export default function ConfirmationModal({
  isOpen,
  onClose,
  product,
  variant,
  plan,
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
      document.body.style.overflow = "hidden";
    } else {
      dialogRef.current?.close();
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  function handleBackdropClick(e) {
    if (e.target === dialogRef.current) {
      onClose();
    }
  }

  if (!product || !variant || !plan) return null;

  return (
    <dialog
      ref={dialogRef}
      onCancel={onClose}
      onClick={handleBackdropClick}
      className="
        fixed inset-0 m-auto p-0
        bg-transparent backdrop:bg-black/50 backdrop:backdrop-blur-sm
        max-w-[480px] w-[calc(100%-32px)]
        rounded-2xl border-none outline-none
      "
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-2xl animate-fade-in border border-black/10">
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-accent bg-accent/10 px-2.5 py-0.5 rounded-full">
              Plan Summary
            </span>
            <button
              onClick={onClose}
              className="text-secondary hover:text-primary p-1 rounded-full text-lg cursor-pointer"
              aria-label="Close dialog"
            >
              ✕
            </button>
          </div>
          <h2 className="text-[22px] font-bold text-primary tracking-[-0.02em] mt-2">
            Confirm your EMI plan
          </h2>
          <p className="text-[13px] text-secondary mt-0.5">
            Zero collateral • Backed by mutual fund investments
          </p>
        </div>

        <div className="h-px bg-[#E5E5EA]" />

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Product Info Row */}
          <div className="flex items-center gap-4 p-3.5 bg-[#F5F5F7] rounded-xl">
            <div className="w-14 h-14 bg-white rounded-lg p-2 flex items-center justify-center border border-black/5 flex-shrink-0">
              <img
                src={variant.imageUrl}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-[16px] font-semibold text-primary truncate">
                {product.name}
              </h4>
              <p className="text-[13px] text-secondary">
                {variant.storage} • {variant.color}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[15px] font-bold text-primary block">
                {formatPrice(variant.price)}
              </span>
            </div>
          </div>

          {/* Breakdown Card */}
          <div className="border border-[#E5E5EA] rounded-xl p-4 space-y-3 bg-white">
            <div className="flex justify-between items-baseline">
              <span className="text-[13px] text-secondary">Monthly Payment</span>
              <span className="text-[16px] font-bold text-accent">
                {formatPrice(plan.monthlyAmount)} / mo
              </span>
            </div>

            <div className="flex justify-between items-baseline">
              <span className="text-[13px] text-secondary">Tenure Duration</span>
              <span className="text-[14px] font-medium text-primary">
                {plan.tenureMonths} Months
              </span>
            </div>

            <div className="flex justify-between items-baseline">
              <span className="text-[13px] text-secondary">Annual Interest</span>
              <span className={`text-[14px] font-medium ${Number(plan.interestRate) === 0 ? "text-[#1D7A46]" : "text-primary"}`}>
                {Number(plan.interestRate) === 0 ? "0% (No Cost EMI)" : `${plan.interestRate}%`}
              </span>
            </div>

            {plan.cashbackAmount && Number(plan.cashbackAmount) > 0 && (
              <div className="flex justify-between items-baseline pt-2 border-t border-dashed border-[#E5E5EA]">
                <span className="text-[13px] font-medium text-[#1D7A46]">Cashback Discount</span>
                <span className="text-[14px] font-bold text-[#1D7A46]">
                  - {formatPrice(plan.cashbackAmount)}
                </span>
              </div>
            )}

            <div className="pt-2 border-t border-[#E5E5EA] flex justify-between items-baseline">
              <span className="text-[12px] text-tertiary">Fund Security</span>
              <span className="text-[12px] font-medium text-secondary truncate max-w-[220px]">
                {plan.fundName}
              </span>
            </div>
          </div>
        </div>

        <div className="h-px bg-[#E5E5EA]" />

        {/* Footer actions */}
        <div className="px-6 py-4 bg-[#FAFAFC] flex items-center gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-[14px] font-medium text-secondary hover:text-primary hover:bg-black/5 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              alert(`Order created for ${product.name} (${variant.variantLabel}) with ${plan.tenureMonths}m EMI plan!`);
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl text-[14px] font-semibold text-white bg-accent hover:bg-accent-hover transition-colors shadow-sm cursor-pointer"
          >
            Confirm & Proceed
          </button>
        </div>
      </div>
    </dialog>
  );
}
