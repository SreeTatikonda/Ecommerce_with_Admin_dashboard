import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getCategories, getProducts } from "../api/client";
import ProductCard from "../components/ProductCard";

const categoryEmojis: Record<string, string> = {
  electronics: "📺", gadgets: "⌚", "home-decor": "🏠", clothing: "👕",
  "sports-outdoors": "🏋️", kitchen: "🍳", beauty: "💄", books: "📚",
};
const categoryColors: Record<string, string> = {
  electronics: "bg-blue-50 hover:bg-blue-100",
  gadgets: "bg-purple-50 hover:bg-purple-100",
  "home-decor": "bg-green-50 hover:bg-green-100",
  clothing: "bg-pink-50 hover:bg-pink-100",
  "sports-outdoors": "bg-orange-50 hover:bg-orange-100",
  kitchen: "bg-yellow-50 hover:bg-yellow-100",
  beauty: "bg-rose-50 hover:bg-rose-100",
  books: "bg-teal-50 hover:bg-teal-100",
};

export default function Home() {
  const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: getCategories });
  const { data: products, isLoading } = useQuery({ queryKey: ["products"], queryFn: () => getProducts() });

  return (
    <div>
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-walmart-blue to-walmart-dark text-white py-16 px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Save Money. Live Better.</h1>
        <p className="text-lg text-blue-100 mb-6">Thousands of products across every category — delivered fast.</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/category/electronics" className="bg-walmart-yellow text-walmart-blue font-bold px-8 py-3 rounded-full hover:bg-yellow-400 transition">
            Shop Electronics
          </Link>
          <Link to="/" className="bg-white text-walmart-blue font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition">
            View All Deals
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Promo Strip */}
        <div className="bg-walmart-yellow rounded-xl p-4 mb-8 flex items-center justify-between flex-wrap gap-2">
          <p className="font-bold text-walmart-blue text-lg">🎉 Use code <span className="underline">SAVE10</span> at checkout — 10% off your order!</p>
          <Link to="/category/gadgets" className="bg-walmart-blue text-white px-5 py-2 rounded-full text-sm font-semibold">Shop Now</Link>
        </div>

        {/* Categories */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Shop by Department</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-10">
          {categories?.map(cat => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className={`${categoryColors[cat.slug] ?? "bg-gray-50 hover:bg-gray-100"} rounded-xl p-4 flex flex-col items-center gap-2 transition text-center group`}
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">
                {categoryEmojis[cat.slug] ?? "📦"}
              </span>
              <span className="text-xs font-semibold text-gray-700 leading-tight">{cat.name}</span>
            </Link>
          ))}
        </div>

        {/* Featured Products */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Featured Products</h2>
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl h-64 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products?.slice(0, 12).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
