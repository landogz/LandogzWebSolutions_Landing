<?php

namespace App\Http\Concerns;

use Illuminate\Http\JsonResponse;

trait ApiResponses
{
    protected function success(mixed $data = null, string $message = 'OK', int $code = 200): JsonResponse
    {
        return response()->json([
            'status' => true,
            'message' => $message,
            'data' => $data,
        ], $code);
    }

    protected function error(string $message, array $errors = [], int $code = 422): JsonResponse
    {
        return response()->json([
            'status' => false,
            'message' => $message,
            'errors' => $errors,
        ], $code);
    }
}
