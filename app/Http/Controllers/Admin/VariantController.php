<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProductVariant;
use Illuminate\Http\Request;

class VariantController extends Controller
{

    public function index()
    {
        $variants = ProductVariant::with('product')
            ->latest()
            ->paginate(10);

        return inertia('Admin/Variants/Index', [
            'variants' => $variants
        ]);
    }

    public function store(Request $request)
    {
        ProductVariant::create([
            'product_id' => $request->product_id,
            'sku' => $request->sku,
            'price' => $request->price,
            'stock' => $request->stock
        ]);

        return redirect()->back();
    }

    public function update(Request $request, ProductVariant $variant)
    {
        $variant->update($request->all());

        return redirect()->back();
    }

    public function destroy(ProductVariant $variant)
    {
        $variant->delete();

        return redirect()->back();
    }
}
