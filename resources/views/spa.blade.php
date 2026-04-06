@php
    $siteForIcons = \App\Models\SiteSetting::query()->first();
    $faviconHref = $siteForIcons?->favicon_path
        ? \App\Helpers\MediaHelper::publicUrl($siteForIcons->favicon_path)
        : asset('favicon.svg');
    $faviconExt = $siteForIcons?->favicon_path ? strtolower(pathinfo($siteForIcons->favicon_path, PATHINFO_EXTENSION)) : 'svg';
    $faviconType = match ($faviconExt) {
        'svg' => 'image/svg+xml',
        'png' => 'image/png',
        'ico' => 'image/x-icon',
        'jpg', 'jpeg' => 'image/jpeg',
        'webp' => 'image/webp',
        'gif' => 'image/gif',
        default => null,
    };
    $appleTouchHref = $siteForIcons?->logo_path
        ? \App\Helpers\MediaHelper::publicUrl($siteForIcons->logo_path)
        : null;
    $canonicalHref = \App\Helpers\SeoHelper::canonicalForRequest(
        $siteForIcons?->seo_canonical_base_url,
        config('app.url'),
        request()
    );
@endphp
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ config('app.name', 'Landogz Web Solutions') }}</title>
    @if($canonicalHref)
        <link rel="canonical" href="{{ $canonicalHref }}">
    @endif
    @if(request()->is('admin', 'admin/*'))
        <meta name="robots" content="noindex, nofollow">
    @endif
    <link rel="icon" href="{{ $faviconHref }}" @if($faviconType) type="{{ $faviconType }}" @endif sizes="any">
    @if($appleTouchHref)
        <link rel="apple-touch-icon" href="{{ $appleTouchHref }}">
    @endif
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Syne:wght@600;700;800&display=swap" rel="stylesheet">
    @if(filled(config('services.adsense.client_id')))
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={{ config('services.adsense.client_id') }}" crossorigin="anonymous"></script>
    @endif
    @vite(['resources/js/app.jsx', "resources/css/app.css"])
</head>
<body class="antialiased">
    <div id="app"></div>
</body>
</html>
