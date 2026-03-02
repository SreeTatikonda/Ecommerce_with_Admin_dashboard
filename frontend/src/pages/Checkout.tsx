import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { placeOrder } from "../api/client";

export default function Checkout() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    shippingName: "", shippingAddress1: "", shippingCity: "",
    shippingState: "", shippingPostalCode: "", couponCode: "",
  });
  const [error, setError] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: () => placeOrder(form),
    onSuccess: (data) => navigate(`/pay/${data.orderId}`),
    onError: (err: any) => setError(err.response?.data?.error ?? "Something went wrong."),
  });

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Checkout</h1>

      <div className="bg-white rounded-2xl shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">Shipping Information</h2>

        <input placeholder="Full Name" value={form.shippingName} onChange={set("shippingName")}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-walmart-blue" />
        <input placeholder="Address" value={form.shippingAddress1} onChange={set("shippingAddress1")}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-walmart-blue" />
        <div className="grid grid-cols-3 gap-3">
          <input placeholder="City" value={form.shippingCity} onChange={set("shippingCity")}
            className="col-span-1 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-walmart-blue" />
          <input placeholder="State" value={form.shippingState} onChange={set("shippingState")}
            className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-walmart-blue" />
          <input placeholder="ZIP Code" value={form.shippingPostalCode} onChange={set("shippingPostalCode")}
            className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-walmart-blue" />
        </div>

        <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 pt-2">Coupon Code</h2>
        <input placeholder="Enter coupon (try SAVE10)" value={form.couponCode} onChange={set("couponCode")}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-walmart-blue" />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          onClick={() => mutate()}
          disabled={isPending}
          className="w-full bg-walmart-blue text-white font-bold py-3 rounded-full hover:bg-walmart-dark transition disabled:opacity-50"
        >
          {isPending ? "Placing Order..." : "Place Order"}
        </button>
        <p className="text-xs text-gray-400 text-center">Payment processed on next step. No real charges.</p>
      </div>
    </div>
  );
}
