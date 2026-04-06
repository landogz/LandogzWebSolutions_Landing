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

Route::view('/', 'spa');

Route::view('/{any}', 'spa')->where('any', '^(?!api(?:/|$)).*');
