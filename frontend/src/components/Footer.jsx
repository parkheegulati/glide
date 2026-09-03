import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-dark text-on-dark border-t border-white/10 pt-16 pb-12">
      <div className="max-w-[1160px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand & Blurb */}
          <div className="md:col-span-5 space-y-4">
            <span className="text-[26px] font-medium tracking-tighter text-white">
              glide
            </span>
            <p className="text-[14px] text-gray-400 leading-relaxed max-w-sm">
              India's premier mutual-fund-backed no-cost EMI shopping platform. Upgrade your flagship tech while your investment portfolio continues to compound in SEBI-registered liquid funds.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                AMFI / SEBI Regulated Custodians
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-[13px] font-bold text-white uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-2 text-[14px] text-gray-400 list-none p-0">
              <li>
                <Link to="/" className="hover:text-white transition-colors no-underline text-gray-400">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white transition-colors no-underline text-gray-400">
                  Shop Catalog
                </Link>
              </li>
              <li>
                <a href="/#how-it-works" className="hover:text-white transition-colors no-underline text-gray-400">
                  How it Works
                </a>
              </li>
              <li>
                <a href="/#calculator" className="hover:text-white transition-colors no-underline text-gray-400">
                  EMI Calculator
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-[13px] font-bold text-white uppercase tracking-wider">
              Flagships
            </h4>
            <ul className="space-y-2 text-[14px] text-gray-400 list-none p-0">
              <li>
                <Link to="/shop?category=Smartphones" className="hover:text-white transition-colors no-underline text-gray-400">
                  Smartphones
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Laptops" className="hover:text-white transition-colors no-underline text-gray-400">
                  Laptops
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Audio" className="hover:text-white transition-colors no-underline text-gray-400">
                  Audio & Wearables
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors no-underline text-gray-400">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[13px] font-bold text-white uppercase tracking-wider">
              Trust & Support
            </h4>
            <ul className="space-y-2 text-[14px] text-gray-400 list-none p-0">
              <li>
                <a href="/#faqs" className="hover:text-white transition-colors no-underline text-gray-400">
                  Frequently Asked Questions
                </a>
              </li>
              <li>
                <span className="text-gray-400">support@glide.financial</span>
              </li>
              <li>
                <span className="text-gray-400">Mon - Sat: 9:00 AM - 7:00 PM IST</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-gray-500">
          <p>© {new Date().getFullYear()} Glide Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
              Privacy Policy
            </span>
            <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
              Terms of Service
            </span>
            <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
              Security
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
