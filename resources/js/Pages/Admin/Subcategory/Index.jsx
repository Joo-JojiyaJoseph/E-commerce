import AdminLayout from "@/Components/Admin/AdminLayout";
import { useState } from "react";
import { router } from "@inertiajs/react";
import { Pencil, Trash2, Plus, Search } from "lucide-react";

export default function Index({ types, allTypes, filters }) {

    const [search, setSearch] = useState(filters.search || "");

    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

    const [editingId, setEditingId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    const [typeId, setTypeId] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [name, setName] = useState("");

    const selectedType = allTypes.find(
        (t) => Number(t.id) === Number(typeId)
    );

    /* SEARCH */

    function searchData() {
        router.get(
            route("admin.subcategory.index"),
            { search },
            { preserveState: true }
        );
    }

    function clearSearch() {
        setSearch("");
        router.get(route("admin.subcategory.index"));
    }

    /* OPEN ADD */

    function openAdd() {
        setEditingId(null);
        setName("");
        setTypeId("");
        setCategoryId("");
        setModalOpen(true);
    }

    /* OPEN EDIT */

    function openEdit(sub) {

        setEditingId(sub.id);
        setName(sub.name);
        setCategoryId(sub.category_id);

        const foundType = allTypes.find(type =>
            type.categories.some(cat => cat.id === sub.category_id)
        );

        if (foundType) {
            setTypeId(foundType.id);
        }

        setModalOpen(true);
    }

    /* SUBMIT */

    function submit(e) {

        e.preventDefault();

        const data = {
            name: name,
            category_id: categoryId,
        };

        if (editingId) {

            router.put(route("admin.subcategory.update", editingId), data, {
                onSuccess: () => setModalOpen(false),
            });

        } else {

            router.post(route("admin.subcategory.store"), data, {
                onSuccess: () => setModalOpen(false),
            });

        }
    }

    /* DELETE */

    function confirmDelete(id) {
        setDeleteId(id);
        setDeleteModal(true);
    }

    function deleteSub() {
        router.delete(route("admin.subcategory.destroy", deleteId), {
            onSuccess: () => setDeleteModal(false),
        });
    }

    return (
        <AdminLayout>

            <div className="p-6 space-y-6">

                {/* HEADER */}

                <div className="flex justify-between items-center">

                    <div className="flex gap-2">

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search Type / Category / Subcategory"
                            className="border px-4 py-2 rounded-lg w-80"
                        />

                        <button
                            onClick={searchData}
                            className="bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                        >
                            <Search size={16} />
                            Search
                        </button>

                        <button
                            onClick={clearSearch}
                            className="bg-gray-200 px-4 py-2 rounded-lg"
                        >
                            Clear
                        </button>

                    </div>

                    <button
                        onClick={openAdd}
                        className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-lg"
                    >
                        <Plus size={16} />
                        Add Subcategory
                    </button>

                </div>

                {/* DATA */}

                <div className="space-y-8">

                    {types.data.map((type) => (

                        <div
                            key={type.id}
                            className="bg-white shadow rounded-xl p-6"
                        >

                            <h2 className="text-xl font-bold border-b pb-3 mb-5">
                                {type.name}
                            </h2>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                                {type.categories.map((category) => (

                                    category.subcategories.length > 0 && (

                                        <div
                                            key={category.id}
                                            className="border rounded-xl p-4"
                                        >

                                            <div className="flex justify-between mb-3">

                                                <h3 className="font-semibold">
                                                    {category.name}
                                                </h3>

                                                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                    {category.subcategories.length}
                                                </span>

                                            </div>

                                            {category.subcategories.map((sub) => (

                                                <div
                                                    key={sub.id}
                                                    className="flex justify-between border rounded-lg px-3 py-2 mb-2"
                                                >

                                                    <span>{sub.name}</span>

                                                    <div className="flex gap-2">

                                                        <button
                                                            onClick={() => openEdit(sub)}
                                                            className="text-blue-500"
                                                        >
                                                            <Pencil size={16} />
                                                        </button>

                                                        <button
                                                            onClick={() => confirmDelete(sub.id)}
                                                            className="text-red-500"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>

                                                    </div>

                                                </div>

                                            ))}

                                        </div>

                                    )

                                ))}

                            </div>

                        </div>

                    ))}

                </div>

                {/* PAGINATION */}

                <div className="flex gap-2">

                    {types.links.map((link, key) => (

                        <button
                            key={key}
                            disabled={!link.url}
                            onClick={() => router.visit(link.url)}
                            className={`px-3 py-1 border rounded ${
                                link.active ? "bg-violet-600 text-white" : ""
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />

                    ))}

                </div>

            </div>

            {/* ADD / EDIT MODAL */}

            {modalOpen && (

                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

                    <div className="bg-white w-[450px] p-6 rounded-xl">

                        <h2 className="text-lg font-bold mb-4">
                            {editingId ? "Edit Subcategory" : "Add Subcategory"}
                        </h2>

                        <form onSubmit={submit} className="space-y-4">

                            {/* TYPE */}

                            <select
                                value={typeId}
                                onChange={(e) => {
                                    setTypeId(e.target.value);
                                    setCategoryId("");
                                }}
                                className="w-full border p-2 rounded"
                                required
                            >

                                <option value="">Select Type</option>

                                {allTypes.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}

                            </select>

                            {/* CATEGORY */}

                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="w-full border p-2 rounded"
                                required
                            >

                                <option value="">Select Category</option>

                                {selectedType?.categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}

                            </select>

                            {/* NAME */}

                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Subcategory name"
                                className="w-full border p-2 rounded"
                                required
                            />

                            <div className="flex justify-end gap-3">

                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="border px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="bg-violet-600 text-white px-4 py-2 rounded"
                                >
                                    Save
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

            {/* DELETE MODAL */}

            {deleteModal && (

                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

                    <div className="bg-white w-[350px] p-6 rounded-xl">

                        <h2 className="text-lg font-bold mb-4">
                            Delete Subcategory
                        </h2>

                        <p className="text-gray-600">
                            Are you sure you want to delete this subcategory?
                        </p>

                        <div className="flex justify-end gap-3 mt-6">

                            <button
                                onClick={() => setDeleteModal(false)}
                                className="border px-4 py-2 rounded"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={deleteSub}
                                className="bg-red-600 text-white px-4 py-2 rounded"
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
