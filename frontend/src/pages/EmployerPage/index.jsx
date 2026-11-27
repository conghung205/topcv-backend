import { useState, useEffect } from "react";
import EmployerHeader from "../../components/Employer/EmployerHeader";
import HeroSection from "../../components/Employer/HeroSection";
import StatsSection from "../../components/Employer/StatsSection";
import FeaturesSection from "../../components/Employer/FeaturesSection";
import PricingSection from "../../components/Employer/PricingSection";
import TestimonialsSection from "../../components/Employer/TestimonialsSection";
import EmployerFooter from "../../components/Employer/EmployerFooter";
import DashboardTab from "./DashboardTab";
import Toast from "../../components/ui/toast";
import { useEmployerAuth } from "../../stores/useEmployerAuthStore";
import { useLocation, useNavigate } from "react-router-dom";

export default function EmployerPage({ defaultTab = "landing" }) {
    const { isAuthenticated } = useEmployerAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(defaultTab);
    const [toast, setToast] = useState({ message: "", type: "success" });

    useEffect(() => {
        if (activeTab !== "landing" || !location.hash) return;

        const sectionId = location.hash.slice(1);
        const frameId = window.requestAnimationFrame(() => {
            document.getElementById(sectionId)?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        });

        return () => window.cancelAnimationFrame(frameId);
    }, [activeTab, location.hash]);

    const handleOpenPostJob = () => {
        if (isAuthenticated) {
            navigate("/employer/post-job");
        } else {
            navigate("/employer/register");
        }
    };

    return (
        <div className="employer-page min-h-screen bg-white text-gray-900 font-[Inter,sans-serif] flex flex-col justify-between">
            {/* Employer Dedicated Navigation */}
            <EmployerHeader
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            {/* Main Content Area */}
            <main className="flex-1">
                {activeTab === "dashboard" && isAuthenticated ? (
                    <DashboardTab onOpenPostJob={handleOpenPostJob} />
                ) : (
                    <>
                        {/* Section 1: Hero Banner with Toppy AI & CV Matching */}
                        <HeroSection />

                        {/* Section 2: Key Metrics & Social Proof */}
                        <StatsSection />

                        {/* Section 3: AI Ecosystem & Features */}
                        <FeaturesSection />

                        {/* Section 4: Transparent Pricing Table */}
                        <PricingSection />

                        {/* Section 5: Customer Reviews & Top Partners */}
                        <TestimonialsSection />
                    </>
                )}
            </main>

            {/* Footer */}
            <EmployerFooter />

            {/* Feedback Toast */}
            {toast.message && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ message: "", type: "success" })}
                />
            )}
        </div>
    );
}
