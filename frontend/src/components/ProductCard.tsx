import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type Product, addToCart } from "../api/client";
import { ShoppingCart, Star } from "lucide-react";

const categoryColors: Record<string, string> = {
  electronics: "bg-blue-100 text-blue-800",
  gadgets: "bg-purple-100 text-purple-800",
  "home-decor": "bg-green-100 text-green-800",
  clothing: "bg-pink-100 text-pink-800",
  "sports-outdoors": "bg-orange-100 text-orange-800",
  kitchen: "bg-yellow-100 text-yellow-800",
  beauty: "bg-rose-100 text-rose-800",
  books: "bg-teal-100 text-teal-800",
};

const categoryEmojis: Record<string, string> = {
  electronics: "📺", gadgets: "⌚", "home-decor": "🏠", clothing: "👕",
  "sports-outdoors": "🏋️", kitchen: "🍳", beauty: "💄", books: "📚",
};

export default function ProductCard({ product }: { product: Product }) {
  const qc = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: () => addToCart(product.id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });

  const slug = product.category?.slug ?? "";
  const colorClass = categoryColors[slug] ?? "bg-gray-100 text-gray-800";
  const emoji = categoryEmojis[slug] ?? "📦";

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col overflow-hidden group">
      {/* Image placeholder */}
      <div className={`h-44 flex items-center justify-center text-6xl ${colorClass} group-hover:scale-105 transition-transform`}>
        {emoji}
      </div>

      <div className="p-4 flex flex-col flex-1">
        {/* Category badge */}
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full w-fit mb-2 ${colorClass}`}>
          {product.category?.name}
        </span>

        <Link to={`/product/${product.id}`} className="font-semibold text-gray-800 hover:text-walmart-blue text-sm leading-tight mb-1 line-clamp-2">
          {product.name}
        </Link>

        {/* Mock rating */}
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} className={i < 4 ? "text-walmart-yellow fill-walmart-yellow" : "text-gray-300"} />
          ))}
          <span className="text-xs text-gray-500">(42)</span>
        </div>

        <div className="mt-auto">
          <p className="text-xl font-bold text-gray-900 mb-1">
            ${(product.priceCents / 100).toFixed(2)}
          </p>
          {product.priceCents > 5000 && (
            <p className="text-xs text-gray-400 line-through mb-1">
              ${((product.priceCents * 1.2) / 100).toFixed(2)}
            </p>
          )}
          <p className="text-xs text-green-600 font-medium mb-3">
            {product.stock > 10 ? "✓ In stock" : product.stock > 0 ? `Only ${product.stock} left` : "Out of stock"}
          </p>
          <button
            onClick={() => mutate()}
            disabled={isPending || product.stock === 0}
            className="w-full bg-walmart-blue hover:bg-walmart-dark text-white font-semibold py-2 rounded-full text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <ShoppingCart size={14} />
            {isPending ? "Adding..." : "Add to cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
