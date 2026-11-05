<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Concerns\ApiResponses;
use App\Http\Controllers\Controller;
use App\Http\Requests\Public\StoreContactMessageRequest;
use App\Mail\ContactMessageReceived;
use App\Models\ContactMessage;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

class ContactPublicController extends Controller
{
    use ApiResponses;

    public function store(StoreContactMessageRequest $request): JsonResponse
    {
        $message = ContactMessage::query()->create($request->validated());

        $adminEmail = $this->resolveAdminEmail();
        if ($adminEmail) {
            try {
                Mail::to($adminEmail)->send(new ContactMessageReceived($message));
            } catch (Throwable $e) {
                Log::error('Contact form mail failed', [
                    'message_id' => $message->id,
                    'to' => $adminEmail,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return $this->success(['id' => $message->id], 'Message sent successfully.', 201);
    }

    private function resolveAdminEmail(): ?string
    {
        $configured = trim((string) config('mail.admin_address'));
        if ($configured !== '' && filter_var($configured, FILTER_VALIDATE_EMAIL)) {
            return $configured;
        }

        $siteEmail = trim((string) optional(SiteSetting::query()->first())->email);
        if ($siteEmail !== '' && filter_var($siteEmail, FILTER_VALIDATE_EMAIL)) {
            return $siteEmail;
        }

        $from = trim((string) config('mail.from.address'));
        if ($from !== '' && filter_var($from, FILTER_VALIDATE_EMAIL)) {
            return $from;
        }

        return null;
    }
}
