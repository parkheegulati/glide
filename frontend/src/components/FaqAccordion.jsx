import { useState } from "react";

const FAQS = [
  {
    q: "What is Glide and how does mutual fund backed EMI work?",
    a: "Glide is a fintech shopping platform that enables you to buy flagship electronics with 0% interest EMI using your mutual funds as collateral. Instead of borrowing against expensive credit cards or personal loans, your liquid mutual fund units are digitally lien-marked while remaining 100% in your name and compounding daily returns.",
  },
  {
    q: "Are my mutual fund investments safe during the EMI tenure?",
    a: "Yes, completely! Your mutual fund units remain in your demat/folio account with SEBI-registered RTAs (CAMS and KFintech). They are never liquidated or transferred. You continue to earn all daily NAV growth, dividends, and returns throughout the repayment period.",
  },
  {
    q: "What documents or credit score checks are required?",
    a: "Glide is 100% paperless with zero CIBIL credit score impact. You only need your PAN number and an Aadhaar-linked mobile number to complete instant OTP verification and digital pledge approval in under 60 seconds.",
  },
  {
    q: "Are there any hidden fees, processing charges, or foreclosure penalties?",
    a: "None whatsoever. 3, 6, 12, and 24-month tenures carry 0% interest and 0 processing fees. Longer tenures (36 to 60 months) carry a transparent 10.5% p.a. rate. You can prepay or foreclose anytime with zero penalty charges.",
  },
  {
    q: "What happens when I complete all my EMI payments?",
    a: "Upon your final EMI payment, the digital lien on your mutual funds is automatically released within 24 hours. Your units become fully unencumbered without needing any manual intervention.",
  },
  {
    q: "How and when is the ₹7,500 cashback credited?",
    a: "A flat ₹7,500 cashback is credited directly to your primary bank account within 24 hours of device dispatch and successful digital pledge confirmation.",
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faqs" className="py-20 bg-page-subtle border-t border-divider">
      <div className="max-w-[840px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-light text-accent text-[12px] font-bold uppercase tracking-wider mb-3">
            <span className="w-2 h-2 rounded-full bg-accent"></span>
            Frequently Asked Questions
          </div>
          <h2 className="text-[32px] sm:text-[38px] font-bold text-primary tracking-[-0.03em]">
            Everything You Need to Know About Glide
          </h2>
          <p className="text-[15px] text-secondary mt-3 leading-relaxed">
            Transparent answers on mutual fund lien marking, eligibility, and zero-cost installments.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-divider overflow-hidden transition-all duration-200 shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  aria-expanded={isOpen}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-page-subtle/50 transition-colors"
                >
                  <span className="text-[16px] sm:text-[17px] font-bold text-primary tracking-[-0.01em]">
                    {faq.q}
                  </span>
                  <div
                    className={`
                      w-8 h-8 rounded-full border border-divider flex items-center justify-center flex-shrink-0 text-secondary transition-transform duration-200
                      ${isOpen ? "rotate-180 bg-accent text-white border-accent" : "bg-page-subtle"}
                    `}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-[14px] sm:text-[15px] text-secondary leading-relaxed border-t border-divider/60 bg-page-subtle/30 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
