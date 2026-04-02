<?php

use App\Http\Controllers\Api\V1\Admin\AboutAdminController;
use App\Http\Controllers\Api\V1\Admin\AboutStatAdminController;
use App\Http\Controllers\Api\V1\Admin\BlogPostAdminController;
use App\Http\Controllers\Api\V1\Admin\ClientAdminController;
use App\Http\Controllers\Api\V1\Admin\CompanyValueAdminController;
use App\Http\Controllers\Api\V1\Admin\ContactMessageAdminController;
use App\Http\Controllers\Api\V1\Admin\HeroAdminController;
use App\Http\Controllers\Api\V1\Admin\ProjectAdminController;
use App\Http\Controllers\Api\V1\Admin\ProjectCategoryAdminController;
use App\Http\Controllers\Api\V1\Admin\ServiceAdminController;
use App\Http\Controllers\Api\V1\Admin\SiteSettingAdminController;
use App\Http\Controllers\Api\V1\Admin\SkillAdminController;
use App\Http\Controllers\Api\V1\Admin\TeamMemberAdminController;
use App\Http\Controllers\Api\V1\Admin\TestimonialAdminController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\Public\AboutPublicController;
use App\Http\Controllers\Api\V1\Public\BlogPublicController;
use App\Http\Controllers\Api\V1\Public\ClientsPublicController;
use App\Http\Controllers\Api\V1\Public\ContactPublicController;
use App\Http\Controllers\Api\V1\Public\HeroPublicController;
use App\Http\Controllers\Api\V1\Public\ProjectCategoriesPublicController;
use App\Http\Controllers\Api\V1\Public\ProjectsPublicController;
use App\Http\Controllers\Api\V1\Public\ServicesPublicController;
use App\Http\Controllers\Api\V1\Public\SiteSettingsPublicController;
use App\Http\Controllers\Api\V1\Public\SkillsPublicController;
use App\Http\Controllers\Api\V1\Public\TeamPublicController;
use App\Http\Controllers\Api\V1\Public\TestimonialsPublicController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::prefix('public')->group(function () {
        Route::get('/hero', [HeroPublicController::class, 'show']);
        Route::get('/about', [AboutPublicController::class, 'show']);
        Route::get('/services', [ServicesPublicController::class, 'index']);
        Route::get('/project-categories', [ProjectCategoriesPublicController::class, 'index']);
        Route::get('/projects', [ProjectsPublicController::class, 'index']);
        Route::get('/projects/{slug}', [ProjectsPublicController::class, 'show']);
        Route::get('/skills', [SkillsPublicController::class, 'index']);
        Route::get('/team', [TeamPublicController::class, 'index']);
        Route::get('/testimonials', [TestimonialsPublicController::class, 'index']);
        Route::get('/clients', [ClientsPublicController::class, 'index']);
        Route::get('/blog', [BlogPublicController::class, 'index']);
        Route::get('/blog/{slug}', [BlogPublicController::class, 'show']);
        Route::get('/site-settings', [SiteSettingsPublicController::class, 'show']);
        Route::post('/contact', [ContactPublicController::class, 'store']);
    });

    Route::post('/auth/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/change-password', [AuthController::class, 'changePassword']);

        Route::get('/dashboard', DashboardController::class);

        Route::middleware('admin')->prefix('admin')->group(function () {
            Route::get('/hero', [HeroAdminController::class, 'show']);
            Route::put('/hero', [HeroAdminController::class, 'update']);

            Route::get('/about', [AboutAdminController::class, 'show']);
            Route::put('/about', [AboutAdminController::class, 'update']);

            Route::apiResource('about-stats', AboutStatAdminController::class);
            Route::apiResource('company-values', CompanyValueAdminController::class);
            Route::apiResource('project-categories', ProjectCategoryAdminController::class);
            Route::delete('projects/{project}/gallery', [ProjectAdminController::class, 'removeGalleryImage']);
            Route::apiResource('projects', ProjectAdminController::class);
            Route::apiResource('services', ServiceAdminController::class);
            Route::apiResource('skills', SkillAdminController::class);
            Route::apiResource('team-members', TeamMemberAdminController::class);
            Route::apiResource('testimonials', TestimonialAdminController::class);
            Route::apiResource('clients', ClientAdminController::class);
            Route::apiResource('blog-posts', BlogPostAdminController::class);
            Route::apiResource('contact-messages', ContactMessageAdminController::class)->except(['store', 'create']);

            Route::get('/site-settings', [SiteSettingAdminController::class, 'show']);
            Route::put('/site-settings', [SiteSettingAdminController::class, 'update']);
            Route::post('/site-settings', [SiteSettingAdminController::class, 'update']);
        });
    });
});
