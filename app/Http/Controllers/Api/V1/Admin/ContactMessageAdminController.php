<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Concerns\ApiResponses;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateContactMessageRequest;
use App\Http\Resources\ContactMessageResource;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactMessageAdminController extends Controller
{
    use ApiResponses;

    public function index(Request $request): JsonResponse
    {
        $q = ContactMessage::query()->orderByDesc('created_at');

        if ($status = $request->query('status')) {
            $q->where('status', $status);
        }

        $paginator = $q->paginate((int) $request->query('per_page', 20));

        return $this->success([
            'items' => ContactMessageResource::collection($paginator->items()),
            'pagination' => [
                'total' => $paginator->total(),
                'per_page' => $paginator->perPage(),
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
            ],
        ]);
    }

    public function show(ContactMessage $contactMessage): JsonResponse
    {
        return $this->success(new ContactMessageResource($contactMessage));
    }

    public function update(UpdateContactMessageRequest $request, ContactMessage $contactMessage): JsonResponse
    {
        $data = $request->validated();
        if (($data['status'] ?? null) === 'read' && ! $contactMessage->read_at) {
            $data['read_at'] = now();
        }
        if (($data['status'] ?? null) === 'unread') {
            $data['read_at'] = null;
        }
        $contactMessage->update($data);

        return $this->success(new ContactMessageResource($contactMessage->fresh()), 'Message updated.');
    }

    public function destroy(ContactMessage $contactMessage): JsonResponse
    {
        $contactMessage->delete();

        return $this->success(null, 'Message deleted.');
    }
}
