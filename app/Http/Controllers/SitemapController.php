<?php

namespace App\Http\Controllers;

use App\Helpers\SeoHelper;
use App\Models\BlogPost;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function __invoke(): Response
    {
        $base = SeoHelper::publicSiteOrigin() ?? rtrim((string) config('app.url'), '/');
        if ($base === '') {
            $base = 'http://localhost';
        }

        $urls = [
            [
                'loc' => $base.'/',
                'lastmod' => now()->toAtomString(),
                'changefreq' => 'weekly',
                'priority' => '1.0',
            ],
        ];

        $posts = BlogPost::query()
            ->published()
            ->orderByDesc('updated_at')
            ->get(['slug', 'updated_at']);

        foreach ($posts as $post) {
            $urls[] = [
                'loc' => $base.'/blog/'.$post->slug,
                'lastmod' => $post->updated_at?->toAtomString() ?? now()->toAtomString(),
                'changefreq' => 'monthly',
                'priority' => '0.7',
            ];
        }

        $xml = view('seo.sitemap', ['urls' => $urls])->render();

        return response($xml, 200)->header('Content-Type', 'application/xml; charset=UTF-8');
    }
}
