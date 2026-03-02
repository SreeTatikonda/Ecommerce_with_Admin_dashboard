import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { adminOrders, adminUpdateOrderStatus } from "../../api/client";
import AdminLayout from "./AdminLayout";

const statusLabel: Record<number, string> = {
  0: "Pending Payment", 1: "Paid", 2: "Processing", 3: "Shipped", 4: "Cancelled"
};
const statusColor: Record<number, string> = {
  0: "bg-yellow-100 text-yellow-800", 1: "bg-green-100 text-green-800",
  2: "bg-blue-100 text-blue-800", 3: "bg-purple-100 text-purple-800", 4: "bg-red-100 text-red-800",
};

export default function AdminOrders() {
  const qc = useQueryClient();
  const { data: orders } = useQuery({ queryKey: ["admin-orders"], queryFn: adminOrders });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: number }) => adminUpdateOrderStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-orders"] }),
  });

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Orders</h1>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Order</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Update</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders?.map(o => (
              <tr key={o.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">
                  <Link to={`/admin/orders/${o.id}`} className="text-walmart-blue hover:underline">#{o.id}</Link>
                </td>
                <td className="px-4 py-3 text-gray-500">{new Date(o.createdUtc).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-gray-500 font-mono text-xs truncate max-w-[120px]">{(o as any).userId}</td>
                <td className="px-4 py-3 font-bold">${(o.totalCents / 100).toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusColor[o.status]}`}>{statusLabel[o.status]}</span>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={o.status}
                    onChange={e => statusMutation.mutate({ id: o.id, status: Number(e.target.value) })}
                    className="border rounded-lg px-2 py-1 text-xs"
                  >
                    {Object.entries(statusLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
