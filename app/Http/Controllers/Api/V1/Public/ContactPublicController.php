<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Concerns\ApiResponses;
use App\Http\Controllers\Controller;
use App\Http\Requests\Public\StoreContactMessageRequest;
use App\Mail\ContactMessageReceived;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;

class ContactPublicController extends Controller
{
    use ApiResponses;

    public function store(StoreContactMessageRequest $request): JsonResponse
    {
        $message = ContactMessage::query()->create($request->validated());

        $adminEmail = config('mail.admin_address', config('mail.from.address'));
        if ($adminEmail) {
            Mail::to($adminEmail)->send(new ContactMessageReceived($message));
        }

        return $this->success(['id' => $message->id], 'Message sent successfully.', 201);
    }
}
