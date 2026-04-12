<?php

use App\Http\Controllers\RobotsController;
use App\Http\Controllers\SitemapController;
use Illuminate\Support\Facades\Route;

/*
 * Do not let this catch-all take /api/* — otherwise POST (and other API verbs) hit
 * Route::view (GET-only) and return "405 POST method is not supported".
 */
Route::get('/sitemap.xml', SitemapController::class);
Route::get('/robots.txt', RobotsController::class);

// Legacy paths (old site / bookmarks) → single-page home for Search Console consolidation.
Route::permanentRedirect('/our-team', '/');
Route::permanentRedirect('/our-team/', '/');
Route::permanentRedirect('/portfolio', '/');
Route::permanentRedirect('/portfolio/', '/');

Route::view('/', 'spa');

Route::view('/{any}', 'spa')->where('any', '^(?!api(?:/|$)).*');
