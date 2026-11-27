import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatDate, formatSalary } from "../../utils/formatters";
import { useCandidateAuth } from "../../stores/useCandidateAuthStore";
import { useJobs } from "@/hooks";
import Toast from "../../components/ui/toast";
import {
    Search,
    Check,
    Heart,
    Loader2,
    Briefcase,
    X
} from "lucide-react";

export default function BestJobsPage() {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useCandidateAuth();

    const [keyword, setKeyword] = useState("");
    const [savedJobs, setSavedJobs] = useState({});
    const [toast, setToast] = useState({ message: "", type: "success" });
    const [currentTime] = useState(() => Date.now());

    const { data: res, isLoading: loading } = useJobs({
        keyword: keyword.trim() || undefined,
    });

    const jobsData = res?.data;
    const realJobs = useMemo(() => jobsData || [], [jobsData]);
    const total = res?.total || realJobs.length;

    const jobs = useMemo(() => {
        return realJobs.map((j, idx) => {
            const deadlineDate = j.deadline ? new Date(j.deadline) : null;
            const daysLeft = deadlineDate
                ? Math.max(1, Math.ceil((deadlineDate.getTime() - currentTime) / (1000 * 60 * 60 * 24)))
                : null;

            const loc = Array.isArray(j.work_location) && j.work_location.length > 0
                ? j.work_location.map((l) => l.city_name || l.address_detail).join(" & ")
                : "";

            const short = j.company?.short_name || j.company?.company_name || "";
            const initials = short
                .split(" ")
                .filter(Boolean)
                .slice(0, 3)
                .map(w => w[0])
                .join("")
                .toUpperCase();

            return {
                id: j.id,
                title: j.title,
                company_name: j.company?.company_name || "",
                logo_url: j.company?.logo_url,
                slug: j.slug || j.id,
                salary: j.salary,
                location: loc,
                days_left: daysLeft,
                updated_at: formatDate(j.updated_at || j.created_at),
                is_highlighted: Boolean(j.is_hot),
                logo_text: initials,
                logo_bg: idx % 3 === 0
                    ? "bg-amber-50 text-amber-900"
                    : idx % 3 === 1
                    ? "bg-blue-50 text-blue-800"
                    : "bg-emerald-50 text-emerald-800"
            };
        });
    }, [realJobs, currentTime]);

    const handleSearchSubmit = (e) => {
        if (e) e.preventDefault();
    };

    const handleApplyJob = (e, job) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            navigate("/login");
        } else {
            navigate(`/viec-lam/${job.slug}`);
        }
    };

    const isJobApplied = (jobId) => {
        if (!isAuthenticated) return false;

        const key = user?.id
            ? `topcv_applied_job_${user.id}_${jobId}`
            : `topcv_applied_job_${jobId}`;

        return localStorage.getItem(key) === "true";
    };

    const handleToggleSaveJob = (e, jobId) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }
        const willSave = !savedJobs[jobId];
        setSavedJobs((prev) => ({
            ...prev,
            [jobId]: !prev[jobId],
        }));
        setToast({
            message: willSave
                ? "Đã lưu công việc vào danh sách yêu thích!"
                : "Đã bỏ công việc khỏi danh sách yêu thích.",
            type: "success",
        });
    };

    return (
        <div className="bg-bg-main min-h-screen pb-20 font-[Inter,sans-serif]">
            {/* Top Breadcrumb */}
            <div className="bg-white border-b border-gray-200/80">
                <div className="max-w-[1200px] mx-auto px-6 py-3 flex items-center gap-2 text-xs text-gray-500">
                    <Link to="/" className="hover:text-primary transition">Trang chủ</Link>
                    <span>/</span>
                    <span className="text-gray-800 font-semibold">Việc làm tốt nhất</span>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-6 pt-6">
                {/* 1. Header Banner (Matching Image Style) */}
                <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-[linear-gradient(90deg,#005b44_0%,#00875a_50%,#005b44_100%)] p-6 md:p-10 shadow-lg text-white">
                    {/* Decorative angled geometric lines */}
                    <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none bg-[radial-gradient(ellipse_at_center,#fff_0%,transparent_70%)]" />
                    
                    <div className="relative z-10 max-w-2xl space-y-3">
                        <h1 className="text-2xl md:text-[26px] font-black tracking-tight">
                            Việc làm nổi bật
                        </h1>
                        <p className="text-sm text-emerald-100 font-medium">
                            Tìm kiếm công việc mơ ước từ những cơ hội việc làm nổi bật trên TopCV
                        </p>

                        {/* 3 Badges */}
                        <div className="flex flex-wrap items-center gap-2.5 pt-2">
                            <span className="bg-white/95 text-emerald-900 text-xs font-bold px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-xs">
                                <Check className="size-3.5 text-primary stroke-[3]" /> Lương cao
                            </span>
                            <span className="bg-white/95 text-emerald-900 text-xs font-bold px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-xs">
                                <Check className="size-3.5 text-primary stroke-[3]" /> Phúc lợi hấp dẫn
                            </span>
                            <span className="bg-white/95 text-emerald-900 text-xs font-bold px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-xs">
                                <Check className="size-3.5 text-primary stroke-[3]" /> Môi trường chuyên nghiệp
                            </span>
                        </div>
                    </div>
                </div>

                {/* 2. Search Filter Row */}
                <div className="mt-4 bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
                    <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                        <div className="flex-1 relative flex items-center px-3">
                            <Search className="size-4 text-gray-400 shrink-0 mr-2" />
                            <input
                                type="text"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                placeholder="Tên công việc, vị trí..."
                                className="w-full py-1.5 text-sm bg-transparent outline-none font-medium text-gray-900 placeholder:text-gray-400"
                            />
                            {keyword && (
                                <button
                                    type="button"
                                    onClick={() => setKeyword("")}
                                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full cursor-pointer"
                                >
                                    <X className="size-3.5" />
                                </button>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="px-6 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-2 cursor-pointer shrink-0"
                        >
                            <Search className="size-4" /> Tìm kiếm
                        </button>
                    </form>
                </div>

                {/* 3. Results Count Text (Real count from API) */}
                <div className="my-4 text-sm text-gray-700 font-medium">
                    Tìm thấy <span className="font-bold text-primary">{total.toLocaleString()}</span> việc làm phù hợp với yêu cầu của bạn.
                </div>

                {/* 4. Jobs List (Render 100% real jobs from database) */}
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-3">
                        <Loader2 className="size-8 animate-spin text-primary" />
                        <p className="text-xs text-gray-500 font-medium">Đang tải danh sách việc làm tốt nhất từ hệ thống...</p>
                    </div>
                ) : jobs.length > 0 ? (
                    <div className="space-y-3.5">
                        {jobs.map((job) => {
                            const salaryDisplay = formatSalary(job.salary);
                            const isSaved = !!savedJobs[job.id];
                            const isApplied = isJobApplied(job.id);

                            return (
                                <div
                                    key={job.id}
                                    onClick={() => navigate(`/viec-lam/${job.slug}`)}
                                    className="bg-white rounded-2xl border border-border p-3 sm:p-4 transition-all shadow-xs hover:shadow-md hover:border-primary cursor-pointer group relative"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                        {/* Left Side: Logo & Main Job Info */}
                                        <div className="flex items-start gap-4 min-w-0 flex-1">
                                            {/* Square Logo Box */}
                                            <div className="size-20 sm:size-24 rounded-2xl border border-border bg-white p-2 flex items-center justify-center shrink-0 shadow-2xs overflow-hidden">
                                                {job.logo_url ? (
                                                    <img
                                                        src={job.logo_url}
                                                        alt={job.company_name}
                                                        className="size-full object-contain"
                                                    />
                                                ) : (
                                                    <div className={`size-full rounded-xl flex items-center justify-center font-black text-xs text-center p-1 leading-tight tracking-tight ${job.logo_bg}`}>
                                                        {job.logo_text}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Job Details */}
                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-primary transition leading-snug line-clamp-1">
                                                    {job.title}
                                                </h3>
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-1 line-clamp-1">
                                                    {job.company_name}
                                                </p>

                                                {/* Badges / Tags Row */}
                                                <div className="flex flex-wrap items-center gap-2 mt-3.5">
                                                    {job.location && (
                                                        <span className="bg-[#f4f5f7] text-gray-600 text-xs px-2.5 py-1 rounded-md font-medium">
                                                            {job.location}
                                                        </span>
                                                    )}
                                                    {job.days_left !== null && (
                                                        <span className="bg-[#f4f5f7] text-gray-600 text-xs px-2.5 py-1 rounded-md font-medium">
                                                            Còn <strong className="text-gray-900 font-bold">{job.days_left}</strong> ngày để ứng tuyển
                                                        </span>
                                                    )}
                                                    {job.updated_at && (
                                                        <span className="bg-[#f4f5f7] text-gray-600 text-xs px-2.5 py-1 rounded-md font-medium">
                                                            {job.updated_at}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Side: Salary & Action Buttons */}
                                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-between gap-3 shrink-0 self-stretch sm:self-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                                            {/* Salary with Coin/Dollar icon */}
                                            <div className="flex items-center gap-1.5 font-bold text-primary text-sm sm:text-base">
                                                <div className="size-4 rounded-full bg-emerald-100 text-primary flex items-center justify-center font-black text-[10px]">
                                                    $
                                                </div>
                                                <span>{salaryDisplay}</span>
                                            </div>

                                            {/* Action Buttons Row */}
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (!isApplied) handleApplyJob(e, job);
                                                    }}
                                                    disabled={isApplied}
                                                    className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-bold shadow-xs transition flex items-center justify-center ${
                                                        isApplied
                                                            ? "border border-emerald-200 bg-emerald-100 text-primary cursor-not-allowed"
                                                            : "bg-primary text-white hover:bg-primary/90 cursor-pointer"
                                                    }`}
                                                >
                                                    {isApplied ? "Đã nộp hồ sơ" : "Ứng tuyển"}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={(e) => handleToggleSaveJob(e, job.id)}
                                                    className={`p-2 rounded-lg border transition cursor-pointer flex items-center justify-center ${
                                                        isSaved
                                                            ? "border-emerald-500 bg-emerald-50 text-primary"
                                                            : "border-gray-200 text-emerald-500 hover:text-primary hover:border-emerald-400 hover:bg-emerald-50/50"
                                                    }`}
                                                    title={isSaved ? "Đã lưu tin" : "Lưu tin"}
                                                >
                                                    <Heart
                                                        className={`size-4 ${
                                                            isSaved ? "fill-[#00b14f] text-primary" : ""
                                                        }`}
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-16 bg-white rounded-3xl border border-gray-200 text-center space-y-3">
                        <div className="size-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
                            <Briefcase className="size-6" />
                        </div>
                        <h3 className="text-sm font-bold text-gray-800">Hiện chưa có việc làm nào</h3>
                    </div>
                )}
            </div>

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
