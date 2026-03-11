<?php

use App\Http\Controllers\Admin\AttributeController;
use App\Http\Controllers\Admin\AttributeValueController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\SubcategoryController;
use App\Http\Controllers\Admin\TypeController;
use App\Http\Controllers\Admin\VariantController;
use App\Http\Controllers\ProfileController;
use App\Models\Subcategory;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

/*
|--------------------------------------------------------------------------
| User Dashboard
|--------------------------------------------------------------------------
*/

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

/*
|--------------------------------------------------------------------------
| Profile
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');

    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');

    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'admin'])
    ->prefix('admin')
    ->group(function () {

        Route::get('dashboard', function () {
            return Inertia::render('Admin/Dashboard');
        })->name('admin.dashboard');

        // Types
        Route::get('/types', [TypeController::class, 'index'])->name('types.index');
        Route::post('/types', [TypeController::class, 'store'])->name('types.store');
        Route::put('/types/{type}', [TypeController::class, 'update'])->name('types.update');
        Route::delete('/types/{type}', [TypeController::class, 'destroy'])->name('types.destroy');

        // Categories
        Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
        Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
        Route::put('/categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');

        // Subcategory Routes
        Route::get('/subcategories', [SubcategoryController::class, 'index'])->name('admin.subcategory.index');
        Route::post('/subcategories', [SubcategoryController::class, 'store'])->name('admin.subcategory.store');
        Route::put('/subcategories/{id}', [SubcategoryController::class, 'update'])->name('admin.subcategory.update');
        Route::delete('/subcategories/{id}', [SubcategoryController::class, 'destroy'])->name('admin.subcategory.destroy');

        // Product Routes
        Route::get('/products', [ProductController::class, 'index'])->name('admin.products.index');
        Route::get('/products/create', [ProductController::class, 'create'])->name('admin.products.create');
        Route::post('/products', [ProductController::class, 'store'])->name('admin.products.store');

        // Attribute Routes
        Route::get('/attribute', [AttributeController::class, 'index'])->name('admin.attributes.index');
        Route::post('/attributes', [AttributeController::class, 'store'])->name('admin.attributes.store');
        Route::put('/attributes/{id}', [AttributeController::class, 'update'])->name('admin.attributes.update');
        Route::delete('/attributes/{id}', [AttributeController::class, 'destroy'])->name('admin.attributes.destroy');


        // Attribute Value Routes
        Route::get('/attribute-values', [AttributeValueController::class, 'index'])->name('admin.attribute-values.index');
        Route::post('/attribute-values', [AttributeValueController::class, 'store'])->name('admin.attribute-values.store');
        Route::put('/attribute-values/{id}', [AttributeValueController::class, 'update'])->name('admin.attribute-values.update');
        Route::delete('/attribute-values/{id}', [AttributeValueController::class, 'destroy'])->name('admin.attribute-values.destroy');


        Route::resource('attributes', AttributeController::class);
        Route::resource('attribute-values', AttributeValueController::class);
        Route::resource('variants', VariantController::class);
    });



/*
|--------------------------------------------------------------------------
| Auth Routes
|--------------------------------------------------------------------------
*/

require __DIR__ . '/auth.php';
