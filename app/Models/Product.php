<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{

    protected $fillable = [
        'type_id',
        'category_id',
        'subcategory_id',
        'name',
        'slug',
        'description'
    ];

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function specifications()
    {
        return $this->hasMany(Specification::class);
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }
        public function type()
    {
        return $this->belongsTo(Type::class);
    }

    /* CATEGORY */

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /* SUBCATEGORY */

    public function subcategory()
    {
        return $this->belongsTo(Subcategory::class);
    }
}
