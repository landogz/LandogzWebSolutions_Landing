<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hero_settings', function (Blueprint $table) {
            $table->id();
            $table->string('headline');
            $table->json('animated_words')->nullable();
            $table->text('subheading')->nullable();
            $table->string('cta_primary_text')->nullable();
            $table->string('cta_primary_url')->nullable();
            $table->string('cta_secondary_text')->nullable();
            $table->string('cta_secondary_url')->nullable();
            $table->string('background_type', 32)->default('gradient');
            $table->string('company_tagline')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hero_settings');
    }
};
