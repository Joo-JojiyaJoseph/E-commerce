<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Subcategory;
use App\Models\Type;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class SubcategoryController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->search;

        $types = Type::with([
            'categories.subcategories'
        ])
            ->when($search, function ($query) use ($search) {

                $query->where('name', 'like', "%{$search}%")

                    ->orWhereHas('categories', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    })

                    ->orWhereHas('categories.subcategories', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            })
            ->latest()
            ->paginate(5)
            ->withQueryString();

        $allTypes = Type::with('categories')->get();

        return Inertia::render('Admin/Subcategory/Index', [
            'types' => $types,
            'allTypes' => $allTypes,
            'filters' => [
                'search' => $search
            ]
        ]);
    }


    /**
     * STORE
     */
    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
        ]);

        Subcategory::create([
            'category_id' => $request->category_id,
            'name' => $request->name,
            'slug' => Str::slug($request->name)
        ]);

        return redirect()->back()->with('success', 'Subcategory created');
    }


    /**
     * UPDATE
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
        ]);

        $subcategory = Subcategory::findOrFail($id);

        $subcategory->update([
            'category_id' => $request->category_id,
            'name' => $request->name,
            'slug' => Str::slug($request->name)
        ]);

        return redirect()->back()->with('success', 'Subcategory updated');
    }


    /**
     * DELETE
     */
    public function destroy($id)
    {
        Subcategory::findOrFail($id)->delete();

        return redirect()->back()->with('success', 'Subcategory deleted');
    }
}
