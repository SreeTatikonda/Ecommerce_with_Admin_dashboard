import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getOrder } from "../api/client";
import { ArrowLeft } from "lucide-react";

const statusLabel: Record<number, string> = {
  0: "Pending Payment", 1: "Paid", 2: "Processing", 3: "Shipped", 4: "Cancelled"
};
const statusColor: Record<number, string> = {
  0: "bg-yellow-100 text-yellow-800", 1: "bg-green-100 text-green-800",
  2: "bg-blue-100 text-blue-800", 3: "bg-purple-100 text-purple-800", 4: "bg-red-100 text-red-800",
};

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useQuery({ queryKey: ["order", id], queryFn: () => getOrder(Number(id)) });

  if (isLoading) return <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-500">Loading...</div>;
  if (!order) return <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-500">Order not found.</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to="/orders" className="flex items-center gap-2 text-walmart-blue hover:underline mb-6 text-sm">
        <ArrowLeft size={16} /> Back to Orders
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Order #{order.id}</h1>
        <span className={`text-sm font-semibold px-4 py-1 rounded-full ${statusColor[order.status]}`}>
          {statusLabel[order.status]}
        </span>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 mb-4">
        <h2 className="font-semibold text-gray-700 mb-3">Items</h2>
        <div className="divide-y">
          {order.items?.map((item, i) => (
            <div key={i} className="py-3 flex justify-between text-sm">
              <span className="text-gray-800">{item.productName} × {item.quantity}</span>
              <span className="font-semibold">${(item.lineTotalCents / 100).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="border-t pt-3 mt-1 space-y-1 text-sm">
          <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>${(order.subtotalCents / 100).toFixed(2)}</span></div>
          {order.discountCents > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>−${(order.discountCents / 100).toFixed(2)}</span></div>}
          <div className="flex justify-between text-gray-600"><span>Tax</span><span>${(order.taxCents / 100).toFixed(2)}</span></div>
          <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{order.shippingCents === 0 ? "FREE" : `$${(order.shippingCents / 100).toFixed(2)}`}</span></div>
          <div className="flex justify-between font-bold text-lg pt-1"><span>Total</span><span>${(order.totalCents / 100).toFixed(2)}</span></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="font-semibold text-gray-700 mb-3">Shipping Address</h2>
        <p className="text-gray-700">{order.shippingName}</p>
        <p className="text-gray-600 text-sm">{order.shippingAddress1}</p>
        <p className="text-gray-600 text-sm">{order.shippingCity}, {order.shippingState} {order.shippingPostalCode}</p>
        {order.payment && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-500">Payment: <span className="font-semibold text-gray-700">{order.payment.provider}</span></p>
            <p className="text-xs text-gray-400">{order.payment.providerReference}</p>
          </div>
        )}
      </div>
    </div>
  );
}
