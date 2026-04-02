<?php

namespace App\Http\Resources;

use App\Helpers\MediaHelper;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClientResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'company_name' => $this->company_name,
            'logo_path' => $this->logo_path,
            'logo_url' => MediaHelper::publicUrl($this->logo_path),
            'website_url' => $this->website_url,
            'sort_order' => $this->sort_order,
        ];
    }
}
