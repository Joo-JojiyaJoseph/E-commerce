import AdminLayout from "@/Components/Admin/AdminLayout";
import { router } from "@inertiajs/react";
import { useState } from "react";
import { Pencil, Trash2, Plus, Search } from "lucide-react";

export default function Index({ types, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    /* SEARCH */

    function searchData() {
        router.get(
            route("admin.products.index"),
            { search },
            { preserveState: true },
        );
    }

    function clearSearch() {
        setSearch("");
        router.get(route("admin.products.index"));
    }

    /* DELETE */

    function confirmDelete(id) {
        setDeleteId(id);
        setDeleteModal(true);
    }

    function deleteProduct() {
        router.delete(route("admin.products.destroy", deleteId), {
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
                            placeholder="Search product"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border px-4 py-2 rounded-lg w-80"
                        />

                        <button
                            onClick={searchData}
                            className="bg-gray-800 text-white px-4 py-2 rounded-lg flex gap-2 items-center"
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
                        onClick={() =>
                            router.visit(route("admin.products.create"))
                        }
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                        <Plus size={16} />
                        Add Product
                    </button>
                </div>

                {/* PRODUCTS */}

                <div className="space-y-8">
                    {types.map((type) => (
                        <div
                            key={type.id}
                            className="bg-white shadow rounded-xl p-6"
                        >
                            <h2 className="text-xl font-bold border-b pb-3 mb-6">
                                {type.name}
                            </h2>

                            {type.categories.map((category) => (
                                <div key={category.id} className="mb-8">
                                    <h3 className="font-semibold mb-4">
                                        {category.name}
                                    </h3>

                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {category.subcategories.map(
                                            (sub) =>
                                                sub.products?.length > 0 && (
                                                    <div
                                                        key={sub.id}
                                                        className="border rounded-xl p-4"
                                                    >
                                                        <h4 className="font-semibold mb-3 text-gray-700">
                                                            {sub.name}
                                                        </h4>

                                                        {sub.products.map(
                                                            (product) => (
                                                                <div
                                                                    key={
                                                                        product.id
                                                                    }
                                                                    className="border rounded-lg p-3 mb-3 flex justify-between items-center"
                                                                >
                                                                    <div>
                                                                        <div className="font-medium">
                                                                            {
                                                                                product.name
                                                                            }
                                                                        </div>

                                                                        <div className="text-xs text-gray-500">
                                                                            {
                                                                                product.slug
                                                                            }
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex gap-2">
                                                                        <button
                                                                            onClick={() =>
                                                                                router.visit(
                                                                                    route(
                                                                                        "admin.products.edit",
                                                                                        product.id,
                                                                                    ),
                                                                                )
                                                                            }
                                                                            className="text-blue-500"
                                                                        >
                                                                            <Pencil
                                                                                size={
                                                                                    16
                                                                                }
                                                                            />
                                                                        </button>

                                                                        <button
                                                                            onClick={() =>
                                                                                confirmDelete(
                                                                                    product.id,
                                                                                )
                                                                            }
                                                                            className="text-red-500"
                                                                        >
                                                                            <Trash2
                                                                                size={
                                                                                    16
                                                                                }
                                                                            />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                ),
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* DELETE MODAL */}

            {deleteModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-white w-[350px] p-6 rounded-xl">
                        <h2 className="text-lg font-bold mb-4">
                            Delete Product
                        </h2>

                        <p className="text-gray-600">
                            Are you sure you want to delete this product?
                        </p>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setDeleteModal(false)}
                                className="border px-4 py-2 rounded"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={deleteProduct}
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
