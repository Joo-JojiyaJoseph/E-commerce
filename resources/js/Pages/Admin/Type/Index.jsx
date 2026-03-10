import AdminLayout from "@/Components/Admin/AdminLayout";
import { useState } from "react";
import { router } from "@inertiajs/react";
import { Plus, Pencil, Trash2, ImagePlus, AlertTriangle } from "lucide-react";

export default function Index({ types }) {

    const [open, setOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

    const [editingId, setEditingId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    const [name, setName] = useState("");
    const [image, setImage] = useState(null);

    /* ---------------- OPEN CREATE ---------------- */

    const openCreate = () => {
        setEditingId(null);
        setName("");
        setImage(null);
        setOpen(true);
    };

    /* ---------------- OPEN EDIT ---------------- */

    const openEdit = (type) => {
        setEditingId(type.id);
        setName(type.name);
        setImage(type.image);
        setOpen(true);
    };

    /* ---------------- SAVE ---------------- */

    const submit = () => {

        if (editingId) {

            router.post(`/admin/types/${editingId}`, {
                _method: "put",
                name,
                image
            }, {
                forceFormData: true,
                onSuccess: () => setOpen(false)
            });

        } else {

            router.post("/admin/types", {
                name,
                image
            }, {
                forceFormData: true,
                onSuccess: () => setOpen(false)
            });

        }

    };

    /* ---------------- DELETE ---------------- */

    const confirmDelete = (id) => {
        setDeleteId(id);
        setDeleteModal(true);
    };

    const deleteType = () => {

        router.delete(`/admin/types/${deleteId}`, {
            onSuccess: () => setDeleteModal(false)
        });

    };

    return (
        <AdminLayout>

            {/* Header */}

            <div className="flex justify-between items-center mb-8">

                <div>
                    <h1 className="text-3xl font-bold text-slate-800">
                        Product Types
                    </h1>
                    <p className="text-slate-500 text-sm">
                        Manage product type categories
                    </p>
                </div>

                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-5 py-2 rounded-lg shadow"
                >
                    <Plus size={18}/>
                    Add Type
                </button>

            </div>

            {/* Cards */}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">

                {/* Add Card */}

                <div
                    onClick={openCreate}
                    className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-violet-500 hover:bg-violet-50 transition"
                >
                    <Plus className="text-violet-600 mb-2"/>
                    <p className="text-sm text-slate-600">
                        Add New Type
                    </p>
                </div>

                {/* Type Cards */}

                {types.map((type) => (

                    <div
                        key={type.id}
                        className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition p-4"
                    >

                        {/* Image */}

                        <div className="h-40 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center">

                            {type.image ? (

                                <img
                                    src={`/storage/${type.image}`}
                                    className="w-full h-full object-cover"
                                />

                            ) : (

                                <ImagePlus className="text-slate-400"/>

                            )}

                        </div>

                        {/* Name */}

                        <h3 className="mt-4 font-semibold text-slate-800">
                            {type.name}
                        </h3>

                        {/* Actions */}

                        <div className="flex justify-between mt-4">

                            <button
                                onClick={() => openEdit(type)}
                                className="flex items-center gap-1 text-sm text-violet-600 hover:text-violet-800"
                            >
                                <Pencil size={16}/>
                                Edit
                            </button>

                            <button
                                onClick={() => confirmDelete(type.id)}
                                className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700"
                            >
                                <Trash2 size={16}/>
                                Delete
                            </button>

                        </div>

                    </div>

                ))}

            </div>

            {/* Add / Edit Modal */}

            {open && (

                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

                    <div className="bg-white w-[420px] rounded-xl shadow-xl p-6">

                        <h2 className="text-xl font-semibold mb-5">
                            {editingId ? "Edit Type" : "Add Type"}
                        </h2>

                        <div className="space-y-4">

                            <input
                                value={name}
                                onChange={(e)=>setName(e.target.value)}
                                placeholder="Type Name"
                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500 outline-none"
                            />

                            <input
                                type="file"
                                onChange={(e)=>setImage(e.target.files[0])}
                                className="w-full"
                            />

                            {image && (

                                <img
                                    src={typeof image === 'object' ? URL.createObjectURL(image) : `/storage/${image}`}
                                    className="w-20 h-20 rounded-lg object-cover"
                                />

                            )}

                        </div>

                        <div className="flex justify-end gap-3 mt-6">

                            <button
                                onClick={()=>setOpen(false)}
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

            {/* Delete Confirmation Modal */}

            {deleteModal && (

                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

                    <div className="bg-white w-[380px] rounded-xl shadow-xl p-6 text-center">

                        <AlertTriangle
                            className="mx-auto text-red-500 mb-3"
                            size={40}
                        />

                        <h3 className="text-lg font-semibold text-slate-800">
                            Delete Type?
                        </h3>

                        <p className="text-sm text-slate-500 mt-2">
                            This action cannot be undone.
                        </p>

                        <div className="flex justify-center gap-3 mt-6">
                            <button onClick={()=>setDeleteModal(false)} className="px-4 py-2 border rounded-lg">Cancel
                            </button>

                            <button onClick={deleteType} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </AdminLayout>
    );
}
