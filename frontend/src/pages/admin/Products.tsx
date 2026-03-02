import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminProducts, adminCategories, adminCreateProduct, adminUpdateProduct, adminDeleteProduct, type Product } from "../../api/client";
import AdminLayout from "./AdminLayout";
import { Plus, Pencil, Trash2, X } from "lucide-react";

type ProductForm = { name: string; slug: string; description: string; priceCents: number; stock: number; isActive: boolean; categoryId: number };
const empty: ProductForm = { name: "", slug: "", description: "", priceCents: 0, stock: 0, isActive: true, categoryId: 0 };

export default function AdminProducts() {
  const qc = useQueryClient();
  const { data: products } = useQuery({ queryKey: ["admin-products"], queryFn: adminProducts });
  const { data: categories } = useQuery({ queryKey: ["admin-categories"], queryFn: adminCategories });
  const [modal, setModal] = useState<null | { mode: "create" | "edit"; product?: Product }>(null);
  const [form, setForm] = useState<ProductForm>(empty);

  const openCreate = () => { setForm(empty); setModal({ mode: "create" }); };
  const openEdit = (p: Product) => {
    setForm({ name: p.name, slug: p.slug, description: p.description ?? "", priceCents: p.priceCents, stock: p.stock, isActive: (p as any).isActive ?? true, categoryId: p.category.id });
    setModal({ mode: "edit", product: p });
  };

  const saveMutation = useMutation({
    mutationFn: () => modal?.mode === "create" ? adminCreateProduct(form) : adminUpdateProduct(modal!.product!.id, form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-products"] }); setModal(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminDeleteProduct(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-products"] }),
  });

  const set = (field: keyof ProductForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const val = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setForm(f => ({ ...f, [field]: val }));
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <button onClick={openCreate} className="flex items-center gap-2 bg-walmart-blue text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-walmart-dark transition">
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Stock</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products?.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{p.name}</td>
                <td className="px-4 py-3 text-gray-500">{p.category?.name}</td>
                <td className="px-4 py-3 font-semibold">${(p.priceCents / 100).toFixed(2)}</td>
                <td className="px-4 py-3">{p.stock}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${(p as any).isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {(p as any).isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(p)} className="text-gray-500 hover:text-walmart-blue mr-3"><Pencil size={15} /></button>
                  <button onClick={() => { if (confirm("Delete this product?")) deleteMutation.mutate(p.id); }} className="text-gray-500 hover:text-red-500"><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{modal.mode === "create" ? "Add Product" : "Edit Product"}</h2>
              <button onClick={() => setModal(null)}><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <input placeholder="Name" value={form.name} onChange={set("name")} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <input placeholder="Slug (e.g. my-product)" value={form.slug} onChange={set("slug")} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <textarea placeholder="Description" value={form.description} onChange={set("description")} className="w-full border rounded-lg px-3 py-2 text-sm h-20" />
              <div className="grid grid-cols-2 gap-3">
                <input type="number" placeholder="Price (cents)" value={form.priceCents} onChange={set("priceCents")} className="border rounded-lg px-3 py-2 text-sm" />
                <input type="number" placeholder="Stock" value={form.stock} onChange={set("stock")} className="border rounded-lg px-3 py-2 text-sm" />
              </div>
              <select value={form.categoryId} onChange={set("categoryId")} className="w-full border rounded-lg px-3 py-2 text-sm">
                <option value={0}>Select Category</option>
                {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.isActive} onChange={set("isActive")} /> Active
              </label>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setModal(null)} className="flex-1 border rounded-lg py-2 text-sm font-semibold hover:bg-gray-50">Cancel</button>
              <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="flex-1 bg-walmart-blue text-white rounded-lg py-2 text-sm font-semibold hover:bg-walmart-dark disabled:opacity-50">
                {saveMutation.isPending ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
