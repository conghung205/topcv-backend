import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SearchJobsPage from "./pages/SearchJobsPage";
import JobDetailPage from "./pages/JobDetailPage";
import CVBuilderPage from "./pages/CVBuilderPage";
import AdminCompaniesPage from "./pages/AdminCompaniesPage";
import BestJobsPage from "./pages/BestJobsPage";
import ResourceLandingPage from "./pages/ResourceLandingPage";

import CandidateLoginPage from "./pages/CandidateLoginPage";
import CandidateRegisterPage from "./pages/CandidateRegisterPage";

import EmployerPage from "./pages/EmployerPage";
import EmployerRegisterPage from "./pages/EmployerRegisterPage";
import EmployerLoginPage from "./pages/EmployerLoginPage";
import EmployerPostJobPage from "./pages/EmployerPostJobPage";

import MainLayout from "./components/MainLayout";
import AuthLayout from "./components/Auth/AuthLayout";
import DynamicSlugRoute from "./components/Routing/DynamicSlugRoute";
import ScrollToTop from "./components/Navigation/ScrollToTop";

function App() {
    return (
        <>
            <ScrollToTop />
            <Routes>
                {/* Candidate & Public Portal Layout (With Synchronized Header) */}
                <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/vieclam" element={<HomePage />} />
                <Route path="/viec-lam" element={<HomePage />} />
                <Route path="/tim-viec-lam" element={<SearchJobsPage />} />
                <Route
                    path="/tim-viec-lam/:slug"
                    element={<SearchJobsPage />}
                />
                <Route path="/viec-lam/:slug" element={<JobDetailPage />} />
                <Route path="/jobs/:slug" element={<JobDetailPage />} />
                {/* CV Builder & Template Pages */}
                <Route path="/tao-cv" element={<CVBuilderPage />} />
                <Route path="/tao-cv/*" element={<CVBuilderPage />} />
                <Route path="/cv-builder" element={<CVBuilderPage />} />
                <Route path="/cv-builder/*" element={<CVBuilderPage />} />
                <Route path="/mau-cv" element={<CVBuilderPage />} />
                <Route path="/mau-cv/*" element={<CVBuilderPage />} />

                <Route path="/bo-cau-hoi-phong-van" element={<ResourceLandingPage topic="interview" />} />
                <Route path="/blog/bi-kip-tim-viec" element={<ResourceLandingPage topic="jobSearch" />} />

                {/* Candidates Extra Routes */}
                <Route path="/viec-lam-da-luu" element={<HomePage />} />
                <Route path="/viec-lam-da-ung-tuyen" element={<HomePage />} />
                <Route path="/blog" element={<HomePage />} />
                <Route path="/blog/*" element={<HomePage />} />

                <Route
                    path="/admin/companies"
                    element={<AdminCompaniesPage />}
                />
                <Route path="/companies" element={<AdminCompaniesPage />} />
                <Route path="/viec-lam-tot-nhat" element={<BestJobsPage />} />
                <Route path="/vieclam-tot-nhat" element={<BestJobsPage />} />

                {/* Dynamic Route Handler for /tim-viec-lam-slug, /mau-cv-slug, etc. */}
                <Route path="/:slug" element={<DynamicSlugRoute />} />
                </Route>

                {/* Candidate Dedicated Auth Pages (Separate Layout) */}
                <Route element={<AuthLayout />}>
                <Route path="/login" element={<CandidateLoginPage />} />
                <Route path="/register" element={<CandidateRegisterPage />} />
                <Route path="/candidate/login" element={<CandidateLoginPage />} />
                <Route path="/candidate/register" element={<CandidateRegisterPage />} />
                </Route>

                {/* Employer Portal Routes */}
                <Route path="/employer" element={<EmployerPage />} />
                <Route
                    path="/employer/register"
                    element={<EmployerRegisterPage />}
                />
                <Route path="/employer/login" element={<EmployerLoginPage />} />
                <Route
                    path="/employer/post-job"
                    element={<EmployerPostJobPage />}
                />
                <Route
                    path="/employer/dashboard"
                    element={<EmployerPage defaultTab="dashboard" />}
                />

                {/* Employer Aliases */}
                <Route
                    path="/companies/register"
                    element={<EmployerRegisterPage />}
                />
                <Route path="/companies/login" element={<EmployerLoginPage />} />
                <Route path="/tuyendung" element={<EmployerPage />} />
            </Routes>
        </>
    );
}

export default App;
