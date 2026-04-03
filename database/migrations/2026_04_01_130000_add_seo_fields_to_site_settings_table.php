<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            $table->string('seo_og_image_path')->nullable();
            $table->string('seo_robots')->nullable();
            $table->string('seo_twitter_handle', 64)->nullable();
            $table->string('seo_canonical_base_url', 512)->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            $table->dropColumn([
                'seo_og_image_path',
                'seo_robots',
                'seo_twitter_handle',
                'seo_canonical_base_url',
            ]);
        });
    }
};
