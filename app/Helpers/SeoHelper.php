<?php

namespace App\Helpers;

use App\Models\SiteSetting;
use Illuminate\Http\Request;

class SeoHelper
{
    /**
     * Canonical site origin (scheme + host, no trailing slash), HTTPS-upgraded on public hosts.
     * Prefer Site Settings "Public site URL", else APP_URL.
     */
    public static function publicSiteOrigin(): ?string
    {
        $site = SiteSetting::query()->first();
        $raw = trim((string) ($site?->seo_canonical_base_url ?: config('app.url')));
        if ($raw === '') {
            return null;
        }

        $base = rtrim($raw, '/');
        if (str_starts_with($base, 'http://') && ! str_contains($base, 'localhost') && ! str_contains($base, '127.0.0.1')) {
            $base = 'https://'.substr($base, strlen('http://'));
        }

        return $base;
    }

    /**
     * Absolute canonical URL for the current request path.
     * Uses Site Settings "Public site URL" when set, otherwise APP_URL.
     * Admin routes return null (do not emit a public canonical for the dashboard).
     */
    public static function canonicalForRequest(?string $seoCanonicalBaseUrl, ?string $appUrl, Request $request): ?string
    {
        if ($request->is('admin') || $request->is('admin/*')) {
            return null;
        }

        $base = trim((string) ($seoCanonicalBaseUrl ?: $appUrl));
        if ($base === '') {
            return null;
        }

        $base = rtrim($base, '/');

        // Prefer HTTPS on public hosts (avoids http/https duplicates in Search Console).
        if (str_starts_with($base, 'http://') && ! str_contains($base, 'localhost') && ! str_contains($base, '127.0.0.1')) {
            $base = 'https://'.substr($base, strlen('http://'));
        }

        $path = trim($request->path(), '/');

        return $path === ''
            ? $base.'/'
            : $base.'/'.$path;
    }
}
