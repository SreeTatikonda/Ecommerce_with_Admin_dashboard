import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getOrders } from "../api/client";
import { Package } from "lucide-react";

const statusLabel: Record<number, string> = {
  0: "Pending Payment", 1: "Paid", 2: "Processing", 3: "Shipped", 4: "Cancelled"
};
const statusColor: Record<number, string> = {
  0: "bg-yellow-100 text-yellow-800", 1: "bg-green-100 text-green-800",
  2: "bg-blue-100 text-blue-800", 3: "bg-purple-100 text-purple-800",
  4: "bg-red-100 text-red-800",
};

export default function OrdersList() {
  const { data: orders, isLoading } = useQuery({ queryKey: ["orders"], queryFn: getOrders });

  if (isLoading) return <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-500">Loading orders...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Orders</h1>
      {!orders?.length ? (
        <div className="text-center py-16">
          <Package size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
          <Link to="/" className="bg-walmart-blue text-white font-bold px-8 py-3 rounded-full hover:bg-walmart-dark transition">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <Link key={order.id} to={`/orders/${order.id}`}
              className="bg-white rounded-xl shadow-sm p-5 flex items-center justify-between border border-gray-100 hover:border-walmart-blue transition group">
              <div>
                <p className="font-bold text-gray-800 group-hover:text-walmart-blue">Order #{order.id}</p>
                <p className="text-sm text-gray-500">{new Date(order.createdUtc).toLocaleDateString()}</p>
                <p className="text-sm text-gray-600">{order.itemCount} item{order.itemCount !== 1 ? "s" : ""}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-gray-900">${(order.totalCents / 100).toFixed(2)}</p>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor[order.status]}`}>
                  {statusLabel[order.status]}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
