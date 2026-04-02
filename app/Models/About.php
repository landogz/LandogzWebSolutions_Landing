<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class About extends Model
{
    protected $fillable = [
        'company_name',
        'tagline',
        'founding_year',
        'description',
        'mission',
        'vision',
    ];
}
