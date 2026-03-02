import { useQuery } from "@tanstack/react-query";
import { adminDashboard } from "../../api/client";
import AdminLayout from "./AdminLayout";
import { Package, ShoppingBag, DollarSign, Clock } from "lucide-react";

const statusLabel: Record<number, string> = {
  0: "Pending Payment", 1: "Paid", 2: "Processing", 3: "Shipped", 4: "Cancelled"
};
const statusColor: Record<number, string> = {
  0: "bg-yellow-100 text-yellow-800", 1: "bg-green-100 text-green-800",
  2: "bg-blue-100 text-blue-800", 3: "bg-purple-100 text-purple-800", 4: "bg-red-100 text-red-800",
};

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({ queryKey: ["admin-dashboard"], queryFn: adminDashboard });

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {isLoading ? (
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-xl h-28 animate-pulse" />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <StatCard icon={<Package className="text-blue-500" />} label="Total Products" value={data?.productCount} color="blue" />
            <StatCard icon={<ShoppingBag className="text-green-500" />} label="Total Orders" value={data?.orderCount} color="green" />
            <StatCard icon={<DollarSign className="text-walmart-yellow" />} label="Revenue" value={`$${((data?.revenueCents ?? 0) / 100).toFixed(2)}`} color="yellow" />
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={18} className="text-gray-500" />
              <h2 className="font-semibold text-gray-700">Recent Orders</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-2">Order</th>
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {data?.recentOrders?.map((o: any) => (
                  <tr key={o.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-2 font-medium">#{o.id}</td>
                    <td className="py-2 text-gray-500">{new Date(o.createdUtc).toLocaleDateString()}</td>
                    <td className="py-2"><span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusColor[o.status]}`}>{statusLabel[o.status]}</span></td>
                    <td className="py-2 font-bold text-right">${(o.totalCents / 100).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </AdminLayout>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: any; color: string }) {
  const bg: Record<string, string> = { blue: "bg-blue-50", green: "bg-green-50", yellow: "bg-yellow-50" };
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
      <div className={`${bg[color]} p-3 rounded-xl`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value ?? "—"}</p>
      </div>
    </div>
  );
}
