import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { Button } from "../ui/button";
import { useEmployerAuth } from "../../stores/useEmployerAuthStore";
import {
    PhoneCall,
    PlusCircle,
    UserCheck,
    LogOut,
    Building2,
    LayoutDashboard,
    ChevronDown,
    Sparkles,
    ArrowRightLeft,
} from "lucide-react";

export default function EmployerHeader() {
    const { isAuthenticated, company, logout } = useEmployerAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [currentHash, setCurrentHash] = useState(
        () => window.location.hash || "",
    );
    const navigate = useNavigate();

    useEffect(() => {
        const handleHashChange = () => {
            setCurrentHash(window.location.hash || "");
        };
        window.addEventListener("hashchange", handleHashChange);
        return () => window.removeEventListener("hashchange", handleHashChange);
    }, []);

    const handleLogout = async () => {
        await logout();
        setDropdownOpen(false);
        navigate("/employer");
    };

    const handlePostJobClick = () => {
        if (isAuthenticated) {
            navigate("/employer/post-job");
        } else {
            navigate("/employer/register");
        }
    };

    const handleSectionNavigate = (hash) => {
        setCurrentHash(hash);
        navigate(`/employer${hash}`);
    };

    return (
        <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs transition-all">
            {/* Top Bar for Switch to Candidate Portal */}
            <div className="bg-[#002b33] text-gray-300 text-xs py-1.5 px-6 hidden sm:block">
                <div className="max-w-[1240px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                            <Sparkles className="size-3.5" /> Hệ sinh thái Tuyển
                            dụng & Đánh giá nhân sự TopCV
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            to="/"
                            className="text-gray-300 hover:text-emerald-400 font-medium flex items-center gap-1 transition"
                        >
                            <ArrowRightLeft className="size-3" /> Chuyển sang
                            Cổng Ứng viên (Tìm việc & Tạo CV)
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Header Bar */}
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between gap-4">
                {/* Brand Logo & Recruiter Tag */}
                <div className="flex items-center gap-6">
                    <Link to="/employer" className="flex items-center gap-2.5">
                        <img
                            src={logo}
                            alt="TopCV"
                            className="h-8 sm:h-9 w-auto object-contain"
                        />
                    </Link>

                    {/* Nav Links with active hash indicator */}
                    <nav className="hidden xl:flex items-center gap-6 text-sm font-medium">
                        <a
                            href="#home"
                            onClick={(event) => {
                                event.preventDefault();
                                handleSectionNavigate("#home");
                            }}
                            className={`transition-colors ${
                                !currentHash ||
                                currentHash === "#home" ||
                                currentHash === "#"
                                    ? "text-primary font-bold"
                                    : "text-text hover:text-primary"
                            }`}
                        >
                            Home
                        </a>
                        <a
                            href="#services"
                            onClick={(event) => {
                                event.preventDefault();
                                handleSectionNavigate("#services");
                            }}
                            className={`transition-colors ${
                                currentHash === "#services"
                                    ? "text-primary font-bold"
                                    : "text-text hover:text-primary"
                            }`}
                        >
                            Dịch vụ
                        </a>
                        <a
                            href="#pricing"
                            onClick={(event) => {
                                event.preventDefault();
                                handleSectionNavigate("#pricing");
                            }}
                            className={`transition-colors ${
                                currentHash === "#pricing"
                                    ? "text-primary font-bold"
                                    : "text-text hover:text-primary"
                            }`}
                        >
                            Báo giá
                        </a>
                    </nav>
                </div>

                {/* Right Action Elements */}
                <div className="flex items-center gap-3 sm:gap-4">
                    {/* Hotline */}
                    <a
                        href="tel:02466805588"
                        className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-primary hover:opacity-90 bg-[#15b75d]/10 px-3 py-2 rounded-full border border-primary/20 transition"
                    >
                        <PhoneCall className="size-3.5 text-primary" />
                        <span>Tư vấn tuyển dụng</span>
                    </a>

                    {/* Conditional Auth Actions */}
                    {!isAuthenticated ? (
                        <div className="flex items-center gap-2.5">
                            <Button
                                variant="outline"
                                onClick={() => navigate("/employer/login")}
                                className="h-9 px-4 text-xs sm:text-sm font-semibold border-border text-text hover:bg-bg-main hover:text-primary rounded-xl cursor-pointer"
                            >
                                Đăng nhập
                            </Button>

                            <Button
                                onClick={handlePostJobClick}
                                className="h-9 px-4 text-xs sm:text-sm font-semibold bg-primary hover:opacity-90 text-white rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                            >
                                <PlusCircle className="size-4" />
                                <span>Đăng tin ngay</span>
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            {/* Create Job Button */}
                            <Button
                                onClick={() => navigate("/employer/post-job")}
                                className="h-9 px-3.5 text-xs sm:text-sm font-semibold bg-primary hover:opacity-90 text-white rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                            >
                                <PlusCircle className="size-4" />
                                <span>Đăng tin</span>
                            </Button>

                            {/* Company Profile Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() =>
                                        setDropdownOpen(!dropdownOpen)
                                    }
                                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-white text-xs font-semibold text-gray-800 transition cursor-pointer"
                                >
                                    <div className="size-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                                        <Building2 className="size-3.5" />
                                    </div>
                                    <span className="max-w-[110px] truncate text-left">
                                        {company?.company_name || company?.email || "Tài khoản"}
                                    </span>
                                    <ChevronDown className="size-3 text-gray-400" />
                                </button>

                                {dropdownOpen && (
                                    <div
                                        className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 text-xs"
                                        onMouseLeave={() =>
                                            setDropdownOpen(false)
                                        }
                                    >
                                        <div className="px-3 py-2 border-b border-gray-100 mb-1">
                                            <p className="font-bold text-gray-900 truncate">
                                                {company?.company_name}
                                            </p>
                                            <p className="text-[11px] text-gray-400 truncate">
                                                {company?.email}
                                            </p>
                                            {company?.verification_tier && (
                                                <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                                                    <UserCheck className="size-3" /> {company.verification_tier}
                                                </span>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => {
                                                navigate("/employer/dashboard");
                                                setDropdownOpen(false);
                                            }}
                                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 font-medium flex items-center gap-2 text-gray-700 cursor-pointer"
                                        >
                                            <LayoutDashboard className="size-3.5" />{" "}
                                            Quản lý tin tuyển dụng
                                        </button>

                                        <button
                                            onClick={() => {
                                                navigate("/employer/post-job");
                                                setDropdownOpen(false);
                                            }}
                                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 font-medium flex items-center gap-2 text-gray-700 cursor-pointer"
                                        >
                                            <PlusCircle className="size-3.5" />{" "}
                                            Tạo tin tuyển dụng mới
                                        </button>

                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 font-medium flex items-center gap-2 mt-1 border-t border-gray-100 cursor-pointer"
                                        >
                                            <LogOut className="size-3.5" /> Đăng
                                            xuất
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
