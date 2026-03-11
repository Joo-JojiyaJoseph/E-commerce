import AdminLayout from "@/Components/Admin/AdminLayout";
import { useState } from "react";
import { router } from "@inertiajs/react";
import { Plus, Pencil, Trash2, X } from "lucide-react";

export default function AttributeValuesIndex({ values, attributes }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [formData, setFormData] = useState({
        attribute_id: "",
        value: "",
    });

    // Open modal for Add or Edit
    const openModal = (value = null) => {
        setEditData(value);
        if (value) {
            setFormData({
                attribute_id: value.attribute_id,
                value: value.value,
            });
        } else {
            setFormData({ attribute_id: "", value: "" });
        }
        setModalOpen(true);
    };

    // Close modal
    const closeModal = () => {
        setModalOpen(false);
        setEditData(null);
    };

    // Handle form submit
    const handleSubmit = (e) => {
        e.preventDefault();
        if (editData) {
            router.post(route("admin.attribute-values.update", editData.id), {
                ...formData,
                _method: "put",
            });
        } else {
            router.post(route("admin.attribute-values.store"), formData);
        }
        closeModal();
    };

    // Handle delete
    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this value?")) {
            router.delete(route("admin.attribute-values.destroy", id));
        }
    };

    return (
        <AdminLayout title="Attribute Values">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Attribute Values</h1>
                    <button
                        onClick={() => openModal()}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        <Plus size={16} /> Add Value
                    </button>
                </div>

                {/* Values List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {values.data.map((val) => (
                        <div
                            key={val.id}
                            className="border rounded-lg p-4 shadow-sm flex flex-col justify-between"
                        >
                            <div>
                                <h2 className="font-semibold">{val.value}</h2>
                                <p className="text-sm text-gray-500">
                                    {val.attribute.name}
                                </p>
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    onClick={() => openModal(val)}
                                    className="text-blue-600 hover:text-blue-800"
                                    title="Edit"
                                >
                                    <Pencil size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(val.id)}
                                    className="text-red-600 hover:text-red-800"
                                    title="Delete"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="mt-6">
                    {values.links &&
                        values.links.map((link, index) => (
                            <button
                                key={index}
                                disabled={!link.url}
                                onClick={() =>
                                    link.url &&
                                    router.get(
                                        link.url.replace(location.origin, ""),
                                    )
                                }
                                className={`px-3 py-1 border rounded mx-1 ${link.active ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                </div>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 relative">
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                        >
                            <X size={20} />
                        </button>
                        <h2 className="text-xl font-semibold mb-4">
                            {editData ? "Edit Value" : "Add Value"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Attribute
                                </label>
                                <select
                                    className="w-full border rounded px-2 py-1"
                                    value={formData.attribute_id}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            attribute_id: e.target.value,
                                        })
                                    }
                                    required
                                >
                                    <option value="">Select Attribute</option>
                                    {attributes.map((attr) => (
                                        <option key={attr.id} value={attr.id}>
                                            {attr.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Value
                                </label>
                                <input
                                    type="text"
                                    className="w-full border rounded px-2 py-1"
                                    value={formData.value}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            value: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                            >
                                {editData ? "Update" : "Add"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
