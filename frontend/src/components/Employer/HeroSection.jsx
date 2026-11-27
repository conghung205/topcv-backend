import { useNavigate } from "react-router-dom";
import { useEmployerAuth } from "../../stores/useEmployerAuthStore";
import logo from "../../assets/images/logo.png";
import { Phone, Mail, Bot } from "lucide-react";

export default function HeroSection() {
    const { isAuthenticated } = useEmployerAuth();
    const navigate = useNavigate();
    const handleAction = () => {
        if (isAuthenticated) {
            navigate("/employer/post-job");
        } else {
            navigate("/employer/register");
        }
    };

    return (
        <section id="home" className="relative overflow-hidden bg-gradient-to-b from-white via-emerald-50/30 to-[#f0fdf4] pt-8 pb-16 lg:pt-14 lg:pb-24 font-[Inter,sans-serif]">
            {/* Background Decorative Grids / Blurs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none opacity-40">
                <div className="absolute top-10 left-10 size-72 bg-emerald-300/30 rounded-full blur-3xl" />
                <div className="absolute top-20 right-10 size-80 bg-teal-300/30 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6">
                {/* Main Hero Headlines */}
                <div className="text-center max-w-3xl mx-auto mb-8 lg:mb-10">
                    <h1 className="text-2xl sm:text-[26px] lg:text-[30px] font-black tracking-tight text-[#1b2533] leading-tight mb-2">
                        Đăng tin tuyển dụng miễn phí
                    </h1>
                    <h2 className="text-xl sm:text-2xl lg:text-[26px] font-black tracking-tight text-primary leading-tight mb-6">
                        Tiếp cận hàng triệu ứng viên đang tìm việc
                    </h2>

                    {/* Action CTA Buttons */}
                    <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-5">
                        <a
                            href="tel:02466805588"
                            className="px-7 py-3.5 rounded-full bg-[#243048] hover:bg-[#182132] text-white font-bold text-sm shadow-md transition transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                            Tư vấn tuyển dụng
                        </a>
                        <button
                            type="button"
                            onClick={handleAction}
                            className="px-7 py-3.5 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                        >
                            Trải nghiệm ngay
                        </button>
                    </div>
                </div>

                {/* Hero Rich Illustration / Composite Interactive Canvas */}
                <div className="relative max-w-[1020px] mx-auto min-h-[420px] lg:min-h-[490px] rounded-3xl bg-gradient-to-b from-white/90 to-emerald-50/80 border border-emerald-100/80 shadow-2xl shadow-emerald-900/5 p-4 sm:p-8 flex flex-col justify-end overflow-hidden">
                    {/* Office Window Grid Background Effect */}
                    <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 gap-0 opacity-15 pointer-events-none">
                        {Array.from({ length: 24 }).map((_, i) => (
                            <div key={i} className="border-r border-b border-emerald-800" />
                        ))}
                    </div>

                    {/* Ambient Glows */}
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[700px] h-32 bg-emerald-400/20 blur-2xl rounded-full" />

                    {/* Left: CV Printer Machine Component */}
                    <div className="hidden md:flex absolute left-4 lg:left-8 bottom-6 flex-col items-center z-10">
                        <div className="relative w-36 lg:w-44 bg-white rounded-2xl border-2 border-emerald-200 shadow-xl p-3 flex flex-col items-center">
                            <div className="w-full h-4 bg-emerald-600 rounded-t-lg mb-2 flex items-center justify-between px-2">
                                <span className="size-1.5 rounded-full bg-white" />
                                <span className="size-1.5 rounded-full bg-emerald-300 animate-ping" />
                            </div>
                            <div className="w-full bg-emerald-50 rounded-lg p-2 border border-emerald-100 text-center">
                                <span className="text-[10px] font-bold text-emerald-800 uppercase block">TopCV ATS Scanner</span>
                                <div className="mt-1 h-1.5 w-full bg-emerald-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-3/4 animate-pulse" />
                                </div>
                            </div>
                            <div className="w-full h-8 bg-gray-100 rounded-b-lg mt-2 flex items-center justify-center border-t border-gray-200">
                                <span className="text-[9px] text-gray-400 font-medium">5.4M+ CVs In Database</span>
                            </div>

                            {/* Stacks of floating CV cards */}
                            <div className="absolute -top-12 -right-4 size-16 bg-white border border-emerald-200 rounded-lg shadow-md rotate-12 p-1.5 flex flex-col justify-between">
                                <div className="flex items-center gap-1">
                                    <div className="size-3 rounded-full bg-emerald-500" />
                                    <div className="h-1.5 w-8 bg-gray-200 rounded" />
                                </div>
                                <div className="space-y-1">
                                    <div className="h-1 w-full bg-gray-100 rounded" />
                                    <div className="h-1 w-4/5 bg-gray-100 rounded" />
                                </div>
                                <span className="text-[8px] font-bold text-emerald-600">CV Đã Duyệt</span>
                            </div>
                        </div>
                    </div>

                    {/* Center: Toppy AI Robot Mascot at Desk */}
                    <div className="relative z-10 mx-auto flex flex-col items-center mb-2">
                        {/* Flying CVs toward Robot */}
                        <div className="absolute -top-10 -left-16 hidden lg:flex items-center gap-1.5 bg-white/95 px-3 py-1.5 rounded-xl shadow-lg border border-emerald-100 -rotate-6 animate-bounce duration-1000">
                            <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
                            <span className="text-xs font-bold text-gray-800">CV Ứng tuyển mới</span>
                        </div>

                        {/* Robot Mascot SVG / Canvas */}
                        <div className="relative flex flex-col items-center">
                            {/* Head & Digital Visor */}
                            <div className="relative size-32 lg:size-40 rounded-3xl bg-gradient-to-b from-gray-100 to-gray-200 border-4 border-emerald-500 shadow-2xl flex items-center justify-center p-2">
                                {/* Green Headgear / Antenna */}
                                <div className="absolute -top-4 size-8 rounded-full bg-emerald-500 border-2 border-white shadow-md flex items-center justify-center">
                                    <Bot className="size-4 text-white" />
                                </div>

                                {/* Digital Green Face Screen */}
                                <div className="w-full h-full bg-[#001f18] rounded-2xl border-2 border-emerald-400 flex items-center justify-center shadow-inner relative overflow-hidden">
                                    {/* Scanlines effect */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent animate-pulse" />

                                    {/* Digital Eyes & Smile */}
                                    <div className="flex items-center gap-4 text-emerald-400 font-mono font-black text-2xl tracking-widest z-10">
                                        <span className="animate-pulse">0</span>
                                        <span className="text-emerald-300">ᴗ</span>
                                        <span className="animate-pulse">0</span>
                                    </div>
                                </div>

                                {/* Headphone Earcups */}
                                <div className="absolute -left-3 size-8 bg-emerald-600 rounded-full border-2 border-white shadow" />
                                <div className="absolute -right-3 size-8 bg-emerald-600 rounded-full border-2 border-white shadow" />
                            </div>

                            {/* Robot Body / Suit */}
                            <div className="w-28 lg:w-36 h-20 bg-gradient-to-b from-gray-800 to-gray-900 rounded-t-3xl border-2 border-gray-700 shadow-lg flex flex-col items-center pt-2">
                                <div className="w-10 h-6 bg-white rounded-b-md flex items-center justify-center">
                                    <div className="w-3 h-5 bg-emerald-600 rotate-45 rounded-xs" />
                                </div>
                            </div>

                            {/* Work Desk & TopCV Laptop */}
                            <div className="relative w-72 sm:w-96 lg:w-[480px] h-10 bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-900 rounded-t-2xl shadow-xl flex items-center justify-center">
                                {/* Laptop */}
                                <div className="absolute -top-12 size-20 bg-gray-200 rounded-t-lg border-2 border-gray-300 shadow-lg flex flex-col items-center justify-center">
                                    <img src={logo} alt="TopCV" className="h-4 w-auto opacity-80" />
                                    <span className="text-[8px] font-bold text-emerald-800 mt-1">Toppy AI v2.0</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Top-Right Floating Widget: CV Matching Score Card (80%) */}
                    <div className="absolute top-4 sm:top-8 right-3 sm:right-8 lg:right-12 z-20 max-w-[280px] sm:max-w-[320px] bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-4 shadow-xl shadow-emerald-700/20 border border-emerald-400/40 transform hover:scale-105 transition duration-300">
                        <div className="flex items-center gap-3">
                            {/* Candidate Avatar */}
                            <div className="size-12 rounded-2xl bg-emerald-800/80 border border-emerald-400/50 flex items-center justify-center text-emerald-300 shrink-0">
                                <Bot className="size-7" />
                            </div>

                            <div className="flex-1">
                                <div className="text-[11px] font-medium text-emerald-200">Độ phù hợp CV</div>
                                <div className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                                    80%
                                    <span className="size-5 rounded-full bg-emerald-400 text-emerald-950 flex items-center justify-center text-xs font-bold">
                                        ✓
                                    </span>
                                </div>
                            </div>

                            {/* Action Icons */}
                            <div className="flex flex-col gap-1.5 text-emerald-200">
                                <div className="size-6 rounded-full bg-emerald-800/80 flex items-center justify-center">
                                    <Phone className="size-3" />
                                </div>
                                <div className="size-6 rounded-full bg-emerald-800/80 flex items-center justify-center">
                                    <Mail className="size-3" />
                                </div>
                            </div>
                        </div>

                        {/* Matching Progress Bar */}
                        <div className="mt-3 w-full h-2 bg-emerald-950/40 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-emerald-300 to-white w-[80%] rounded-full animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
