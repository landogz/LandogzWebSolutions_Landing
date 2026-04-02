<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Concerns\ApiResponses;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateSiteSettingRequest;
use App\Http\Resources\SiteSettingResource;
use App\Models\SiteSetting;
use App\Services\ImageOptimizationService;
use Illuminate\Http\JsonResponse;

class SiteSettingAdminController extends Controller
{
    use ApiResponses;

    public function __construct(protected ImageOptimizationService $images) {}

    public function show(): JsonResponse
    {
        $s = SiteSetting::query()->first();

        return $this->success($s ? new SiteSettingResource($s) : null);
    }

    public function update(UpdateSiteSettingRequest $request): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('logo')) {
            $data['logo_path'] = $this->images->storeAndOptimize($request->file('logo'), 'site', 800);
        }
        if ($request->hasFile('favicon')) {
            $data['favicon_path'] = $this->images->storeAndOptimize($request->file('favicon'), 'site', 256);
        }
        unset($data['logo'], $data['favicon']);

        if ($request->has('social_links') && is_string($request->input('social_links'))) {
            $decoded = json_decode($request->input('social_links'), true);
            $data['social_links'] = is_array($decoded) ? $decoded : [];
        }
        if ($request->has('seo_per_page') && is_string($request->input('seo_per_page'))) {
            $decoded = json_decode($request->input('seo_per_page'), true);
            $data['seo_per_page'] = is_array($decoded) ? $decoded : [];
        }

        $setting = SiteSetting::query()->firstOrNew([]);

        if (empty($data['company_name'] ?? null)) {
            unset($data['company_name']);
        }
        if (! $setting->exists && empty($data['company_name'] ?? null)) {
            $data['company_name'] = 'Landogz Web Solutions';
        }

        $setting->fill($data);
        $setting->save();

        return $this->success(new SiteSettingResource($setting->fresh()), 'Settings updated.');
    }
}
