import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { Button } from "@/components/ui/button";
import DesktopNavbar from "./DesktopNavbar";
import MobileMenu from "./MobileMenu";
import { useCandidateAuth } from "../../stores/useCandidateAuthStore";
import {
    LogOut,
    FileText,
    Briefcase,
    ShieldCheck,
} from "lucide-react";

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, user, logout } = useCandidateAuth();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isSearchHeaderHidden, setIsSearchHeaderHidden] = useState(false);
    const menuRef = useRef(null);
    const isSearchPage = location.pathname === "/viec-lam" || location.pathname.startsWith("/tim-viec-lam");

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsProfileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (!isSearchPage) {
            return undefined;
        }

        let previousScrollY = window.scrollY;
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setIsSearchHeaderHidden(currentScrollY > previousScrollY && currentScrollY > 72);
            previousScrollY = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isSearchPage]);

    return (
        <>
            <header className={`fixed inset-x-0 top-0 z-40 transition-transform duration-300 ${isSearchPage && isSearchHeaderHidden ? "-translate-y-full" : "translate-y-0"}`}>
                <div className="flex h-[72px] items-center justify-between border-b border-border bg-white">
                    <div className="flex h-full w-full items-center justify-between px-6">
                        <div className="flex h-full flex-1 items-center gap-5">
                            <div className="xl:hidden">
                                <MobileMenu />
                            </div>
                            <Link to="/" className="h-full flex items-center">
                                <img
                            src={logo}
                                    alt="TopCV"
                                    className="h-9 w-auto"
                                />
                            </Link>

                            <div className="hidden xl:block">
                                <DesktopNavbar />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {isAuthenticated ? (
                                <div className="relative" ref={menuRef}>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsProfileMenuOpen(
                                                !isProfileMenuOpen,
                                            )
                                        }
                                        title={user?.full_name || "Ứng viên"}
                                        className="size-9 rounded-full bg-gradient-to-tr from-[#00b14f] to-teal-500 text-white flex items-center justify-center font-bold text-sm shadow-xs ring-2 ring-emerald-500/20 hover:ring-emerald-500/50 transition cursor-pointer"
                                    >
                                        {user?.full_name
                                            ? user.full_name
                                                  .charAt(0)
                                                  .toUpperCase()
                                            : "U"}
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isProfileMenuOpen && (
                                        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 text-xs text-gray-700 animate-in fade-in slide-in-from-top-2 duration-150">
                                            <div className="px-4 py-2 border-b border-gray-100">
                                                <p className="font-bold text-gray-900 truncate">
                                                    {user?.full_name ||
                                                        "Ứng viên"}
                                                </p>
                                                <p className="text-[11px] text-gray-400 truncate">
                                                    {user?.email}
                                                </p>
                                            </div>

                                            <div className="py-1">
                                                <Link
                                                    to="/tao-cv"
                                                    onClick={() =>
                                                        setIsProfileMenuOpen(
                                                            false,
                                                        )
                                                    }
                                                    className="flex items-center gap-2.5 px-4 py-2 hover:bg-emerald-50 hover:text-emerald-700 transition"
                                                >
                                                    <FileText className="size-4 text-emerald-600" />
                                                    <span className="font-medium">
                                                        Tạo CV mới
                                                    </span>
                                                </Link>

                                                <Link
                                                    to="/viec-lam"
                                                    onClick={() =>
                                                        setIsProfileMenuOpen(
                                                            false,
                                                        )
                                                    }
                                                    className="flex items-center gap-2.5 px-4 py-2 hover:bg-emerald-50 hover:text-emerald-700 transition"
                                                >
                                                    <Briefcase className="size-4 text-emerald-600" />
                                                    <span className="font-medium">
                                                        Tìm việc làm
                                                    </span>
                                                </Link>

                                                <Link
                                                    to="/admin/companies"
                                                    onClick={() =>
                                                        setIsProfileMenuOpen(
                                                            false,
                                                        )
                                                    }
                                                    className="flex items-center gap-2.5 px-4 py-2 hover:bg-emerald-50 hover:text-emerald-700 transition"
                                                >
                                                    <ShieldCheck className="size-4 text-blue-600" />
                                                    <span className="font-medium">
                                                        Admin: DS Công ty
                                                    </span>
                                                </Link>
                                            </div>

                                            <div className="border-t border-gray-100 pt-1">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsProfileMenuOpen(
                                                            false,
                                                        );
                                                        logout();
                                                    }}
                                                    className="w-full flex items-center gap-2.5 px-4 py-2 text-red-600 hover:bg-red-50 transition cursor-pointer text-left font-medium"
                                                >
                                                    <LogOut className="size-4" />
                                                    <span>Đăng xuất</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <Button
                                        variant="outline"
                                        onClick={() => navigate("/register")}
                                        className="hidden px-3.5 h-9 hover:text-primary border-primary text-primary hover:bg-[rgba(21,183,93,0.09)] xl:block cursor-pointer font-medium"
                                    >
                                        Đăng ký
                                    </Button>

                                    <Button
                                        onClick={() => navigate("/login")}
                                        className="text-xs px-3.5 h-9 lg:text-sm bg-primary hover:bg-primary/90 text-white cursor-pointer font-medium"
                                    >
                                        Đăng nhập
                                    </Button>
                                </>
                            )}

                            <Button
                                variant="ghost"
                                onClick={() => navigate("/employer")}
                                className="hidden bg-bg-main px-3.5 h-9 text-text hover:bg-bg-text-hover xl:block cursor-pointer font-medium"
                            >
                                Đăng tuyển & tìm hồ sơ
                            </Button>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}
