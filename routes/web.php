<?php

use Illuminate\Support\Facades\Route;

/*
 * Do not let this catch-all take /api/* — otherwise POST (and other API verbs) hit
 * Route::view (GET-only) and return "405 POST method is not supported".
 */
Route::view('/', 'spa');

Route::view('/{any}', 'spa')->where('any', '^(?!api(?:/|$)).*');
