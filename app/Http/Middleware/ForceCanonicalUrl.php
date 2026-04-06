<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * 301 redirect to the canonical origin from config('app.url') (scheme + host).
 * Fixes Search Console "Page with redirect" for http://, wrong www/apex, etc.
 */
class ForceCanonicalUrl
{
    public function handle(Request $request, Closure $next): Response
    {
        $shouldForce = app()->environment('production')
            || filter_var(env('FORCE_CANONICAL_REDIRECT', false), FILTER_VALIDATE_BOOLEAN);

        if (! $shouldForce) {
            return $next($request);
        }

        $appUrl = config('app.url');
        if (! is_string($appUrl) || $appUrl === '') {
            return $next($request);
        }

        $canonical = parse_url($appUrl);
        if (! is_array($canonical) || empty($canonical['host'])) {
            return $next($request);
        }

        $canonicalHost = strtolower((string) $canonical['host']);
        if (in_array($canonicalHost, ['localhost', '127.0.0.1', '::1'], true)) {
            return $next($request);
        }

        $scheme = strtolower((string) ($canonical['scheme'] ?? 'https'));
        if (! in_array($scheme, ['http', 'https'], true)) {
            $scheme = 'https';
        }

        $currentHost = strtolower($request->getHost());
        $currentScheme = $request->getScheme();

        if ($currentHost === $canonicalHost && $currentScheme === $scheme) {
            return $next($request);
        }

        $path = $request->getRequestUri();
        $port = $canonical['port'] ?? null;
        $authority = $scheme.'://'.$canonicalHost;
        if ($port !== null && ! (($scheme === 'http' && (int) $port === 80) || ($scheme === 'https' && (int) $port === 443))) {
            $authority .= ':'.$port;
        }

        return redirect()->to($authority.$path, Response::HTTP_MOVED_PERMANENTLY);
    }
}
