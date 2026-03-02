import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getCart, removeFromCart, updateQty } from "../api/client";
import { Trash2, ShoppingBag } from "lucide-react";

export default function Cart() {
  const qc = useQueryClient();
  const { data: cart, isLoading } = useQuery({ queryKey: ["cart"], queryFn: getCart });

  const removeMutation = useMutation({
    mutationFn: (productId: number) => removeFromCart(productId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });
  const qtyMutation = useMutation({
    mutationFn: ({ productId, qty }: { productId: number; qty: number }) => updateQty(productId, qty),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });

  if (isLoading) return <div className="max-w-4xl mx-auto px-4 py-16 text-center">Loading cart...</div>;

  const items = cart?.items ?? [];

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
        <Link to="/" className="bg-walmart-blue text-white font-bold px-8 py-3 rounded-full hover:bg-walmart-dark transition">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Cart</h1>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Items */}
        <div className="flex-1 space-y-4">
          {items.map(item => (
            <div key={item.productId} className="bg-white rounded-xl shadow-sm p-4 flex gap-4 items-center border border-gray-100">
              <div className="bg-blue-50 rounded-lg w-16 h-16 flex items-center justify-center text-2xl flex-shrink-0">📦</div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">{item.name}</p>
                <p className="text-walmart-blue font-bold">${(item.unitPriceCents / 100).toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => item.quantity > 1 && qtyMutation.mutate({ productId: item.productId, qty: item.quantity - 1 })}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center font-bold hover:bg-gray-100"
                >−</button>
                <span className="w-6 text-center font-semibold">{item.quantity}</span>
                <button
                  onClick={() => qtyMutation.mutate({ productId: item.productId, qty: item.quantity + 1 })}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center font-bold hover:bg-gray-100"
                >+</button>
              </div>
              <p className="font-bold text-gray-800 w-20 text-right">${(item.lineTotalCents / 100).toFixed(2)}</p>
              <button
                onClick={() => removeMutation.mutate(item.productId)}
                className="text-red-400 hover:text-red-600 transition"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:w-72">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 sticky top-24">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>
            <div className="flex justify-between text-gray-600 mb-2">
              <span>Subtotal ({cart?.itemCount} items)</span>
              <span>${((cart?.totalCents ?? 0) / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600 mb-2">
              <span>Shipping</span>
              <span className={(cart?.totalCents ?? 0) >= 5000 ? "text-green-600" : ""}>
                {(cart?.totalCents ?? 0) >= 5000 ? "FREE" : "$4.99"}
              </span>
            </div>
            <div className="border-t my-3" />
            <div className="flex justify-between font-bold text-lg mb-4">
              <span>Estimated Total</span>
              <span>${(((cart?.totalCents ?? 0) + ((cart?.totalCents ?? 0) >= 5000 ? 0 : 499)) / 100).toFixed(2)}</span>
            </div>
            <Link
              to="/checkout"
              className="block w-full bg-walmart-yellow text-walmart-blue font-bold py-3 rounded-full text-center hover:bg-yellow-400 transition"
            >
              Proceed to Checkout
            </Link>
            <p className="text-xs text-gray-400 mt-3 text-center">Use code SAVE10 for 10% off</p>
          </div>
        </div>
      </div>
    </div>
  );
}
