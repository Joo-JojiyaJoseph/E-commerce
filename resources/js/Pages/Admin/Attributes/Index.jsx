import AdminLayout from "@/Components/Admin/AdminLayout";
import { useState } from "react";
import { router } from "@inertiajs/react";
import { Plus, Pencil, Trash2, AlertTriangle } from "lucide-react";

export default function AttributeIndex({ attributes }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

    const [editingId, setEditingId] = useState(null);
    const [attributeName, setAttributeName] = useState("");

    const [deleteId, setDeleteId] = useState(null);

    /* ---------------- OPEN ADD ---------------- */

    const openAdd = () => {
        setEditingId(null);
        setAttributeName("");
        setModalOpen(true);
    };

    /* ---------------- OPEN EDIT ---------------- */

    const openEdit = (attr) => {
        setEditingId(attr.id);
        setAttributeName(attr.name);
        setModalOpen(true);
    };

    /* ---------------- SAVE ---------------- */

    const submit = () => {
        if (editingId) {
            router.post(
                `/admin/attributes/${editingId}`,
                {
                    _method: "put",
                    name: attributeName,
                },
                {
                    onSuccess: () => setModalOpen(false),
                },
            );
        } else {
            router.post(
                "/admin/attributes",
                {
                    name: attributeName,
                },
                {
                    onSuccess: () => setModalOpen(false),
                },
            );
        }
    };

    /* ---------------- DELETE ---------------- */

    const confirmDelete = (id) => {
        setDeleteId(id);
        setDeleteModal(true);
    };

    const deleteAttribute = () => {
        router.delete(`/admin/attributes/${deleteId}`, {
            onSuccess: () => setDeleteModal(false),
        });
    };

    return (
        <AdminLayout>
            {/* Header */}

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">
                        Product Attributes
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Manage attributes like Size, Color etc
                    </p>
                </div>

                <button
                    onClick={openAdd}
                    className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg"
                >
                    <Plus size={16} />
                    Add Attribute
                </button>
            </div>

            {/* Attribute Grid */}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {attributes.data.map((attr) => (
                    <div
                        key={attr.id}
                        className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-5"
                    >
                        {/* Header */}

                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-semibold text-lg text-slate-800">
                                {attr.name}
                            </h3>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => openEdit(attr)}
                                    className="text-blue-500 hover:text-blue-700"
                                >
                                    <Pencil size={16} />
                                </button>

                                <button
                                    onClick={() => confirmDelete(attr.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Attribute Values */}

                        <div className="flex flex-col gap-2">
                            {attr.values.length ? (
                                attr.values.map((value) => (
                                    <div
                                        key={value.id}
                                        className="bg-gray-50 rounded-md px-3 py-1 text-sm text-gray-700"
                                    >
                                        {value.value}
                                    </div>
                                ))
                            ) : (
                                <span className="text-gray-400 text-sm">
                                    No values added
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add / Edit Modal */}

            {modalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white w-[400px] rounded-xl shadow-xl p-6">
                        <h2 className="text-xl font-semibold mb-5">
                            {editingId ? "Edit Attribute" : "Add Attribute"}
                        </h2>

                        <input
                            value={attributeName}
                            onChange={(e) => setAttributeName(e.target.value)}
                            placeholder="Attribute Name"
                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500 outline-none"
                        />

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="px-4 py-2 border rounded-lg"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={submit}
                                className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2 rounded-lg"
                            >
                                {editingId ? "Update" : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}

            {deleteModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white w-[380px] rounded-xl shadow-xl p-6 text-center">
                        <AlertTriangle
                            className="mx-auto text-red-500 mb-3"
                            size={40}
                        />

                        <h3 className="text-lg font-semibold text-slate-800">
                            Delete Attribute?
                        </h3>

                        <p className="text-sm text-gray-500 mt-2">
                            This action cannot be undone.
                        </p>

                        <div className="flex justify-center gap-3 mt-6">
                            <button
                                onClick={() => setDeleteModal(false)}
                                className="px-4 py-2 border rounded-lg"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={deleteAttribute}
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
