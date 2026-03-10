<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Type;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TypeController extends Controller
{

    public function index()
    {
        return Inertia::render('Admin/Type/Index', [
            'types' => Type::latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'image' => 'nullable|image|max:2048'
        ]);

        $image = null;

        if ($request->hasFile('image')) {
            $image = $request->file('image')->store('types', 'public');
        }

        Type::create([
            'name' => $request->name,
            'image' => $image
        ]);

        return back();
    }

   public function destroy(Type $type)
{
    if ($type->categories()->count() > 0) {
        return back()->with('error', 'Cannot delete type because it has categories.');
    }

    $type->delete();

    return back()->with('success', 'Type deleted successfully!');
}

    public function update(Request $request, Type $type)
    {
        $request->validate([
            'name' => 'required',
            'image' => 'nullable|image|max:2048'
        ]);

        $data = $request->only('name');

        if ($request->hasFile('image')) {
            if ($type->image) {
                Storage::disk('public')->delete($type->image);
            }
            $data['image'] = $request->file('image')->store('types', 'public');
        }

        $type->update($data);
        return redirect()->back();
    }
}
