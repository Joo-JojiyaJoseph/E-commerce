<?php

namespace Database\Seeders;

use App\Models\Attribute;
use App\Models\AttributeValue;
use App\Models\Category;
use App\Models\Subcategory;
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

            $categories = match ($type->name) {

                'Electronics' => [
                    'Smartphones' => ['Android Phones', 'iPhones', 'Gaming Phones'],
                    'Laptops' => ['Gaming Laptops', 'Ultrabooks', 'Business Laptops'],
                    'Accessories' => ['Chargers', 'Headphones', 'Power Banks'],
                ],

                'Clothing' => [
                    'T-Shirts' => ['Round Neck', 'V Neck', 'Graphic Tees'],
                    'Jeans' => ['Slim Fit', 'Regular Fit', 'Skinny Jeans'],
                    'Jackets' => ['Leather Jackets', 'Winter Jackets', 'Denim Jackets'],
                ],

                'Furniture' => [
                    'Tables' => ['Dining Tables', 'Office Tables', 'Coffee Tables'],
                    'Chairs' => ['Office Chairs', 'Dining Chairs', 'Gaming Chairs'],
                    'Beds' => ['King Size Beds', 'Queen Size Beds', 'Bunk Beds'],
                ],

                'Books' => [
                    'Programming' => ['PHP', 'Laravel', 'React'],
                    'Novels' => ['Romance', 'Thriller', 'Drama'],
                    'Comics' => ['Marvel', 'DC', 'Manga'],
                ],

                default => []
            };

            foreach ($categories as $categoryName => $subcategories) {

                $category = Category::create([
                    'type_id' => $type->id,
                    'name' => $categoryName
                ]);

                foreach ($subcategories as $subName) {

                    Subcategory::create([
                        'category_id' => $category->id,
                        'name' => $subName
                    ]);
                }
            }
        }
          $attributes = [
            'Color' => ['Red', 'Blue', 'Green', 'Black', 'White'],
            'Size' => ['Small', 'Medium', 'Large', 'X-Large'],
            'Material' => ['Cotton', 'Leather', 'Polyester', 'Wool'],
            'Warranty' => ['6 Months', '1 Year', '2 Years', '3 Years'],
            'Brand' => ['Brand A', 'Brand B', 'Brand C', 'Brand D'],
        ];

        foreach ($attributes as $attrName => $values) {
            $attribute = Attribute::create([
                'name' => $attrName,
            ]);

            foreach ($values as $val) {
                AttributeValue::create([
                    'attribute_id' => $attribute->id,
                    'value' => $val,
                ]);
            }
        }
    }
}
