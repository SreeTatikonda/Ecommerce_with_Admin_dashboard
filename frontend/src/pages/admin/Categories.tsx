import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory, type Category } from "../../api/client";
import AdminLayout from "./AdminLayout";
import { Plus, Pencil, Trash2, X } from "lucide-react";

export default function AdminCategories() {
  const qc = useQueryClient();
  const { data: categories } = useQuery({ queryKey: ["admin-categories"], queryFn: adminCategories });
  const [modal, setModal] = useState<null | { mode: "create" | "edit"; cat?: Category }>(null);
  const [form, setForm] = useState({ name: "", slug: "" });

  const openCreate = () => { setForm({ name: "", slug: "" }); setModal({ mode: "create" }); };
  const openEdit = (c: Category) => { setForm({ name: c.name, slug: c.slug }); setModal({ mode: "edit", cat: c }); };

  const saveMutation = useMutation({
    mutationFn: () => modal?.mode === "create" ? adminCreateCategory(form) : adminUpdateCategory(modal!.cat!.id, form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-categories"] }); setModal(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminDeleteCategory(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-categories"] }),
  });

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
        <button onClick={openCreate} className="flex items-center gap-2 bg-walmart-blue text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-walmart-dark transition">
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Slug</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {categories?.map(c => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{c.name}</td>
                <td className="px-4 py-3 text-gray-500 font-mono text-xs">{c.slug}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(c)} className="text-gray-500 hover:text-walmart-blue mr-3"><Pencil size={15} /></button>
                  <button onClick={() => { if (confirm("Delete this category?")) deleteMutation.mutate(c.id); }} className="text-gray-500 hover:text-red-500"><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{modal.mode === "create" ? "Add Category" : "Edit Category"}</h2>
              <button onClick={() => setModal(null)}><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <input placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" />
              <input placeholder="Slug (e.g. home-decor)" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" />
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
