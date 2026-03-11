import AdminLayout from "@/Components/Admin/AdminLayout";
import { router, usePage } from "@inertiajs/react";
import { useState } from "react";
import { Pencil, Trash2, Plus, Search, Eye, Save } from "lucide-react";

export default function Index({ types, filters, attributes }) {
    const { products } = usePage().props;

    const [search, setSearch] = useState(filters.search || "");
    const [deleteModal, setDeleteModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [form, setForm] = useState({
        name: "",
        slug: "",
        description: "",
        type_id: "",
        category_id: "",
        subcategory_id: "",
        specifications: [],
        variants: [],
    });

    // SEARCH
    function searchData() {
        router.get(route("admin.products.index"), { search }, { preserveState: true });
    }
    function clearSearch() {
        setSearch("");
        router.get(route("admin.products.index"));
    }

    // DELETE
    function confirmDelete(id) {
        setDeleteId(id);
        setDeleteModal(true);
    }
    function deleteProduct() {
        router.delete(route("admin.products.destroy", deleteId), {
            onSuccess: () => setDeleteModal(false),
        });
    }

    // VIEW DETAILS
    function viewDetails(product) {
        setSelectedProduct(product);
        setEditModal(false);
    }

    // EDIT
    function editProduct(product) {
        setSelectedProduct(product);
        setForm({
            name: product.name,
            slug: product.slug,
            description: product.description,
            type_id: product.type_id,
            category_id: product.category_id,
            subcategory_id: product.subcategory_id,
            specifications: product.specifications || [],
            variants: product.variants.map(v => ({
                id: v.id,
                sku: v.sku,
                price: v.price,
                stock: v.stock,
                attribute_values: v.attribute_values?.map(av => av.id) || [],
            })) || [],
        });
        setEditModal(true);
    }

    function updateProduct(e) {
        e.preventDefault();
        router.put(route("admin.products.update", selectedProduct.id), form, {
            onSuccess: () => setEditModal(false),
        });
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <div className="flex gap-2 flex-wrap">
                        <input
                            type="text"
                            placeholder="Search product"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border px-4 py-2 rounded-lg w-80"
                        />
                        <button onClick={searchData} className="bg-gray-800 text-white px-4 py-2 rounded-lg flex gap-2 items-center">
                            <Search size={16} /> Search
                        </button>
                        <button onClick={clearSearch} className="bg-gray-200 px-4 py-2 rounded-lg">
                            Clear
                        </button>
                    </div>
                    <button onClick={() => router.visit(route("admin.products.create"))}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                        <Plus size={16} /> Add Product
                    </button>
                </div>

                {/* Products Grid */}
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.data.map((product) => (
                        <div key={product.id} className="bg-white shadow rounded-xl p-4 hover:shadow-lg transition">
                            <div className="flex justify-between items-center mb-2">
                                <div className="font-medium">{product.name}</div>
                                <div className="flex gap-2">
                                    <button onClick={() => viewDetails(product)} className="text-green-600"><Eye size={16} /></button>
                                    <button onClick={() => editProduct(product)} className="text-blue-500"><Pencil size={16} /></button>
                                    <button onClick={() => confirmDelete(product.id)} className="text-red-500"><Trash2 size={16} /></button>
                                </div>
                            </div>
                            <div className="text-xs text-gray-500 mb-1">{product.slug}</div>
                            <div className="text-sm text-gray-600 mb-2">{product.description?.slice(0, 60)}...</div>
                            {product.variants?.length > 0 && (
                                <div className="text-xs text-gray-600 mb-2">Variants: {product.variants.length}</div>
                            )}
                            <div className="flex justify-between items-center mt-2">
                                <span className="font-semibold">${product.variants?.[0]?.price ?? 0}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="mt-6 flex justify-center">
                    {products.links.map((link, i) => (
                        <button
                            key={i}
                            disabled={!link.url}
                            onClick={() => link.url && router.get(link.url)}
                            className={`px-3 py-1 border rounded mx-1 ${link.active ? "bg-indigo-600 text-white" : "bg-white text-gray-700"}`}
                        >
                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                        </button>
                    ))}
                </div>
            </div>

            {/* DELETE MODAL */}
            {deleteModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-[350px] p-6 rounded-xl">
                        <h2 className="text-lg font-bold mb-4">Delete Product</h2>
                        <p className="text-gray-600">Are you sure you want to delete this product?</p>
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => setDeleteModal(false)} className="border px-4 py-2 rounded">Cancel</button>
                            <button onClick={deleteProduct} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* EDIT MODAL */}
            {editModal && selectedProduct && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-auto p-4">
                    <div className="bg-white w-full max-w-3xl p-6 rounded-xl">
                        <h2 className="text-xl font-bold mb-4">Edit Product</h2>
                        <form onSubmit={updateProduct} className="space-y-4">

                            {/* Basic Fields */}
                            <div className="flex gap-2 flex-wrap">
                                <input
                                    type="text"
                                    placeholder="Product Name"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="border px-4 py-2 rounded-lg w-full"
                                />
                                <input
                                    type="text"
                                    placeholder="Slug"
                                    value={form.slug}
                                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                                    className="border px-4 py-2 rounded-lg w-full"
                                />
                            </div>
                            <textarea
                                placeholder="Description"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                className="border px-4 py-2 rounded-lg w-full"
                            />

                            {/* Type / Category / Subcategory */}
                            <div className="flex gap-2 flex-wrap">
                                <select value={form.type_id} onChange={(e) => setForm({ ...form, type_id: e.target.value })}
                                    className="border px-4 py-2 rounded-lg">
                                    <option value="">Select Type</option>
                                    {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>

                                {types.find(t => t.id == form.type_id)?.categories && (
                                    <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                                        className="border px-4 py-2 rounded-lg">
                                        <option value="">Select Category</option>
                                        {types.find(t => t.id == form.type_id).categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                )}

                                {types.find(t => t.id == form.type_id)?.categories.find(c => c.id == form.category_id)?.subcategories && (
                                    <select value={form.subcategory_id} onChange={(e) => setForm({ ...form, subcategory_id: e.target.value })}
                                        className="border px-4 py-2 rounded-lg">
                                        <option value="">Select Subcategory</option>
                                        {types.find(t => t.id == form.type_id).categories.find(c => c.id == form.category_id).subcategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                )}
                            </div>

                            {/* Variants with attribute values */}
                            <div className="mt-4">
                                <h3 className="font-semibold mb-2">Variants</h3>
                                {form.variants.map((variant, idx) => (
                                    <div key={idx} className="border p-2 rounded mb-2">
                                        <div className="flex gap-2 flex-wrap">
                                            <input type="text" placeholder="SKU" value={variant.sku || ""} onChange={(e) => {
                                                const newV = [...form.variants]; newV[idx].sku = e.target.value; setForm({ ...form, variants: newV });
                                            }} className="border px-2 py-1 rounded mr-2" />

                                            <input type="number" placeholder="Price" value={variant.price || 0} onChange={(e) => {
                                                const newV = [...form.variants]; newV[idx].price = e.target.value; setForm({ ...form, variants: newV });
                                            }} className="border px-2 py-1 rounded mr-2" />

                                            <input type="number" placeholder="Stock" value={variant.stock || 0} onChange={(e) => {
                                                const newV = [...form.variants]; newV[idx].stock = e.target.value; setForm({ ...form, variants: newV });
                                            }} className="border px-2 py-1 rounded mr-2" />
                                        </div>

                                        <select multiple value={variant.attribute_values || []} onChange={(e) => {
                                            const opts = Array.from(e.target.selectedOptions, o => o.value);
                                            const newV = [...form.variants]; newV[idx].attribute_values = opts; setForm({ ...form, variants: newV });
                                        }} className="border px-2 py-1 rounded mt-1 w-full">
                                            {attributes.flatMap(attr => attr.values).map(val => (
                                                <option key={val.id} value={val.id}>{val.value}</option>
                                            ))}
                                        </select>
                                    </div>
                                ))}

                                <button type="button" onClick={() => setForm({ ...form, variants: [...form.variants, { sku: "", price: 0, stock: 0, attribute_values: [] }] })}
                                    className="mt-2 bg-green-600 text-white px-4 py-2 rounded">
                                    Add Variant
                                </button>
                            </div>

                            <div className="flex justify-end gap-3 mt-4">
                                <button type="button" onClick={() => setEditModal(false)} className="border px-4 py-2 rounded">Cancel</button>
                                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center gap-2"><Save size={16} /> Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
