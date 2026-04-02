import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminLayout from '@/pages/admin/AdminLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminHero from '@/pages/admin/AdminHero';
import AdminAbout from '@/pages/admin/AdminAbout';
import AdminSiteSettings from '@/pages/admin/AdminSiteSettings';
import AdminProjects from '@/pages/admin/AdminProjects';
import AdminMessages from '@/pages/admin/AdminMessages';
import AdminServices from '@/pages/admin/AdminServices';
import AdminSkills from '@/pages/admin/AdminSkills';
import AdminTeam from '@/pages/admin/AdminTeam';
import AdminBlog from '@/pages/admin/AdminBlog';
import AdminClients from '@/pages/admin/AdminClients';
import AdminTestimonials from '@/pages/admin/AdminTestimonials';
import AdminAboutStats from '@/pages/admin/AdminAboutStats';
import AdminCompanyValues from '@/pages/admin/AdminCompanyValues';
import AdminCategories from '@/pages/admin/AdminCategories';
import PrivateRoute from '@/components/PrivateRoute';

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
                path="/admin"
                element={
                    <PrivateRoute>
                        <AdminLayout />
                    </PrivateRoute>
                }
            >
                <Route index element={<AdminDashboard />} />
                <Route path="hero" element={<AdminHero />} />
                <Route path="about" element={<AdminAbout />} />
                <Route path="settings" element={<AdminSiteSettings />} />
                <Route path="projects" element={<AdminProjects />} />
                <Route path="messages" element={<AdminMessages />} />
                <Route path="services" element={<AdminServices />} />
                <Route path="skills" element={<AdminSkills />} />
                <Route path="team" element={<AdminTeam />} />
                <Route path="blog" element={<AdminBlog />} />
                <Route path="clients" element={<AdminClients />} />
                <Route path="testimonials" element={<AdminTestimonials />} />
                <Route path="about-stats" element={<AdminAboutStats />} />
                <Route path="company-values" element={<AdminCompanyValues />} />
                <Route path="categories" element={<AdminCategories />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
