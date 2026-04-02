<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('abouts', function (Blueprint $table) {
            $table->id();
            $table->string('company_name');
            $table->string('tagline')->nullable();
            $table->unsignedSmallInteger('founding_year')->nullable();
            $table->text('description')->nullable();
            $table->text('mission')->nullable();
            $table->text('vision')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('abouts');
    }
};
