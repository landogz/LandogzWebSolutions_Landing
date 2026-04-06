<?php

namespace App\Http\Controllers;

use App\Helpers\SeoHelper;
use Illuminate\Http\Response;

class RobotsController extends Controller
{
    public function __invoke(): Response
    {
        $base = SeoHelper::publicSiteOrigin() ?? rtrim((string) config('app.url'), '/');
        if ($base === '') {
            $base = 'http://localhost';
        }

        $lines = [
            'User-agent: *',
            'Allow: /',
            'Disallow: /admin',
            'Disallow: /api/',
            '',
            'Sitemap: '.$base.'/sitemap.xml',
        ];

        return response(implode("\n", $lines), 200)->header('Content-Type', 'text/plain; charset=UTF-8');
    }
}
