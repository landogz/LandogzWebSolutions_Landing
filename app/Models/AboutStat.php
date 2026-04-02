<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AboutStat extends Model
{
    use SoftDeletes;

    protected $fillable = ['label', 'value', 'sort_order'];
}
