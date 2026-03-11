import AdminLayout from "@/Components/Admin/AdminLayout";
import { useState } from "react";
import { router } from "@inertiajs/react";
import { Plus, Pencil, Trash2, AlertTriangle, X } from "lucide-react";

export default function AttributesPage({ attributes }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [editingData, setEditingData] = useState(null);
    const [formData, setFormData] = useState({ name: "", attribute_id: "", value: "" });
    const [deleteData, setDeleteData] = useState({ id: null, type: "" });

    /** ---------------- OPEN MODAL ---------------- */
    const openAdd = (type, attrId = null) => {
        setEditingData({ type, id: null });
        if (type === "attribute") {
            setFormData({ name: "" });
        } else {
            setFormData({ attribute_id: attrId, value: "" });
        }
        setModalOpen(true);
    };

    const openEdit = (item, type) => {
        setEditingData({ type, id: item.id });
        if (type === "attribute") {
            setFormData({ name: item.name });
        } else {
            setFormData({ attribute_id: item.attribute_id, value: item.value });
        }
        setModalOpen(true);
    };

    /** ---------------- SUBMIT ---------------- */
    const submit = () => {
        const { type, id } = editingData;
        if (type === "attribute") {
            if (id) {
                router.post(`/admin/attributes/${id}`, { _method: "put", name: formData.name }, { onSuccess: () => setModalOpen(false) });
            } else {
                router.post("/admin/attributes", { name: formData.name }, { onSuccess: () => setModalOpen(false) });
            }
        } else {
            if (id) {
                router.post(`/admin/attribute-values/${id}`, { _method: "put", ...formData }, { onSuccess: () => setModalOpen(false) });
            } else {
                router.post("/admin/attribute-values", formData, { onSuccess: () => setModalOpen(false) });
            }
        }
    };

    /** ---------------- DELETE ---------------- */
    const confirmDelete = (id, type) => {
        setDeleteData({ id, type });
        setDeleteModal(true);
    };

    const deleteItem = () => {
        const { id, type } = deleteData;
        const route = type === "attribute" ? `/admin/attributes/${id}` : `/admin/attribute-values/${id}`;
        router.delete(route, { onSuccess: () => setDeleteModal(false) });
    };

    return (
        <AdminLayout>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Product Attributes</h1>
                    <p className="text-gray-500 mt-1">Manage attributes and their values</p>
                </div>
                <button
                    onClick={() => openAdd("attribute")}
                    className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg"
                >
                    <Plus size={16} /> Add Attribute
                </button>
            </div>

            {/* Attributes with grouped values */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
                {attributes.data.map((attr) => (
                    <div key={attr.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-5">
                        {/* Attribute Header */}
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-semibold text-lg text-slate-800">{attr.name}</h3>
                            <div className="flex gap-2">
                                <button onClick={() => openEdit(attr, "attribute")} className="text-blue-500 hover:text-blue-700">
                                    <Pencil size={16} />
                                </button>
                                <button onClick={() => confirmDelete(attr.id, "attribute")} className="text-red-500 hover:text-red-700">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Attribute Values */}
                        <div className="flex flex-col gap-2 mb-3">
                            {attr.values.length ? (
                                attr.values.map((val) => (
                                    <div key={val.id} className="flex justify-between items-center bg-gray-50 rounded-md px-3 py-1 text-sm text-gray-700">
                                        <span>{val.value}</span>
                                        <div className="flex gap-2">
                                            <button onClick={() => openEdit(val, "value")} className="text-blue-500 hover:text-blue-700">
                                                <Pencil size={16} />
                                            </button>
                                            <button onClick={() => confirmDelete(val.id, "value")} className="text-red-500 hover:text-red-700">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <span className="text-gray-400 text-sm">No values added</span>
                            )}
                        </div>

                        {/* Add Value Button */}
                        <button
                            onClick={() => openAdd("value", attr.id)}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm"
                        >
                            <Plus size={14} /> Add Value
                        </button>
                    </div>
                ))}
            </div>

            {/* Modal for Add/Edit */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white w-[400px] rounded-xl shadow-xl p-6">
                        <button onClick={() => setModalOpen(false)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
                            <X size={20} />
                        </button>
                        <h2 className="text-xl font-semibold mb-5">
                            {editingData?.id ? "Edit" : "Add"} {editingData?.type === "attribute" ? "Attribute" : "Attribute Value"}
                        </h2>

                        <div className="space-y-4">
                            {editingData?.type === "attribute" ? (
                                <input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Attribute Name"
                                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500 outline-none"
                                />
                            ) : (
                                <>
                                    <select
                                        value={formData.attribute_id}
                                        onChange={(e) => setFormData({ ...formData, attribute_id: e.target.value })}
                                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                                    >
                                        <option value="">Select Attribute</option>
                                        {attributes.data.map((attr) => (
                                            <option key={attr.id} value={attr.id}>{attr.name}</option>
                                        ))}
                                    </select>
                                    <input
                                        value={formData.value}
                                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                        placeholder="Value Name"
                                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                                    />
                                </>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                            <button onClick={submit} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg">
                                {editingData?.id ? "Update" : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {deleteModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white w-[380px] rounded-xl shadow-xl p-6 text-center">
                        <AlertTriangle className="mx-auto text-red-500 mb-3" size={40} />
                        <h3 className="text-lg font-semibold text-slate-800">Delete {deleteData.type === "attribute" ? "Attribute" : "Value"}?</h3>
                        <p className="text-sm text-gray-500 mt-2">This action cannot be undone.</p>
                        <div className="flex justify-center gap-3 mt-6">
                            <button onClick={() => setDeleteModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                            <button onClick={deleteItem} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
