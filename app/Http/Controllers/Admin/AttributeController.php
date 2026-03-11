<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attribute;
use App\Models\AttributeValue;
use Illuminate\Http\Request;

class AttributeController extends Controller
{
    public function index()
    {
        $attributes = Attribute::with('values')
            ->latest()
            ->paginate(10);

              $values = AttributeValue::with('attribute')
            ->latest()
            ->paginate(10);

        return inertia('Admin/Attributes/Index', [
            'attributes' => $attributes,
             'values' => $values,
        ]);
    }

    public function store(Request $request)
    {
        Attribute::create([
            'name' => $request->name
        ]);

        return redirect()->back();
    }

    public function update(Request $request, Attribute $attribute)
    {
        $attribute->update([
            'name' => $request->name
        ]);

        return redirect()->back();
    }

    public function destroy(Attribute $attribute)
    {
        $attribute->delete();

        return redirect()->back();
    }
}
