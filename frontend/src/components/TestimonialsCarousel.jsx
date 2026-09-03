import { useState, useEffect } from "react";

// Sample / Demo customer testimonials for Glide
const TESTIMONIALS = [
  {
    id: 1,
    name: "Rohan Mukherjee",
    role: "Product Designer, Bangalore",
    avatar: "RM",
    quote:
      "I bought the iPhone 17 Pro with a 24-month 0% EMI backed by my Axis Liquid Fund. My mutual fund stayed invested and earned ~7.5% while I upgraded without spending any cash upfront!",
    rating: 5,
    tag: "iPhone 17 Pro • 24m 0% EMI",
  },
  {
    id: 2,
    name: "Ananya Sharma",
    role: "Software Engineer, Hyderabad",
    avatar: "AS",
    quote:
      "Zero CIBIL check and 1-minute paperless pledge via OTP. The ₹7,500 cashback was credited directly to my bank account. The most frictionless tech purchase I have made.",
    rating: 5,
    tag: "MacBook Pro M4 • 12m 0% EMI",
  },
  {
    id: 3,
    name: "Vikram Mehta",
    role: "Financial Analyst, Mumbai",
    avatar: "VM",
    quote:
      "As a finance professional, paying 16-18% on credit card EMIs never made sense. Pledging liquid funds while retaining all dividend and NAV growth is brilliant financial engineering.",
    rating: 5,
    tag: "Galaxy S24 Ultra • 24m 0% EMI",
  },
  {
    id: 4,
    name: "Pooja Hegde",
    role: "Architect, Pune",
    avatar: "PH",
    quote:
      "Got the Dell XPS 15 OLED with zero downpayment. Pledging was done securely through KFintech in 45 seconds. Customer experience on Glide is 10/10.",
    rating: 5,
    tag: "Dell XPS 15 • 12m 0% EMI",
  },
  {
    id: 5,
    name: "Karthik Iyer",
    role: "Content Creator, Chennai",
    avatar: "KI",
    quote:
      "Foreclosed my 12-month Sony WH-1000XM5 plan in month 4 with zero foreclosure penalties. The lien on my liquid fund was unblocked the very next morning.",
    rating: 5,
    tag: "Sony WH-1000XM5 • 6m 0% EMI",
  },
];

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-scroll every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1160px] mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-light text-accent text-[12px] font-bold uppercase tracking-wider mb-3">
              <span className="w-2 h-2 rounded-full bg-accent"></span>
              Verified Customer Stories
            </div>
            <h2 className="text-[32px] sm:text-[38px] font-bold text-primary tracking-[-0.03em]">
              Loved by Investors & Tech Enthusiasts
            </h2>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setCurrentIndex(
                  (prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length
                )
              }
              aria-label="Previous story"
              className="w-10 h-10 rounded-full border border-divider hover:border-accent flex items-center justify-center text-secondary hover:text-primary transition-colors cursor-pointer bg-page-subtle"
            >
              ←
            </button>
            <button
              onClick={() =>
                setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length)
              }
              aria-label="Next story"
              className="w-10 h-10 rounded-full border border-divider hover:border-accent flex items-center justify-center text-secondary hover:text-primary transition-colors cursor-pointer bg-page-subtle"
            >
              →
            </button>
          </div>
        </div>

        {/* Carousel Card */}
        <div className="bg-page-subtle rounded-3xl p-8 sm:p-12 border border-divider shadow-sm relative overflow-hidden transition-all duration-300">
          <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
            <div className="space-y-6 max-w-2xl">
              {/* Stars */}
              <div className="flex items-center gap-1 text-amber-400 text-lg">
                {"★★★★★".slice(0, TESTIMONIALS[currentIndex].rating)}
              </div>

              {/* Quote */}
              <p className="text-[20px] sm:text-[24px] font-medium text-primary leading-relaxed tracking-tight">
                "{TESTIMONIALS[currentIndex].quote}"
              </p>

              {/* Author info */}
              <div className="flex items-center gap-4 pt-2">
                <div className="w-12 h-12 rounded-full bg-accent text-white font-bold flex items-center justify-center text-[15px] shadow-sm">
                  {TESTIMONIALS[currentIndex].avatar}
                </div>
                <div>
                  <h4 className="text-[16px] font-bold text-primary">
                    {TESTIMONIALS[currentIndex].name}
                  </h4>
                  <p className="text-[13px] text-secondary">
                    {TESTIMONIALS[currentIndex].role}
                  </p>
                </div>
              </div>
            </div>

            {/* Plan Badge / Tag */}
            <div className="self-start lg:self-center p-4 rounded-2xl bg-white border border-divider shadow-xs space-y-2 min-w-[220px]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-secondary block">
                Purchased With Glide
              </span>
              <span className="text-[14px] font-bold text-accent block">
                {TESTIMONIALS[currentIndex].tag}
              </span>
              <span className="text-[11px] text-success font-semibold flex items-center gap-1">
                <span>✓</span> Guaranteed ₹7,500 Cashback
              </span>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center gap-2 mt-8 pt-6 border-t border-divider justify-center">
            {TESTIMONIALS.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`
                  h-2 rounded-full transition-all duration-300 cursor-pointer
                  ${currentIndex === idx ? "w-8 bg-accent" : "w-2 bg-gray-300 hover:bg-gray-400"}
                `}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
