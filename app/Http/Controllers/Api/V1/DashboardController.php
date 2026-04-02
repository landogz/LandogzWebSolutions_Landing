<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Concerns\ApiResponses;
use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Models\Client;
use App\Models\ContactMessage;
use App\Models\Project;
use App\Models\Service as ServiceModel;
use App\Models\Skill;
use App\Models\TeamMember;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    use ApiResponses;

    public function __invoke(): JsonResponse
    {
        return $this->success([
            'counts' => [
                'projects' => Project::query()->count(),
                'skills' => Skill::query()->count(),
                'team_members' => TeamMember::query()->count(),
                'messages' => ContactMessage::query()->count(),
                'blog_posts' => BlogPost::query()->count(),
                'services' => ServiceModel::query()->count(),
                'clients' => Client::query()->count(),
            ],
            'recent_messages' => ContactMessage::query()
                ->orderByDesc('created_at')
                ->limit(8)
                ->get()
                ->map(fn ($m) => [
                    'id' => $m->id,
                    'name' => $m->name,
                    'email' => $m->email,
                    'subject' => $m->subject,
                    'status' => $m->status,
                    'created_at' => $m->created_at?->toIso8601String(),
                ]),
        ]);
    }
}
