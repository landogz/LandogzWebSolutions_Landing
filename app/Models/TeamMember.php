<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TeamMember extends Model
{
    use SoftDeletes;

    protected $fillable = ['photo_path', 'name', 'position', 'bio', 'social_links', 'sort_order'];

    protected function casts(): array
    {
        return [
            'social_links' => 'array',
        ];
    }
}
