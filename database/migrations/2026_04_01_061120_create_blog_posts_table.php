<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('blog_posts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('featured_image_path')->nullable();
            $table->string('category')->nullable();
            $table->json('tags')->nullable();
            $table->longText('content')->nullable();
            $table->text('excerpt')->nullable();
            $table->string('author')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->string('status', 16)->default('draft');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('blog_posts');
    }
};
