<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Specification;
use App\Models\Type;
use App\Models\Attribute;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $query = Product::with([
            'type',
            'category',
            'subcategory'
        ]);

        /* SEARCH */

        if ($request->search) {

            $query->where(function ($q) use ($request) {

                $q->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('slug', 'like', '%' . $request->search . '%');
            });
        }

        /* TYPE FILTER */

        if ($request->type_id) {

            $query->where('type_id', $request->type_id);
        }

        /* CATEGORY FILTER */

        if ($request->category_id) {

            $query->where('category_id', $request->category_id);
        }

        /* SUBCATEGORY FILTER */

        if ($request->subcategory_id) {

            $query->where('subcategory_id', $request->subcategory_id);
        }

        $products = $query->latest()->paginate(10);

        $types = Type::with('categories.subcategories')->get();

        return inertia(
            'Admin/Product/Index',
            [
                'products' => $products,
                'types' => $types,
                'filters' => $request->only([
                    'search',
                    'type_id',
                    'category_id',
                    'subcategory_id'
                ])
            ]
        );
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

        $types = Type::with('categories.subcategories')->get();

        $attributes = Attribute::with('values')->get();

        return inertia(
            'Admin/Product/Create',
            [
                'types' => $types,
                'attributes' => $attributes
            ]
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $product = Product::create([
            'name' => $request->name,
            'slug' => $request->slug,
            'description' => $request->description,
            'type_id' => $request->type_id,
            'category_id' => $request->category_id,
            'subcategory_id' => $request->subcategory_id
        ]);

        if ($request->hasFile('images')) {

            foreach ($request->file('images') as $image) {

                $path = $image->store('products', 'public');

                ProductImage::create([
                    'product_id' => $product->id,
                    'image' => $path
                ]);
            }
        }

        $specs = json_decode($request->specifications, true);

        foreach ($specs as $s) {

            Specification::create([
                'product_id' => $product->id,
                'name' => $s['name'],
                'value' => $s['value']
            ]);
        }

        return redirect()->route('admin.products.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
