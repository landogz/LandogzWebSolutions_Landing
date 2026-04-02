<?php

namespace Database\Seeders;

use App\Models\About;
use App\Models\AboutStat;
use App\Models\BlogPost;
use App\Models\Client;
use App\Models\CompanyValue;
use App\Models\ContactMessage;
use App\Models\HeroSetting;
use App\Models\Project;
use App\Models\ProjectCategory;
use App\Models\Service as ServiceModel;
use App\Models\SiteSetting;
use App\Models\Skill;
use App\Models\TeamMember;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Database\Seeder;

class LandogzSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => 'admin@landogz.test'],
            [
                'name' => 'Super Admin',
                'password' => 'password',
                'role' => 'super_admin',
            ]
        );

        HeroSetting::query()->firstOrCreate([], [
            'headline' => "Landogz\nWeb Solutions",
            'animated_words' => ['Websites', 'APIs', 'SPAs', 'Mobile-ready'],
            'subheading' => 'Premium Laravel & React development for businesses that need reliability, speed, and a flawless user experience.',
            'cta_primary_text' => 'View Our Work',
            'cta_primary_url' => '#projects',
            'cta_secondary_text' => 'Get In Touch',
            'cta_secondary_url' => '#contact',
            'background_type' => 'gradient',
            'company_tagline' => 'Build. Ship. Scale.',
        ]);

        About::query()->firstOrCreate([], [
            'company_name' => 'Landogz Web Solutions',
            'tagline' => 'Enterprise-grade web craftsmanship',
            'founding_year' => 2018,
            'description' => 'We partner with teams to ship API-first Laravel backends and polished React frontends — optimized for performance, security, and long-term maintainability.',
            'mission' => 'Deliver robust digital products with clarity, precision, and measurable business impact.',
            'vision' => 'To be the trusted engineering partner for ambitious product teams worldwide.',
        ]);

        // Canonical demo stats — updateOrCreate by label so re-seeding syncs values (no duplicate rows).
        $stats = [
            ['label' => 'Projects Delivered', 'value' => '120+'],
            ['label' => 'Happy Clients', 'value' => '85+'],
            ['label' => 'Years Experience', 'value' => '8+'],
            ['label' => 'Team Members', 'value' => '12'],
        ];
        foreach ($stats as $i => $row) {
            AboutStat::query()->updateOrCreate(
                ['label' => $row['label']],
                ['value' => $row['value'], 'sort_order' => $i]
            );
        }

        $values = [
            ['icon' => '⚡', 'label' => 'Performance', 'description' => 'Sub-second APIs, optimized assets, and caching where it matters.'],
            ['icon' => '🛡️', 'label' => 'Security', 'description' => 'Sanctum, validation, encryption, and audit-ready patterns.'],
            ['icon' => '📱', 'label' => 'Responsive', 'description' => 'Mobile-first layouts tested on real devices and Safari.'],
        ];
        foreach ($values as $i => $row) {
            CompanyValue::query()->create([...$row, 'sort_order' => $i]);
        }

        $catWeb = ProjectCategory::query()->create([
            'name' => 'Web Applications',
            'slug' => 'web-applications',
            'sort_order' => 0,
        ]);

        Project::query()->create([
            'project_category_id' => $catWeb->id,
            'title' => 'Enterprise CRM Portal',
            'slug' => 'enterprise-crm-portal',
            'short_description' => 'Laravel API + React SPA with role-based access and audit logs.',
            'full_description' => 'A full rebuild of a legacy CRM into a modern SPA backed by Laravel. Includes queue workers, notifications, and reporting exports.',
            'tech_stack' => ['Laravel', 'React', 'MySQL', 'Redis'],
            'client_name' => 'Meridian Health Systems',
            'project_url' => 'https://example.com',
            'github_url' => null,
            'duration' => '6 months',
            'is_featured' => true,
            'status' => 'published',
        ]);

        Project::query()->create([
            'project_category_id' => $catWeb->id,
            'title' => 'Analytics Dashboard',
            'slug' => 'analytics-dashboard',
            'short_description' => 'Real-time charts with server-side aggregation.',
            'full_description' => 'High-volume ingestion pipeline with cached aggregates and exportable CSV.',
            'tech_stack' => ['Laravel', 'React', 'Tailwind'],
            'client_name' => 'Northwind',
            'project_url' => null,
            'github_url' => 'https://github.com',
            'duration' => '3 months',
            'is_featured' => false,
            'status' => 'published',
        ]);

        Project::query()->create([
            'project_category_id' => $catWeb->id,
            'title' => 'Commerce Mobile API',
            'slug' => 'commerce-mobile-api',
            'short_description' => 'Sanctum tokens, idempotent checkouts, and webhook integrations.',
            'full_description' => 'Headless commerce layer powering iOS/Android clients with rate-limited APIs and observability hooks.',
            'tech_stack' => ['Laravel', 'Redis', 'MySQL', 'Sanctum'],
            'client_name' => 'Globex Retail',
            'project_url' => 'https://example.com',
            'github_url' => null,
            'duration' => '4 months',
            'is_featured' => true,
            'status' => 'published',
        ]);

        $services = [
            ['title' => 'Laravel API Development', 'description' => 'RESTful APIs, Sanctum auth, queues, and clean architecture.'],
            ['title' => 'React SPAs', 'description' => 'Vite, React Router, Zustand, and production UX polish.'],
            ['title' => 'DevOps & Hosting', 'description' => 'CI/CD, Docker, monitoring, and zero-downtime deploys.'],
        ];
        foreach ($services as $i => $s) {
            ServiceModel::query()->create([...$s, 'sort_order' => $i, 'icon' => '◆']);
        }

        $skills = [
            ['name' => 'Laravel', 'category' => 'Backend', 'proficiency' => 95],
            ['name' => 'React', 'category' => 'Frontend', 'proficiency' => 95],
            ['name' => 'Tailwind CSS', 'category' => 'Frontend', 'proficiency' => 90],
            ['name' => 'MySQL', 'category' => 'Data', 'proficiency' => 88],
            ['name' => 'Docker', 'category' => 'DevOps', 'proficiency' => 82],
        ];
        foreach ($skills as $i => $sk) {
            Skill::query()->create([...$sk, 'sort_order' => $i]);
        }

        TeamMember::query()->create([
            'name' => 'Alex Rivera',
            'position' => 'Lead Engineer',
            'bio' => 'Full-stack architect focused on API design and scalable frontends.',
            'social_links' => ['linkedin' => 'https://linkedin.com', 'github' => 'https://github.com'],
            'sort_order' => 0,
        ]);

        TeamMember::query()->create([
            'name' => 'Jordan Kim',
            'position' => 'Frontend Lead',
            'bio' => 'React, performance, and design systems — shipping interfaces that feel instant on every device.',
            'social_links' => ['linkedin' => 'https://linkedin.com', 'github' => 'https://github.com'],
            'sort_order' => 1,
        ]);

        TeamMember::query()->create([
            'name' => 'Sam Patel',
            'position' => 'DevOps & Platform',
            'bio' => 'CI/CD, observability, and cloud infrastructure so releases stay boring in the best way.',
            'social_links' => ['linkedin' => 'https://linkedin.com', 'github' => 'https://github.com'],
            'sort_order' => 2,
        ]);

        Testimonial::query()->create([
            'client_name' => 'Jordan Lee',
            'company' => 'Brightwave',
            'rating' => 5,
            'message' => 'Landogz shipped our portal ahead of schedule. Communication was excellent and the codebase is clean.',
            'status' => 'published',
            'sort_order' => 0,
        ]);

        Testimonial::query()->create([
            'client_name' => 'Samira Okonkwo',
            'company' => 'Northwind Analytics',
            'rating' => 5,
            'message' => 'Their API design is disciplined — predictable JSON, solid validation, and docs that match reality.',
            'status' => 'published',
            'sort_order' => 1,
        ]);

        Testimonial::query()->create([
            'client_name' => 'Chris Patel',
            'company' => 'Globex Retail',
            'rating' => 5,
            'message' => 'We went from fragile scripts to a maintainable Laravel stack. Performance and DX both improved.',
            'status' => 'published',
            'sort_order' => 2,
        ]);

        Testimonial::query()->create([
            'client_name' => 'Drew Coleman',
            'company' => 'Meridian Health Systems',
            'rating' => 5,
            'message' => 'Clear milestones, strong Laravel discipline, and a frontend that our clinical staff actually enjoy using every day.',
            'status' => 'published',
            'sort_order' => 3,
        ]);

        Testimonial::query()->create([
            'client_name' => 'Priya Nand',
            'company' => 'Coastal Logistics Partners',
            'rating' => 5,
            'message' => 'They treated our mobile API like a product: versioning, docs, and error shapes we could hand straight to our app team.',
            'status' => 'published',
            'sort_order' => 4,
        ]);

        Testimonial::query()->create([
            'client_name' => 'Morgan Ellis',
            'company' => 'Harborline Finance',
            'rating' => 5,
            'message' => 'Security reviews went smoothly — clear boundaries between admin and client apps, and logging we could actually trace in production.',
            'status' => 'published',
            'sort_order' => 5,
        ]);

        Client::query()->create([
            'company_name' => 'Brightwave',
            'website_url' => 'https://example.com',
            'sort_order' => 0,
        ]);

        Client::query()->create([
            'company_name' => 'Northwind Analytics',
            'website_url' => 'https://example.com',
            'sort_order' => 1,
        ]);

        Client::query()->create([
            'company_name' => 'Globex Retail',
            'website_url' => 'https://example.com',
            'sort_order' => 2,
        ]);

        BlogPost::query()->create([
            'title' => 'Why we build API-first Laravel apps',
            'slug' => 'why-api-first-laravel',
            'category' => 'Engineering',
            'tags' => ['Laravel', 'API'],
            'excerpt' => 'A short take on service layers, repositories, and predictable JSON contracts.',
            'content' => '<p>API-first design keeps your web and mobile clients aligned on one source of truth.</p>',
            'author' => 'Landogz Team',
            'published_at' => now()->subDays(3),
            'status' => 'published',
        ]);

        BlogPost::query()->create([
            'title' => 'React SPAs that feel fast on Safari',
            'slug' => 'react-spas-safari',
            'category' => 'Frontend',
            'tags' => ['React', 'Safari', 'Performance'],
            'excerpt' => 'Practical notes on layout, flex pitfalls, and keeping interactions smooth on WebKit.',
            'content' => '<p>Mobile Safari rewards careful CSS and modest JS bundles — here is what we measure first.</p>',
            'author' => 'Landogz Team',
            'published_at' => now()->subDays(8),
            'status' => 'published',
        ]);

        BlogPost::query()->create([
            'title' => 'Sanctum patterns we use in production',
            'slug' => 'sanctum-production-patterns',
            'category' => 'Security',
            'tags' => ['Laravel', 'Sanctum'],
            'excerpt' => 'Token abilities, rotation, and separating admin from public surfaces.',
            'content' => '<p>Token-based auth stays simple when boundaries between apps and domains are explicit.</p>',
            'author' => 'Landogz Team',
            'published_at' => now()->subDays(14),
            'status' => 'published',
        ]);

        SiteSetting::query()->firstOrCreate([], [
            'company_name' => 'Landogz Web Solutions',
            'email' => 'hello@landogz.test',
            'phone' => '+1 (555) 010-2030',
            'address' => "123 Market Street\nSan Francisco, CA",
            'maps_embed_url' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0!2d-122.4!3d37.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDQ4JzAwLjAiTiAxMjLCsDI0JzAwLjAiVw!5e0!3m2!1sen!2sus!4v1',
            'social_links' => [
                'twitter' => 'https://twitter.com',
                'linkedin' => 'https://linkedin.com',
                'github' => 'https://github.com',
            ],
            'footer_text' => '© '.date('Y').' Landogz Web Solutions. All rights reserved.',
            'seo_default_title' => 'Landogz Web Solutions',
            'seo_default_description' => 'Laravel API + React SPA development for modern businesses.',
            'seo_default_keywords' => 'laravel, react, web development, api agency',
        ]);

        ContactMessage::query()->create([
            'name' => 'Demo User',
            'email' => 'demo@example.com',
            'subject' => 'Project inquiry',
            'message' => 'We are looking for a Laravel partner for a 6-month engagement.',
            'status' => 'unread',
        ]);
    }
}
