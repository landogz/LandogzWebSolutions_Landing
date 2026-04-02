<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;

class ImageOptimizationService
{
    public function storeAndOptimize(UploadedFile $file, string $directory, int $maxWidth = 1920): string
    {
        $path = $file->store($directory, 'public');
        $absolute = Storage::disk('public')->path($path);

        Image::decodePath($absolute)
            ->scaleDown(width: $maxWidth)
            ->save($absolute);

        return $path;
    }

    /**
     * @param  array<int, UploadedFile>  $files
     * @return array<int, string>
     */
    public function storeGallery(array $files, string $directory): array
    {
        $paths = [];
        foreach ($files as $file) {
            if ($file instanceof UploadedFile) {
                $paths[] = $this->storeAndOptimize($file, $directory);
            }
        }

        return $paths;
    }

    public function delete(?string $path): void
    {
        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }
}
