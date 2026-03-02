import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProduct, addToCart } from "../api/client";
import { ShoppingCart, Star, ArrowLeft } from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(Number(id)),
  });
  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: () => addToCart(Number(id)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });

  if (isLoading) return <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-500">Loading...</div>;
  if (!product) return <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-500">Product not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/" className="flex items-center gap-2 text-walmart-blue hover:underline mb-6 text-sm">
        <ArrowLeft size={16} /> Back to store
      </Link>

      <div className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row gap-8">
        {/* Image placeholder */}
        <div className="bg-blue-50 rounded-xl flex items-center justify-center text-8xl md:w-64 md:h-64 w-full h-52 flex-shrink-0">
          📦
        </div>

        <div className="flex-1">
          <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
            {product.category?.name}
          </span>
          <h1 className="text-2xl font-bold text-gray-900 mt-3 mb-2">{product.name}</h1>

          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} className={i < 4 ? "text-walmart-yellow fill-walmart-yellow" : "text-gray-300"} />
            ))}
            <span className="text-sm text-gray-500 ml-1">(42 reviews)</span>
          </div>

          <p className="text-3xl font-extrabold text-gray-900 mb-1">
            ${(product.priceCents / 100).toFixed(2)}
          </p>
          {product.priceCents > 5000 && (
            <p className="text-sm text-gray-400 line-through mb-1">
              Was ${((product.priceCents * 1.2) / 100).toFixed(2)}
            </p>
          )}
          <p className={`text-sm font-semibold mb-4 ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
            {product.stock > 0 ? `✓ In stock (${product.stock} available)` : "✗ Out of stock"}
          </p>

          <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

          <div className="flex gap-3">
            <button
              onClick={() => mutate()}
              disabled={isPending || product.stock === 0}
              className="flex-1 bg-walmart-blue hover:bg-walmart-dark text-white font-bold py-3 rounded-full flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <ShoppingCart size={18} />
              {isPending ? "Adding..." : isSuccess ? "Added!" : "Add to Cart"}
            </button>
            <Link
              to="/cart"
              className="px-6 py-3 border-2 border-walmart-blue text-walmart-blue font-bold rounded-full hover:bg-blue-50 transition"
            >
              View Cart
            </Link>
          </div>
          <p className="text-xs text-gray-400 mt-4">🚚 Free shipping on orders over $50 · Use code SAVE10 for 10% off</p>
        </div>
      </div>
    </div>
  );
}
