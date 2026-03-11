<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Specification;
use App\Models\Type;
use App\Models\Attribute;
use App\Models\ProductVariant;
use App\Models\Variant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Base query for products
        $query = Product::with(['type', 'category', 'subcategory']);

        // SEARCH
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('slug', 'like', '%' . $request->search . '%');
            });
        }

        // FILTERS
        if ($request->type_id) $query->where('type_id', $request->type_id);
        if ($request->category_id) $query->where('category_id', $request->category_id);
        if ($request->subcategory_id) $query->where('subcategory_id', $request->subcategory_id);

        // PAGINATION
        $products = $query->latest()->paginate(10)->withQueryString(); // 10 per page

        // Get types, categories, subcategories for filters
        $types = Type::with('categories.subcategories')->get();

        return inertia('Admin/Product/Index', [
            'products' => $products,
            'types' => $types,
            'filters' => $request->only(['search', 'type_id', 'category_id', 'subcategory_id'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $types = Type::with('categories.subcategories')->get();
        $attributes = Attribute::with('values')->get();

        return inertia('Admin/Product/Create', [
            'types' => $types,
            'attributes' => $attributes
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // VALIDATION
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:products,slug',
            'type_id' => 'required|exists:types,id',
            'category_id' => 'required|exists:categories,id',
            'subcategory_id' => 'required|exists:subcategories,id',
            'images.*' => 'nullable|image|max:2048',
            'specifications' => 'nullable|json',
            'variants' => 'nullable|json',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        // CREATE PRODUCT
        $product = Product::create([
            'name' => $request->name,
            'slug' => $request->slug,
            'description' => $request->description,
            'type_id' => $request->type_id,
            'category_id' => $request->category_id,
            'subcategory_id' => $request->subcategory_id
        ]);

        // UPLOAD IMAGES
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('products', 'public');
                ProductImage::create([
                    'product_id' => $product->id,
                    'image' => $path
                ]);
            }
        }

        // CREATE SPECIFICATIONS
        $specs = json_decode($request->specifications, true) ?? [];
        foreach ($specs as $s) {
            Specification::create([
                'product_id' => $product->id,
                'name' => $s['name'],
                'value' => $s['value']
            ]);
        }

        // CREATE VARIANTS & ATTRIBUTE VALUES
        $variants = json_decode($request->variants, true) ?? [];
        foreach ($variants as $v) {
            $variant = ProductVariant::create([
                'product_id' => $product->id,
                'sku' => $v['sku'] ?? null,
                'price' => $v['price'] ?? 0,
                'stock' => $v['stock'] ?? 0,
            ]);

            if (!empty($v['attribute_values'])) {
                $variant->attributeValues()->sync($v['attribute_values']); // attach to product_variant_values
            }
        }

        return redirect()->route('admin.products.index')->with('success', 'Product created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        $types = Type::with('categories.subcategories')->get();
        $attributes = Attribute::with('values')->get();

        $product->load(['variants', 'images', 'specifications']);

        return inertia('Admin/Product/Edit', [
            'product' => $product,
            'types' => $types,
            'attributes' => $attributes
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        // VALIDATION
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:products,slug,' . $product->id,
            'type_id' => 'required|exists:types,id',
            'category_id' => 'required|exists:categories,id',
            'subcategory_id' => 'required|exists:subcategories,id',
            'images.*' => 'nullable|image|max:2048',
            'specifications' => 'nullable|json',
            'attributes' => 'nullable|json',
            'variants' => 'nullable|json',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        // UPDATE PRODUCT
        $product->update([
            'name' => $request->name,
            'slug' => $request->slug,
            'description' => $request->description,
            'type_id' => $request->type_id,
            'category_id' => $request->category_id,
            'subcategory_id' => $request->subcategory_id
        ]);

        // UPLOAD IMAGES
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('products', 'public');
                ProductImage::create([
                    'product_id' => $product->id,
                    'image' => $path
                ]);
            }
        }

        // UPDATE SPECIFICATIONS
        $product->specifications()->delete();
        $specs = json_decode($request->specifications, true) ?? [];
        foreach ($specs as $s) {
            Specification::create([
                'product_id' => $product->id,
                'name' => $s['name'],
                'value' => $s['value']
            ]);
        }

        // UPDATE VARIANTS
        $product->variants()->delete();
        $variants = json_decode($request->variants, true) ?? [];
        foreach ($variants as $v) {
            ProductVariant::create([
                'product_id' => $product->id,
                'sku' => $v['sku'] ?? null,
                'price' => $v['price'] ?? 0,
                'stock' => $v['stock'] ?? 0,
                'attribute_values' => json_encode($v['attribute_values']),
            ]);
        }

        return redirect()->route('admin.products.index')->with('success', 'Product updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $product->delete();
        return redirect()->route('admin.products.index')->with('success', 'Product deleted successfully.');
    }
}
