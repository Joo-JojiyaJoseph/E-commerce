import AdminLayout from "@/Components/Admin/AdminLayout";
import { useState } from "react";
import { router } from "@inertiajs/react";
import { Plus, Pencil, Trash2, AlertTriangle, ImagePlus } from "lucide-react";

export default function CategoryIndex({ types }) {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryTypeId, setCategoryTypeId] = useState(null);

  /* ---------------- OPEN ADD CATEGORY ---------------- */
  const openAddCategory = (typeId) => {
    setEditingId(null);
    setCategoryTypeId(typeId);
    setCategoryName("");
    setCategoryOpen(true);
  };

  /* ---------------- OPEN EDIT CATEGORY ---------------- */
  const openEditCategory = (category, typeId) => {
    setEditingId(category.id);
    setCategoryTypeId(typeId);
    setCategoryName(category.name);
    setCategoryOpen(true);
  };

  /* ---------------- SAVE CATEGORY ---------------- */
  const submitCategory = () => {
    if (editingId) {
      router.post(
        `/admin/categories/${editingId}`,
        { _method: "put", name: categoryName },
        { onSuccess: () => setCategoryOpen(false) }
      );
    } else {
      router.post(
        "/admin/categories",
        { type_id: categoryTypeId, name: categoryName },
        { onSuccess: () => setCategoryOpen(false) }
      );
    }
  };

  /* ---------------- DELETE CATEGORY ---------------- */
  const confirmDelete = (id) => {
    setDeleteId(id);
    setDeleteModal(true);
  };

  const deleteCategory = () => {
    router.delete(`/admin/categories/${deleteId}`, {
      onSuccess: () => setDeleteModal(false),
    });
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Product Categories</h1>
          <p className="text-gray-500 mt-1">Manage categories under each type</p>
        </div>
      </div>

      {/* Types Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {types.map((type) => (
          <div
            key={type.id}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-5 flex flex-col"
          >
            {/* Type Image */}
            <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center mb-3">
              {type.image ? (
                <img src={`/storage/${type.image}`} className="w-full h-full object-cover" />
              ) : (
                <ImagePlus className="text-gray-400" size={36} />
              )}
            </div>

            {/* Type Header */}
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-lg text-slate-800">{type.name}</h3>
              <button
                onClick={() => openAddCategory(type.id)}
                className="flex items-center gap-1 text-violet-600 hover:text-violet-800 text-sm font-medium border border-violet-600 hover:border-violet-800 px-3 py-1 rounded-lg transition"
              >
                <Plus size={14} /> Add Category
              </button>
            </div>

            {/* Categories List */}
            <div className="mt-2 flex flex-col gap-2">
              {type.categories.length ? (
                type.categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex justify-between items-center bg-gray-50 rounded-md px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 transition"
                  >
                    <span>{cat.name}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditCategory(cat, type.id)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => confirmDelete(cat.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <span className="text-gray-400 text-sm">No categories added</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Category Modal */}
      {categoryOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-[400px] rounded-xl shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-5">
              {editingId ? "Edit Category" : "Add Category"}
            </h2>
            <input
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Category Name"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500 outline-none"
            />
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setCategoryOpen(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={submitCategory}
                className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2 rounded-lg"
              >
                {editingId ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-[380px] rounded-xl shadow-xl p-6 text-center">
            <AlertTriangle className="mx-auto text-red-500 mb-3" size={40} />
            <h3 className="text-lg font-semibold text-slate-800">Delete Category?</h3>
            <p className="text-sm text-gray-500 mt-2">This action cannot be undone.</p>
            <div className="flex justify-center gap-3 mt-6">
              <button
                onClick={() => setDeleteModal(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={deleteCategory}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
