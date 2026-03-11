import AdminLayout from "@/Components/Admin/AdminLayout";
import { useState } from "react";
import { router } from "@inertiajs/react";
import { Plus, ArrowLeft, ArrowRight } from "lucide-react";

export default function Create({ types, attributes }) {
    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState({});

    const [product, setProduct] = useState({
        name: "",
        slug: "",
        description: "",
        type_id: "",
        category_id: "",
        subcategory_id: "",
    });

    const [images, setImages] = useState([]);
    const [productAttributes, setProductAttributes] = useState([]);
    const [variants, setVariants] = useState([]);
    const [specs, setSpecs] = useState([]);

    const selectedType = types.find((t) => t.id == product.type_id);
    const selectedCategory = selectedType?.categories.find(
        (c) => c.id == product.category_id,
    );

    // --- Step Navigation ---
    function next() {
        if (validateStep(step)) setStep(step + 1);
    }

    function prev() {
        setStep(step - 1);
    }

    // --- Validation ---
    function validateStep(stepNumber) {
        let errs = {};
        if (stepNumber === 1) {
            if (!product.type_id) errs.type_id = "Type is required";
            if (!product.category_id) errs.category_id = "Category is required";
            if (!product.subcategory_id)
                errs.subcategory_id = "Subcategory is required";
        } else if (stepNumber === 2) {
            if (!product.name) errs.name = "Product Name is required";
            if (!product.slug) errs.slug = "Slug is required";
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    }

    // --- Image Handling ---
    function handleImage(e) {
        setImages([...e.target.files]);
    }

    // --- Attributes Handling ---
    function addAttribute() {
        setProductAttributes([
            ...productAttributes,
            { attribute_id: "", values: [] },
        ]);
    }

    function updateAttribute(index, value) {
        const copy = [...productAttributes];
        copy[index].attribute_id = value;
        copy[index].values = [];
        setProductAttributes(copy);
    }

    function addAttributeValue(attrIndex, value) {
        const copy = [...productAttributes];
        if (!copy[attrIndex].values.includes(value))
            copy[attrIndex].values.push(value);
        setProductAttributes(copy);
        generateVariants(copy);
    }

    function generateVariants(attrs) {
        let result = [[]];
        attrs.forEach((attr) => {
            let temp = [];
            attr.values.forEach((v) => {
                result.forEach((r) => temp.push([...r, v]));
            });
            result = temp;
        });
        setVariants(result);
    }

    // --- Specifications ---
    function addSpec() {
        setSpecs([...specs, { name: "", value: "" }]);
    }

    function updateSpec(i, key, value) {
        const copy = [...specs];
        copy[i][key] = value;
        setSpecs(copy);
    }

    // --- Submit ---
    function submit(e) {
        e.preventDefault();

        const data = new FormData();
        Object.keys(product).forEach((key) => data.append(key, product[key]));
        images.forEach((img) => data.append("images[]", img));
        data.append("attributes", JSON.stringify(productAttributes));
        data.append("variants", JSON.stringify(variants));
        data.append("specifications", JSON.stringify(specs));

        router.post(route("admin.products.store"), data, {
            onError: (err) => setErrors(err),
        });
    }

    return (
        <AdminLayout>
            <div className="max-w-6xl mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6">Create Product</h1>

                {/* STEP INDICATOR */}
                <div className="flex justify-between mb-8">
                    {[
                        "Category",
                        "Basic Info",
                        "Images",
                        "Attributes",
                        "Specifications",
                    ].map((label, i) => {
                        const s = i + 1;
                        return (
                            <div key={i} className="flex-1 text-center">
                                <div
                                    className={`h-8 w-8 mx-auto rounded-full flex items-center justify-center text-white
                                        ${step >= s ? "bg-indigo-600" : "bg-gray-300"}`}
                                >
                                    {s}
                                </div>
                                <p className="text-sm mt-1">{label}</p>
                            </div>
                        );
                    })}
                </div>

                <form
                    onSubmit={submit}
                    className="bg-white shadow rounded-xl p-6 space-y-6"
                >
                    {/* STEP 1 CATEGORY */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">
                                Select Category
                            </h2>

                            <div>
                                <select
                                    className={`w-full border rounded-lg p-3 ${errors.type_id ? "border-red-500" : ""}`}
                                    value={product.type_id}
                                    onChange={(e) =>
                                        setProduct({
                                            ...product,
                                            type_id: e.target.value,
                                            category_id: "",
                                            subcategory_id: "",
                                        })
                                    }
                                >
                                    <option value="">Select Type</option>
                                    {types.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.type_id && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.type_id}
                                    </p>
                                )}
                            </div>

                            <div>
                                <select
                                    className={`w-full border rounded-lg p-3 ${errors.category_id ? "border-red-500" : ""}`}
                                    value={product.category_id}
                                    onChange={(e) =>
                                        setProduct({
                                            ...product,
                                            category_id: e.target.value,
                                            subcategory_id: "",
                                        })
                                    }
                                >
                                    <option value="">Select Category</option>
                                    {selectedType?.categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category_id && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.category_id}
                                    </p>
                                )}
                            </div>

                            <div>
                                <select
                                    className={`w-full border rounded-lg p-3 ${errors.subcategory_id ? "border-red-500" : ""}`}
                                    value={product.subcategory_id}
                                    onChange={(e) =>
                                        setProduct({
                                            ...product,
                                            subcategory_id: e.target.value,
                                        })
                                    }
                                >
                                    <option value="">Select Subcategory</option>
                                    {selectedCategory?.subcategories.map(
                                        (sub) => (
                                            <option key={sub.id} value={sub.id}>
                                                {sub.name}
                                            </option>
                                        ),
                                    )}
                                </select>
                                {errors.subcategory_id && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.subcategory_id}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* STEP 2 BASIC INFO */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">
                                Basic Information
                            </h2>

                            <input
                                type="text"
                                placeholder="Product Name"
                                className={`w-full border p-3 rounded-lg ${errors.name ? "border-red-500" : ""}`}
                                value={product.name}
                                onChange={(e) =>
                                    setProduct({
                                        ...product,
                                        name: e.target.value,
                                    })
                                }
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm">
                                    {errors.name}
                                </p>
                            )}

                            <input
                                type="text"
                                placeholder="Slug"
                                className={`w-full border p-3 rounded-lg ${errors.slug ? "border-red-500" : ""}`}
                                value={product.slug}
                                onChange={(e) =>
                                    setProduct({
                                        ...product,
                                        slug: e.target.value,
                                    })
                                }
                            />
                            {errors.slug && (
                                <p className="text-red-500 text-sm">
                                    {errors.slug}
                                </p>
                            )}

                            <textarea
                                rows="4"
                                placeholder="Description"
                                className="w-full border p-3 rounded-lg"
                                value={product.description}
                                onChange={(e) =>
                                    setProduct({
                                        ...product,
                                        description: e.target.value,
                                    })
                                }
                            />
                        </div>
                    )}

                    {/* STEP 3 IMAGES */}
                    {step === 3 && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4">
                                Product Images
                            </h2>
                            <input
                                type="file"
                                multiple
                                onChange={handleImage}
                            />
                            <div className="grid grid-cols-4 gap-3 mt-4">
                                {images.map((img, i) => (
                                    <img
                                        key={i}
                                        src={URL.createObjectURL(img)}
                                        className="h-24 w-full object-cover rounded"
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 4 ATTRIBUTES */}
                    {step === 4 && (
                        <div>
                            <div className="flex justify-between mb-4">
                                <h2 className="text-xl font-semibold">
                                    Attributes
                                </h2>
                                <button
                                    type="button"
                                    onClick={addAttribute}
                                    className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded-lg"
                                >
                                    <Plus size={16} /> Add Attribute
                                </button>
                            </div>

                            {productAttributes.map((attr, i) => {
                                const selectedAttr = attributes.find(
                                    (a) => a.id == attr.attribute_id,
                                );
                                return (
                                    <div
                                        key={i}
                                        className="border p-4 rounded-lg mb-3"
                                    >
                                        <select
                                            className="border p-2 w-full mb-3 rounded"
                                            onChange={(e) =>
                                                updateAttribute(
                                                    i,
                                                    e.target.value,
                                                )
                                            }
                                        >
                                            <option value="">
                                                Select Attribute
                                            </option>
                                            {attributes.map((a) => (
                                                <option key={a.id} value={a.id}>
                                                    {a.name}
                                                </option>
                                            ))}
                                        </select>

                                        <div className="flex flex-wrap gap-2">
                                            {selectedAttr?.values.map((v) => (
                                                <button
                                                    key={v.id}
                                                    type="button"
                                                    onClick={() =>
                                                        addAttributeValue(
                                                            i,
                                                            v.value,
                                                        )
                                                    }
                                                    className="px-3 py-1 border rounded-full hover:bg-gray-100"
                                                >
                                                    {v.value}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}

                            {/* VARIANTS WITH PRICE */}
                            <div className="mt-6">
                                <h3 className="font-semibold mb-2">
                                    Generated Variants
                                </h3>
                                {variants.map((v, i) => (
                                    <div
                                        key={i}
                                        className="border p-2 rounded mb-2 flex flex-wrap gap-2 items-center"
                                    >
                                        <span className="flex-1">
                                            {v.join(" / ")}
                                        </span>

                                        <input
                                            type="text"
                                            placeholder="SKU"
                                            className="border px-2 py-1 rounded w-24"
                                            value={v.sku || ""}
                                            onChange={(e) => {
                                                const copy = [...variants];
                                                copy[i].sku = e.target.value;
                                                setVariants(copy);
                                            }}
                                        />

                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="Price"
                                            className="border px-2 py-1 rounded w-24"
                                            value={v.price || ""}
                                            onChange={(e) => {
                                                const copy = [...variants];
                                                copy[i].price = e.target.value;
                                                setVariants(copy);
                                            }}
                                        />

                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="Stock"
                                            className="border px-2 py-1 rounded w-24"
                                            value={v.stock || ""}
                                            onChange={(e) => {
                                                const copy = [...variants];
                                                copy[i].stock = e.target.value;
                                                setVariants(copy);
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 5 SPECIFICATIONS */}
                    {step === 5 && (
                        <div>
                            <div className="flex justify-between mb-4">
                                <h2 className="text-xl font-semibold">
                                    Specifications
                                </h2>
                                <button
                                    type="button"
                                    onClick={addSpec}
                                    className="bg-gray-800 text-white px-3 py-1 rounded"
                                >
                                    Add
                                </button>
                            </div>

                            {specs.map((s, i) => (
                                <div key={i} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        className="border p-2 rounded w-1/2"
                                        onChange={(e) =>
                                            updateSpec(
                                                i,
                                                "name",
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <input
                                        type="text"
                                        placeholder="Value"
                                        className="border p-2 rounded w-1/2"
                                        onChange={(e) =>
                                            updateSpec(
                                                i,
                                                "value",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* NAVIGATION */}
                    <div className="flex justify-between mt-6">
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={prev}
                                className="flex items-center gap-2 border px-4 py-2 rounded"
                            >
                                <ArrowLeft size={16} /> Back
                            </button>
                        )}
                        {step < 5 && (
                            <button
                                type="button"
                                onClick={next}
                                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded"
                            >
                                Next <ArrowRight size={16} />
                            </button>
                        )}
                        {step === 5 && (
                            <button
                                type="submit"
                                className="bg-green-600 text-white px-6 py-2 rounded"
                            >
                                Save Product
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
