<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attribute;
use App\Models\AttributeValue;
use Illuminate\Http\Request;

class AttributeValueController extends Controller
{
    public function index()
    {
        $values = AttributeValue::with('attribute')
            ->latest()
            ->paginate(10);

        $attributes = Attribute::all();

        return inertia('Admin/AttributeValues/Index', [
            'values' => $values,
            'attributes' => $attributes
        ]);
    }

    public function store(Request $request)
    {
        AttributeValue::create([
            'attribute_id' => $request->attribute_id,
            'value' => $request->value
        ]);

        return redirect()->back();
    }

    public function update(Request $request, AttributeValue $attributeValue)
    {
        $attributeValue->update([
            'attribute_id' => $request->attribute_id,
            'value' => $request->value
        ]);

        return redirect()->back();
    }

    public function destroy(AttributeValue $attributeValue)
    {
        $attributeValue->delete();

        return redirect()->back();
    }
}
