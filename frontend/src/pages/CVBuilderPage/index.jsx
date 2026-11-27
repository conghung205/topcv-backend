import { useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCandidateAuth } from "../../stores/useCandidateAuthStore";
import candidateService from "../../services/candidateService";
import Toast from "../../components/ui/toast";
import { Button } from "../../components/ui/button";

// TopCV Authentic Components
import {
    TopCVSidebarNav,
    CVDesignDrawer,
    TopCVStandardTemplate,
} from "../../components/CVBuilder";

import {
    FileText,
    Save,
    Printer,
    ArrowLeft,
    AlertCircle,
    ZoomIn,
    ZoomOut,
} from "lucide-react";

export default function CVBuilderPage() {
    const { isAuthenticated, user } = useCandidateAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const fileInputRef = useRef(null);

    // Sidebar & Drawer State
    const [activeNav, setActiveNav] = useState("design"); // 'design' | null

    // Design & Typography State (from Left Drawer)
    const [language, setLanguage] = useState("vi");
    const [fontFamily, setFontFamily] = useState("Roboto");
    const [fontSize, setFontSize] = useState("13px");
    const [lineHeight, setLineHeight] = useState(1.5);
    const [themeColor, setThemeColor] = useState("#000000");

    // Canvas Zoom
    const [zoomLevel, setZoomLevel] = useState(100);

    // Main CV Data
    const [cvData, setCvData] = useState(() => ({
        full_name: user?.full_name || "",
        title: "",
        email: user?.email || "",
        phone: "",
        dob: "",
        gender: "",
        website: "",
        address: "",
        avatar: "",
        summary: "",
        education: [
            {
                school: "",
                major: "",
                start_date: "",
                end_date: "",
                grade: "",
            },
        ],
        experience: [
            {
                company: "",
                position: "",
                duration: "",
                description: "",
            },
        ],
        activities: [
            {
                organization: "",
                role: "",
                duration: "",
            },
        ],
        skills: "",
        section_titles: {},
        field_labels: {},
        ...(location.state?.editCv || {}),
    }));

    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState(() => ({
        message: location.state?.editCv
            ? "Đã tải dữ liệu CV để tiếp tục chỉnh sửa!"
            : "",
        type: "success",
    }));

    // Handle Upload Avatar
    const handleAvatarFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setToast({
                    message: "Vui lòng chọn ảnh nhỏ hơn 5MB",
                    type: "warning",
                });
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                setCvData((prev) => ({ ...prev, avatar: reader.result }));
                setToast({
                    message: "Đã tải ảnh đại diện thành công!",
                    type: "success",
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerAvatarUpload = () => {
        fileInputRef.current?.click();
    };

    // Save or Update CV to FastAPI Backend / LocalStorage
    const handleSaveCv = async () => {
        if (!isAuthenticated) {
            navigate("/login", { state: { from: { pathname: location.pathname } } });
            setToast({
                message: "Vui lòng đăng nhập để lưu CV của bạn.",
                type: "warning",
            });
            return;
        }

        if (!cvData.full_name.trim()) {
            setToast({
                message: "Vui lòng nhập họ và tên của bạn.",
                type: "error",
            });
            return;
        }

        setIsSaving(true);
        try {
            const payload = {
                full_name: cvData.full_name.trim(),
                phone: cvData.phone.trim(),
                email: cvData.email.trim(),
                summary: cvData.summary,
                education: cvData.education,
                experience: cvData.experience,
                skills: cvData.skills,
            };

            // Gọi API backend POST /candidate/cvs có sẵn
            const res = await candidateService.createCv(
                { ...payload, id: cvData.id },
                user?.id,
            );
            if (res?.cv_id) {
                setCvData((prev) => ({ ...prev, id: res.cv_id }));
            }
            setToast({
                message: "Đã lưu CV thành công",
                type: "success",
            });
        } catch (err) {
            const errorMsg =
                err.response?.data?.detail ||
                err.response?.data?.message ||
                err.message ||
                "Lưu CV thất bại. Vui lòng thử lại.";
            setToast({
                message: errorMsg,
                type: "error",
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-bg-main min-h-screen font-[Roboto,Inter,sans-serif] flex flex-col">
            {/* Hidden Avatar Input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarFileChange}
                accept="image/*"
                className="hidden"
            />

            {/* Print Stylesheet for A4 */}
            <style>{`
                @media print {
                    @page {
                        size: A4;
                        margin: 0;
                    }
                    body {
                        margin: 0 !important;
                        padding: 0 !important;
                        background: #ffffff !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    header, aside, .print\\:hidden {
                        display: none !important;
                    }
                    #cv-canvas-root {
                        width: 210mm !important;
                        min-height: 297mm !important;
                        margin: 0 auto !important;
                        box-shadow: none !important;
                        border: none !important;
                    }
                }
            `}</style>

            {/* Top Bar - TopCV Header */}
            <header className="sticky top-[72px] z-30 bg-white border-b border-gray-200 shadow-2xs print:hidden h-14">
                <div className="max-w-[1600px] mx-auto px-4 h-full flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <Link
                            to="/"
                            className="text-xs font-semibold text-gray-500 hover:text-primary flex items-center gap-1 shrink-0"
                        >
                            <ArrowLeft className="size-3.5" /> Trang chủ
                        </Link>
                        <span className="text-gray-300">|</span>
                        <div className="flex items-center gap-2 min-w-0">
                            <FileText className="size-4 text-primary shrink-0" />
                            <span className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                                Trình Tạo & Chỉnh Sửa CV Chuẩn TopCV
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={() => window.print()}
                            className="h-9 px-3.5 rounded-xl text-xs font-semibold border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer"
                        >
                            <Printer className="size-3.5" /> Tải / In PDF
                        </Button>

                        <Button
                            onClick={handleSaveCv}
                            disabled={isSaving}
                            className="h-9 px-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer"
                        >
                            <Save className="size-3.5" />
                            {isSaving ? "Đang lưu..." : "Lưu CV"}
                        </Button>
                    </div>
                </div>
            </header>

            {!isAuthenticated && (
                <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-900 flex items-center justify-between print:hidden">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="size-4 text-amber-600 shrink-0" />
                        <span>
                            Bạn đang chỉnh sửa trực tiếp.{" "}
                            <strong>Đăng nhập tài khoản</strong> để lưu trữ lâu
                            dài trên hệ thống.
                        </span>
                    </div>
                    <button
                        onClick={() => navigate("/login", { state: { from: { pathname: location.pathname } } })}
                        className="text-xs text-amber-700 font-bold hover:underline cursor-pointer"
                    >
                        Đăng nhập ngay
                    </button>
                </div>
            )}

            {/* Main Editor Body: Sidebar + Drawer + Full Center Canvas */}
            <div className="flex-1 flex overflow-hidden relative">
                {/* Left Slim Sidebar */}
                <TopCVSidebarNav
                    activeNav={activeNav}
                    setActiveNav={setActiveNav}
                />

                {/* Left Drawer: "Thiết kế & Font" */}
                {activeNav === "design" && (
                    <CVDesignDrawer
                        isOpen={true}
                        onClose={() => setActiveNav(null)}
                        language={language}
                        setLanguage={setLanguage}
                        fontFamily={fontFamily}
                        setFontFamily={setFontFamily}
                        fontSize={fontSize}
                        setFontSize={setFontSize}
                        lineHeight={lineHeight}
                        setLineHeight={setLineHeight}
                        themeColor={themeColor}
                        setThemeColor={setThemeColor}
                    />
                )}

                {/* Center Canvas: The A4 Paper Sheet centered in screen */}
                <main className="flex-1 bg-bg-main overflow-y-auto p-4 sm:p-8 flex justify-center items-start relative">
                    <div
                        id="cv-canvas-root"
                        style={{
                            transform: `scale(${zoomLevel / 100})`,
                            transformOrigin: "top center",
                        }}
                        className="transition-transform duration-150"
                    >
                        <TopCVStandardTemplate
                            cvData={cvData}
                            setCvData={setCvData}
                            fontFamily={fontFamily}
                            fontSize={fontSize}
                            lineHeight={lineHeight}
                            themeColor={themeColor}
                            onAvatarUpload={triggerAvatarUpload}
                        />
                    </div>

                    {/* Floating Zoom Bar at Bottom Right (Exact TopCV UI) */}
                    <div className="fixed bottom-6 right-8 bg-white/95 backdrop-blur-xs border border-gray-300 shadow-xl rounded-full px-3 py-1.5 flex items-center gap-2 select-none z-30 print:hidden">
                        <button
                            type="button"
                            onClick={() =>
                                setZoomLevel((z) => Math.max(70, z - 10))
                            }
                            className="p-1 text-gray-500 hover:text-black rounded-full transition cursor-pointer"
                            title="Thu nhỏ"
                        >
                            <ZoomOut className="size-4" />
                        </button>
                        <span className="text-xs font-bold text-gray-800 min-w-9 text-center">
                            {zoomLevel}%
                        </span>
                        <button
                            type="button"
                            onClick={() =>
                                setZoomLevel((z) => Math.min(130, z + 10))
                            }
                            className="p-1 text-gray-500 hover:text-black rounded-full transition cursor-pointer"
                            title="Phóng to"
                        >
                            <ZoomIn className="size-4" />
                        </button>
                    </div>
                </main>
            </div>

            {/* Toast Feedback */}
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
