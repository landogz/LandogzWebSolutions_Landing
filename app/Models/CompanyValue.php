<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CompanyValue extends Model
{
    use SoftDeletes;

    protected $fillable = ['icon', 'label', 'description', 'sort_order'];
}
