import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const location = useLocation();
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-divider transition-all">
      <div className="max-w-[1160px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand: "glide" lowercase, medium weight, tight tracking */}
        <Link
          to="/"
          className="text-[22px] font-medium tracking-tighter text-primary hover:text-accent transition-colors no-underline"
        >
          glide
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-[14px] font-medium text-secondary">
          <Link
            to="/"
            className={`transition-colors hover:text-primary no-underline ${
              location.pathname === "/" ? "text-primary font-semibold" : ""
            }`}
          >
            Home
          </Link>
          <a
            href="/#how-it-works"
            className="transition-colors hover:text-primary no-underline text-secondary"
          >
            How it Works
          </a>
          <Link
            to="/shop"
            className={`transition-colors hover:text-primary no-underline ${
              location.pathname === "/shop" ? "text-primary font-semibold" : ""
            }`}
          >
            Shop
          </Link>
          <a
            href="/#calculator"
            className="transition-colors hover:text-primary no-underline text-secondary"
          >
            Calculator
          </a>
          <a
            href="/#faqs"
            className="transition-colors hover:text-primary no-underline text-secondary"
          >
            FAQs
          </a>
        </nav>

        {/* Right Actions: Cart & Start Shopping CTA */}
        <div className="flex items-center gap-4">
          {/* Cart Icon */}
          <Link
            to="/cart"
            aria-label="Shopping Cart"
            className="relative p-2 text-secondary hover:text-primary transition-colors no-underline flex items-center"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-scale-in">
                {itemCount}
              </span>
            )}
          </Link>

          {/* CTA button */}
          <Link
            to="/shop"
            className="px-4.5 py-2 rounded-xl bg-accent text-white text-[14px] font-bold hover:bg-accent-hover transition-colors shadow-sm hover:shadow-md no-underline flex items-center gap-1.5"
          >
            Start Shopping
            <span className="text-xs">→</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
