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

/**
 * Demo / baseline content aligned with Rolan Benavidez Jr. résumé (Senior Web Developer, Landogz Web Solution).
 */
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
            'animated_words' => ['Laravel', 'React', 'WordPress', 'Shopify'],
            'subheading' => 'Full-stack web development from Botolan, Zambales — Laravel APIs, React frontends, WordPress & Shopify builds, and integrations that ship.',
            'cta_primary_text' => 'View Our Work',
            'cta_primary_url' => '#projects',
            'cta_secondary_text' => 'Get In Touch',
            'cta_secondary_url' => '#contact',
            'background_type' => 'gradient',
            'company_tagline' => 'Build. Ship. Scale.',
        ]);

        About::query()->firstOrCreate([], [
            'company_name' => 'Landogz Web Solution',
            'tagline' => 'Laravel · React · WordPress · Shopify',
            'founding_year' => 2018,
            'description' => 'Experienced web developer specializing in advanced web development, UI work, testing, and debugging. We deliver Laravel applications, React + Tailwind experiences, WordPress and Shopify/Liquid storefronts, and solid API integrations for clients worldwide.',
            'mission' => 'Ship reliable software with clear requirements, responsive layouts, and maintainable code — from e‑government tools to e‑commerce.',
            'vision' => 'Trusted engineering for teams that need Laravel expertise, modern frontends, and practical DevOps — local roots in Zambales, remote-first delivery.',
        ]);

        $stats = [
            ['label' => 'Projects Delivered', 'value' => '30+'],
            ['label' => 'Happy Clients', 'value' => '40+'],
            ['label' => 'Years Experience', 'value' => '8+'],
            ['label' => 'Core Team', 'value' => '1'],
        ];
        foreach ($stats as $i => $row) {
            AboutStat::query()->updateOrCreate(
                ['label' => $row['label']],
                ['value' => $row['value'], 'sort_order' => $i]
            );
        }

        $values = [
            ['icon' => '⚡', 'label' => 'Performance & UX', 'description' => 'Responsive layouts, Core Web Vitals focus, and 90+ optimization targets on mobile and desktop where projects allow.'],
            ['icon' => '🧩', 'label' => 'Laravel & APIs', 'description' => 'E‑government systems, ordering flows, attendance, and integrations — structured validation and predictable JSON.'],
            ['icon' => '🛒', 'label' => 'CMS & Commerce', 'description' => 'WordPress, Shopify Liquid, storefront APIs, and custom code when off‑the‑shelf is not enough.'],
        ];
        foreach ($values as $i => $row) {
            CompanyValue::query()->create([...$row, 'sort_order' => $i]);
        }

        $catWeb = ProjectCategory::query()->create([
            'name' => 'Web Applications',
            'slug' => 'web-applications',
            'sort_order' => 0,
        ]);

        $catGov = ProjectCategory::query()->create([
            'name' => 'Government & Education',
            'slug' => 'government-education',
            'sort_order' => 1,
        ]);

        Project::query()->create([
            'project_category_id' => $catGov->id,
            'title' => 'E‑Voting System',
            'slug' => 'e-voting-system-laravel',
            'short_description' => 'Secure voting workflow built with Laravel for organizational elections.',
            'full_description' => 'End‑to‑end voting application: ballot configuration, voter eligibility, and auditable results — aligned with requirements gathered from stakeholders.',
            'tech_stack' => ['Laravel', 'MySQL', 'Blade', 'JavaScript'],
            'client_name' => 'Institutional client',
            'project_url' => null,
            'github_url' => null,
            'duration' => 'Ongoing / phased',
            'is_featured' => true,
            'status' => 'published',
        ]);

        Project::query()->create([
            'project_category_id' => $catWeb->id,
            'title' => 'Ordering System',
            'slug' => 'ordering-system-laravel',
            'short_description' => 'Laravel ordering flow with catalog, cart, and admin fulfillment.',
            'full_description' => 'Custom ordering pipeline with role‑based admin, inventory hooks, and reporting tailored to the client’s operations.',
            'tech_stack' => ['Laravel', 'MySQL', 'JavaScript', 'HTML', 'CSS'],
            'client_name' => 'SMB client',
            'project_url' => null,
            'github_url' => null,
            'duration' => 'Multi‑month',
            'is_featured' => true,
            'status' => 'published',
        ]);

        Project::query()->create([
            'project_category_id' => $catGov->id,
            'title' => 'School Attendance System (RFID + Arduino)',
            'slug' => 'school-attendance-laravel-rfid',
            'short_description' => 'Attendance tracking with Laravel backend and RFID hardware integration.',
            'full_description' => 'Integrated RFID readers with Arduino, feeding attendance events into a Laravel application for schools — dashboards and exports for administrators.',
            'tech_stack' => ['Laravel', 'Arduino', 'RFID', 'MySQL'],
            'client_name' => 'Education client',
            'project_url' => null,
            'github_url' => null,
            'duration' => 'Extended engagement',
            'is_featured' => true,
            'status' => 'published',
        ]);

        Project::query()->create([
            'project_category_id' => $catGov->id,
            'title' => 'Barangay Document System',
            'slug' => 'barangay-document-system-laravel',
            'short_description' => 'Document requests and tracking for local government units.',
            'full_description' => 'Workflow for residents to request barangay certificates and staff to process, approve, and archive documents with audit trails.',
            'tech_stack' => ['Laravel', 'MySQL', 'Blade', 'JavaScript'],
            'client_name' => 'LGUs',
            'project_url' => null,
            'github_url' => null,
            'duration' => 'Phased rollout',
            'is_featured' => false,
            'status' => 'published',
        ]);

        Project::query()->create([
            'project_category_id' => $catGov->id,
            'title' => 'Senior High School Decision Support System',
            'slug' => 'shs-decision-system-laravel',
            'short_description' => 'Decision tooling for SHS tracks and strands using Laravel.',
            'full_description' => 'Guided questionnaires and reporting to help students and advisers align choices with school policies and outcomes.',
            'tech_stack' => ['Laravel', 'MySQL', 'JavaScript'],
            'client_name' => 'Education client',
            'project_url' => null,
            'github_url' => null,
            'duration' => 'Multi‑month',
            'is_featured' => false,
            'status' => 'published',
        ]);

        Project::query()->create([
            'project_category_id' => $catWeb->id,
            'title' => 'Parking System (sensor + Laravel)',
            'slug' => 'parking-system-laravel-arduino',
            'short_description' => 'Parking availability with sensors and Laravel control panel.',
            'full_description' => 'Park sensor integration with Arduino, feeding real‑time occupancy into a Laravel dashboard for operators.',
            'tech_stack' => ['Laravel', 'Arduino', 'MySQL', 'JavaScript'],
            'client_name' => 'Facility client',
            'project_url' => null,
            'github_url' => null,
            'duration' => 'Project‑based',
            'is_featured' => false,
            'status' => 'published',
        ]);

        $services = [
            ['title' => 'Laravel Application Development', 'description' => 'CRMs, government systems, ordering, attendance — validation, queues, and clean layering.'],
            ['title' => 'React & Tailwind Frontends', 'description' => 'SPAs and marketing sites with SCSS/Tailwind, performance‑conscious bundles, and responsive layouts.'],
            ['title' => 'WordPress, Shopify & API Integrations', 'description' => 'Custom themes, Liquid, Storefront APIs, and glue code between platforms and backends.'],
        ];
        foreach ($services as $i => $s) {
            ServiceModel::query()->create([...$s, 'sort_order' => $i, 'icon' => '◆']);
        }

        $skills = [
            ['name' => 'Laravel', 'category' => 'Backend', 'proficiency' => 96],
            ['name' => 'PHP', 'category' => 'Backend', 'proficiency' => 94],
            ['name' => 'React', 'category' => 'Frontend', 'proficiency' => 90],
            ['name' => 'JavaScript', 'category' => 'Frontend', 'proficiency' => 92],
            ['name' => 'HTML / CSS', 'category' => 'Frontend', 'proficiency' => 95],
            ['name' => 'WordPress', 'category' => 'CMS', 'proficiency' => 92],
            ['name' => 'Shopify / Liquid', 'category' => 'CMS', 'proficiency' => 88],
            ['name' => 'API Integration', 'category' => 'Integration', 'proficiency' => 90],
            ['name' => 'CodeIgniter', 'category' => 'Backend', 'proficiency' => 82],
            ['name' => 'VB.NET / C#', 'category' => 'Languages', 'proficiency' => 78],
            ['name' => 'MySQL', 'category' => 'Data', 'proficiency' => 88],
            ['name' => 'Figma / Adobe XD', 'category' => 'Design', 'proficiency' => 80],
        ];
        foreach ($skills as $i => $sk) {
            Skill::query()->create([...$sk, 'sort_order' => $i]);
        }

        TeamMember::query()->create([
            'name' => 'Rolan Benavidez Jr.',
            'position' => 'Owner · Senior Web Developer',
            'bio' => 'Web developer with a background in software programming, QA, and MIS — now focused on Laravel, React, WordPress, and Shopify. Experience spans Subic, remote EU/US clients, and long‑running sports‑tech and full‑stack contracts. Polytechnic College of Botolan (BSIT) and Botolan Community College (ACT). Languages: English, Filipino, Zambal.',
            'social_links' => [
                'linkedin' => '',
                'github' => '',
                'twitter' => '',
            ],
            'sort_order' => 0,
        ]);

        Testimonial::query()->create([
            'client_name' => 'Jordan Lee',
            'company' => 'Remote SaaS team',
            'rating' => 5,
            'message' => 'Rolan delivered a Laravel admin and API on time — clear validation, predictable JSON, and easy handoff to our React app.',
            'status' => 'published',
            'sort_order' => 0,
        ]);

        Testimonial::query()->create([
            'client_name' => 'Samira Okonkwo',
            'company' => 'E‑commerce brand',
            'rating' => 5,
            'message' => 'Shopify Liquid and storefront API work was solid — custom sections behaved exactly as designed on mobile.',
            'status' => 'published',
            'sort_order' => 1,
        ]);

        Testimonial::query()->create([
            'client_name' => 'Chris Patel',
            'company' => 'Local institution',
            'rating' => 5,
            'message' => 'Our document workflow in Laravel replaced spreadsheets. Staff training was straightforward.',
            'status' => 'published',
            'sort_order' => 2,
        ]);

        Testimonial::query()->create([
            'client_name' => 'Drew Coleman',
            'company' => 'Analytics partner',
            'rating' => 5,
            'message' => 'Responsive UI and careful debugging across browsers — production issues were rare after launch.',
            'status' => 'published',
            'sort_order' => 3,
        ]);

        Testimonial::query()->create([
            'client_name' => 'Priya Nand',
            'company' => 'Logistics firm',
            'rating' => 5,
            'message' => 'Integrated third‑party APIs without drama; error handling matched what our mobile team needed.',
            'status' => 'published',
            'sort_order' => 4,
        ]);

        Testimonial::query()->create([
            'client_name' => 'Morgan Ellis',
            'company' => 'Finance startup',
            'rating' => 5,
            'message' => 'Performance work paid off — Lighthouse scores improved meaningfully after optimization passes.',
            'status' => 'published',
            'sort_order' => 5,
        ]);

        Client::query()->create([
            'company_name' => 'Sportsdata',
            'website_url' => 'https://sportsdata.com',
            'sort_order' => 0,
        ]);

        Client::query()->create([
            'company_name' => 'Unwired Web Solutions',
            'website_url' => null,
            'sort_order' => 1,
        ]);

        Client::query()->create([
            'company_name' => 'NerdzPlanet',
            'website_url' => null,
            'sort_order' => 2,
        ]);

        BlogPost::query()->create([
            'title' => 'Why Laravel fits government and school systems',
            'slug' => 'laravel-government-school-systems',
            'category' => 'Engineering',
            'tags' => ['Laravel', 'PHP', 'Architecture'],
            'excerpt' => 'Validation, auth, and maintainable modules when requirements evolve after launch.',
            'content' => '<p>Structured requests, policies, and migrations keep long‑running institutional apps understandable for the next developer.</p>',
            'author' => 'Landogz Web Solution',
            'published_at' => now()->subDays(3),
            'status' => 'published',
        ]);

        BlogPost::query()->create([
            'title' => 'Shopify Liquid and storefront APIs in practice',
            'slug' => 'shopify-liquid-storefront-api',
            'category' => 'Commerce',
            'tags' => ['Shopify', 'Liquid', 'API'],
            'excerpt' => 'When to extend themes vs. build custom apps — a pragmatic split.',
            'content' => '<p>Storefront API shines for headless checkout experiments; Liquid remains the fastest path for merchant‑editable content.</p>',
            'author' => 'Landogz Web Solution',
            'published_at' => now()->subDays(8),
            'status' => 'published',
        ]);

        BlogPost::query()->create([
            'title' => 'React + Tailwind without shipping a bloated bundle',
            'slug' => 'react-tailwind-performance',
            'category' => 'Frontend',
            'tags' => ['React', 'Tailwind', 'Performance'],
            'excerpt' => 'Practical notes on layout stability and keeping interactions smooth on WebKit.',
            'content' => '<p>Measure first, then trim — lazy routes and careful CSS keep landing pages snappy on phones.</p>',
            'author' => 'Landogz Web Solution',
            'published_at' => now()->subDays(14),
            'status' => 'published',
        ]);

        SiteSetting::query()->firstOrCreate([], [
            'company_name' => 'Landogz Web Solution',
            'email' => 'rolan.benavidez@gmail.com',
            'phone' => '+63 938 707 7940',
            'address' => "Tampo, Botolan\nZambales, Philippines",
            'maps_embed_url' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3853962!2d119.99!3d15.65!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33946b5b5b5b5b5b%3A0x5b5b5b5b5b5b5b5b!2sBotolan%2C%20Zambales!5e0!3m2!1sen!2sph!4v1',
            'social_links' => [
                'twitter' => '',
                'linkedin' => '',
                'github' => '',
            ],
            'footer_text' => '© '.date('Y').' Landogz Web Solution. All rights reserved.',
            'seo_default_title' => 'Landogz Web Solution | Laravel · React · WordPress · Shopify',
            'seo_default_description' => 'Senior web developer in Botolan, Zambales — Laravel, React, WordPress, Shopify, and API integrations for clients worldwide.',
            'seo_default_keywords' => 'laravel developer philippines, react developer, wordpress, shopify, zambales, remote web developer',
            'seo_robots' => 'index, follow',
        ]);

        ContactMessage::query()->create([
            'name' => 'Demo inquiry',
            'email' => 'demo@example.com',
            'subject' => 'Project inquiry',
            'message' => 'We are looking for Laravel + React help on a new product.',
            'status' => 'unread',
        ]);
    }
}
