<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Type extends Model
{
    protected $fillable = [
        'name',
        'image'
    ];

      public function categories()
    {
        return $this->hasMany(Category::class);
    }
}
