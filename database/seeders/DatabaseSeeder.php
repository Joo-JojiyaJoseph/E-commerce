<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Type;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
           // Admin User
        User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Normal User
        User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password'),
            'role' => 'user',
        ]);

        $types = [
    ['name' => 'Electronics', 'image' => 'electronics.jpg'],
    ['name' => 'Clothing', 'image' => 'clothing.jpg'],
    ['name' => 'Furniture', 'image' => 'furniture.jpg'],
    ['name' => 'Books', 'image' => 'books.jpg'],
];

foreach ($types as $typeData) {
    $type = Type::create($typeData);

    $categories = match($type->name) {
        'Electronics' => ['Smartphones', 'Laptops', 'Accessories'],
        'Clothing' => ['T-Shirts', 'Jeans', 'Jackets'],
        'Furniture' => ['Tables', 'Chairs', 'Beds'],
        'Books' => ['Programming', 'Novels', 'Comics'],
        default => []
    };

    foreach ($categories as $catName) {
        Category::create([
            'type_id' => $type->id,
            'name' => $catName
        ]);
    }
}
    }
}
