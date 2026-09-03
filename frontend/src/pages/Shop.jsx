import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchProducts } from "../api";
import ProductCard from "../components/ProductCard";

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "All";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular"); // popular, price-asc, price-desc
  const [maxPrice, setMaxPrice] = useState(250000);

  const categories = ["All", "Smartphones", "Laptops", "Audio"];

  // Fetch when category changes
  useEffect(() => {
    setLoading(true);
    fetchProducts({
      category: selectedCategory === "All" ? undefined : selectedCategory,
    })
      .then(setProducts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  // Filter & sort products locally for fast interactive UI
  const filteredProducts = products
    .filter((p) => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesBrand = p.brand.toLowerCase().includes(query);
        const matchesCategory = p.category?.toLowerCase().includes(query);
        if (!matchesName && !matchesBrand && !matchesCategory) return false;
      }

      // Max price filter
      const price = Number(p.defaultVariant?.price || 0);
      if (price > maxPrice) return false;

      return true;
    })
    .sort((a, b) => {
      const priceA = Number(a.defaultVariant?.price || 0);
      const priceB = Number(b.defaultVariant?.price || 0);
      if (sortBy === "price-asc") return priceA - priceB;
      if (sortBy === "price-desc") return priceB - priceA;
      return 0;
    });

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    if (cat === "All") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <main className="max-w-[1160px] mx-auto px-6 pt-8 pb-24">
      {/* Page Header */}
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-light text-accent text-[12px] font-bold uppercase tracking-wider mb-2">
          <span className="w-2 h-2 rounded-full bg-accent"></span>
          Direct Catalog
        </div>
        <h1 className="text-[32px] sm:text-[40px] font-bold text-primary tracking-[-0.03em]">
          All Products & Flagships
        </h1>
        <p className="text-[15px] text-secondary mt-1 max-w-2xl">
          Purchase the latest devices with 0% interest EMI backed by your liquid mutual fund investments.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-divider p-5 shadow-xs mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <input
              type="text"
              placeholder="Search by product name, brand (Apple, Samsung, Sony)…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-divider bg-page-subtle text-[14px] text-primary focus:bg-white focus:border-accent"
            />
            <svg
              className="w-5 h-5 text-secondary absolute left-3.5 top-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Category Tabs */}
          <div className="md:col-span-6 flex items-center justify-start md:justify-end gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`
                  px-4 py-2 rounded-xl text-[13px] font-bold transition-all cursor-pointer whitespace-nowrap border
                  ${
                    selectedCategory === cat
                      ? "bg-accent text-white border-accent shadow-xs"
                      : "bg-page-subtle text-secondary border-divider hover:border-accent/40 hover:text-primary"
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Filters: Sort & Price Limit */}
        <div className="pt-4 border-t border-divider flex flex-wrap items-center justify-between gap-4 text-[13px] text-secondary">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-primary">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-divider bg-page-subtle text-primary font-medium focus:border-accent"
            >
              <option value="popular">Most Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <span>
              Max Price: <strong className="text-primary">₹{maxPrice.toLocaleString("en-IN")}</strong>
            </span>
            <input
              type="range"
              min="30000"
              max="250000"
              step="10000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-32 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#5B21B6]"
            />
          </div>
        </div>
      </div>

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-divider space-y-4"
            >
              <div className="aspect-square w-full rounded-xl skeleton" />
              <div className="h-5 w-3/4 rounded-md skeleton" />
              <div className="h-4 w-1/2 rounded-md skeleton" />
              <div className="h-10 w-full rounded-md skeleton pt-2" />
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="text-center py-16 bg-white rounded-3xl border border-divider p-8 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 mx-auto flex items-center justify-center text-xl font-bold mb-3">
            !
          </div>
          <h3 className="text-[17px] font-bold text-primary mb-1">
            Unable to load catalog
          </h3>
          <p className="text-[14px] text-secondary mb-5">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded-xl bg-accent text-white text-[14px] font-bold hover:bg-accent-hover transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty Filter Result */}
      {!loading && !error && filteredProducts.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-divider p-10 max-w-md mx-auto">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-[18px] font-bold text-primary mb-1">
            No products matched your filter
          </h3>
          <p className="text-[14px] text-secondary mb-5">
            Try adjusting your search query, category, or price range.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
              setMaxPrice(250000);
            }}
            className="px-5 py-2.5 rounded-xl bg-page-subtle border border-divider text-primary font-bold text-[14px] hover:border-accent"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
