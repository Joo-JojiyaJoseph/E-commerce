<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Category;
use App\Models\Type;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $types = Type::with('categories')->latest()->get();

        return Inertia::render('Admin/Category/Index', [
            'types' => $types, // send types with categories
        ]);
    }

    /**
     * Store a new category
     */
    public function store(Request $request)
    {
        $request->validate([
            'type_id' => 'required|exists:types,id',
            'name' => 'required|string|max:255',
        ]);

        Category::create([
            'type_id' => $request->type_id,
            'name' => $request->name,
        ]);

        return back()->with('success', 'Category added successfully!');
    }

    /**
     * Update an existing category
     */
    public function update(Request $request, Category $category)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $category->update([
            'name' => $request->name,
        ]);

        return back()->with('success', 'Category updated successfully!');
    }

    /**
     * Delete a category
     */
    public function destroy(Category $category)
    {
        $category->delete();

        return back()->with('success', 'Category deleted successfully!');
    }
}
