<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Testimonial extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'client_name',
        'company',
        'photo_path',
        'rating',
        'message',
        'status',
        'sort_order',
    ];

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }
}
