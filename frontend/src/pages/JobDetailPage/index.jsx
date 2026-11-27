import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCandidateAuth } from "../../stores/useCandidateAuthStore";
import { useJobDetail, useApplyJob } from "@/hooks";
import candidateService from "../../services/candidateService";
import { formatSalary } from "../../utils/formatters";
import Toast from "../../components/ui/toast";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
    Building2,
    MapPin,
    DollarSign,
    Briefcase,
    Users,
    Heart,
    CheckCircle2,
    AlertCircle,
    ArrowLeft,
    Send,
    Loader2,
    Sparkles,
    FileText,
    ExternalLink,
    PlusCircle
} from "lucide-react";

export default function JobDetailPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useCandidateAuth();

    const { data: job, isLoading: loading, error: queryError } = useJobDetail(slug);
    const applyJobMutation = useApplyJob();

    const error = queryError?.message || "";
    const [saved, setSaved] = useState(false);
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [availableCvs, setAvailableCvs] = useState([]);
    const [selectedCvId, setSelectedCvId] = useState("");
    const [coverLetter, setCoverLetter] = useState("");
    const [appliedSuccessOverride, setAppliedSuccessOverride] = useState(false);
    const [isCreatingQuickCv, setIsCreatingQuickCv] = useState(false);
    const [toast, setToast] = useState({ message: "", type: "success" });
    const isApplying = applyJobMutation.isPending;

    const appliedStorageKey = job?.id
        ? user?.id
            ? `topcv_applied_job_${user.id}_${job.id}`
            : `topcv_applied_job_${job.id}`
        : null;
    const appliedSuccess = appliedSuccessOverride || Boolean(
        appliedStorageKey && localStorage.getItem(appliedStorageKey),
    );

    const handleOpenApply = () => {
        if (!isAuthenticated) {
            navigate("/login", { state: { from: { pathname: `/viec-lam/${slug}` } } });
            return;
        }

        // Always read latest candidate's CVs from local storage cache / service
        const latestCvs = candidateService.getMyCvs(user?.id);
        setAvailableCvs(latestCvs);
        if (latestCvs.length > 0) {
            setSelectedCvId((prev) => (prev && latestCvs.some((c) => c.id === prev) ? prev : latestCvs[0].id));
        } else {
            setSelectedCvId("");
        }
        setIsApplyModalOpen(true);
    };

    // Quick-create a minimal CV if the candidate hasn't created one yet
    const handleQuickCreateCv = async () => {
        setIsCreatingQuickCv(true);
        try {
            const defaultCv = {
                full_name: user?.full_name || "",
                email: user?.email || "",
                phone: user?.phone || "0912345678",
                summary: "Ứng viên nhiệt huyết, mong muốn tìm kiếm cơ hội cống hiến và phát triển sự nghiệp.",
                education: [
                    {
                        school: "Đại học / Cao đẳng",
                        major: "Chuyên ngành phù hợp",
                        start_date: "2020",
                        end_date: "2024",
                        grade: "Tốt nghiệp loại Khá/Giỏi",
                    },
                ],
                experience: [
                    {
                        company: "Công ty gần nhất",
                        position: "Nhân viên chuyên môn",
                        duration: "2023 - Hiện tại",
                        description: "Hoàn thành tốt các mục tiêu và nhiệm vụ được giao.",
                    },
                ],
                skills: ["Làm việc nhóm", "Giao tiếp", "Kỹ năng chuyên môn"],
            };

            const res = await candidateService.createCv(defaultCv, user?.id);
            const createdId = res?.cv_id || defaultCv.id;
            const updatedCvs = candidateService.getMyCvs(user?.id);
            setAvailableCvs(updatedCvs);
            setSelectedCvId(createdId);
            setToast({ message: "Đã tạo nhanh CV từ thông tin tài khoản!", type: "success" });
        } catch (err) {
            const msg =
                err.response?.data?.detail ||
                err.response?.data?.message ||
                err.message ||
                "Tạo CV nhanh thất bại.";
            setToast({ message: msg, type: "error" });
        } finally {
            setIsCreatingQuickCv(false);
        }
    };

    const handleConfirmApply = async (e) => {
        e.preventDefault();
        if (!selectedCvId) {
            setToast({ message: "Vui lòng chọn hoặc tạo CV để ứng tuyển.", type: "error" });
            return;
        }

        try {
            await applyJobMutation.mutateAsync({
                jobId: job.id,
                payload: {
                    cv_id: selectedCvId,
                    cover_letter: coverLetter.trim() || undefined,
                },
            });

            // Remember applied status
            const key = user?.id ? `topcv_applied_job_${user.id}_${job.id}` : `topcv_applied_job_${job.id}`;
            localStorage.setItem(key, "true");

            setAppliedSuccessOverride(true);
            setIsApplyModalOpen(false);
            setToast({ message: "Ứng tuyển thành công!", type: "success" });
        } catch (err) {
            const errorMsg =
                err.response?.data?.detail ||
                err.response?.data?.message ||
                err.message ||
                "Ứng tuyển thất bại. Vui lòng thử lại.";
            setToast({ message: errorMsg, type: "error" });
        }
    };

    if (loading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
                <Loader2 className="size-8 animate-spin text-primary" />
                <p className="text-sm text-gray-500 font-medium">Đang tải thông tin việc làm...</p>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="max-w-[1200px] mx-auto px-6 py-12 text-center">
                <div className="inline-flex size-16 items-center justify-center rounded-2xl bg-red-50 text-red-500 mb-4">
                    <AlertCircle className="size-8" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy việc làm</h2>
                <p className="text-sm text-gray-500 mb-6">{error || "Công việc này có thể đã hết hạn hoặc không tồn tại."}</p>
                <Link
                    to="/viec-lam"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow-md hover:bg-primary/90 transition"
                >
                    <ArrowLeft className="size-4" /> Khám phá việc làm khác
                </Link>
            </div>
        );
    }

    const {
        title,
        company,
        salary,
        work_location,
        is_hot,
        experience_level,
        job_type,
        quantity,
        deadline,
        description_html,
        requirements_html,
        benefits_html
    } = job;

    const companyName = company?.company_name || "";
    const salaryText = formatSalary(salary);
    const locationList = Array.isArray(work_location) ? work_location : [];
    const formattedDeadline = deadline ? new Date(deadline).toLocaleDateString("vi-VN") : "";

    return (
        <div className="bg-bg-main min-h-screen pb-16 font-[Inter,sans-serif]">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-200/80">
                <div className="max-w-[1200px] mx-auto px-6 py-3 flex items-center gap-2 text-xs text-gray-500">
                    <Link to="/" className="hover:text-primary transition">Trang chủ</Link>
                    <span>/</span>
                    <Link to="/viec-lam" className="hover:text-primary transition">Tìm việc làm</Link>
                    <span>/</span>
                    <span className="text-gray-800 font-semibold truncate max-w-xs">{title}</span>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-6 pt-6">
                {/* Main Job Header Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-gray-200/70 mb-6">
                    <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
                        <div className="flex gap-5 items-start flex-1 min-w-0">
                            <div className="size-20 sm:size-24 shrink-0 rounded-2xl border border-gray-100 bg-gray-50 p-2 flex items-center justify-center overflow-hidden">
                                {company?.logo_url ? (
                                    <img src={company.logo_url} alt={companyName} className="size-full object-contain" />
                                ) : (
                                    <Building2 className="size-10 text-emerald-600" />
                                )}
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                    {is_hot && (
                                        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-[11px] px-2 py-0.5">
                                            <Sparkles className="size-3 mr-1" /> NỔI BẬT
                                        </Badge>
                                    )}
                                    <span className="text-xs text-gray-400 font-medium">Hạn nộp: {formattedDeadline}</span>
                                </div>

                                <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-snug">
                                    {title}
                                </h1>

                                <p className="text-sm font-semibold text-gray-600 mt-1 hover:text-primary transition cursor-pointer">
                                    {companyName}
                                </p>

                                {/* Salary & Key Highlight Pill */}
                                <div className="mt-4 flex items-center gap-3 flex-wrap">
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-primary font-bold text-sm">
                                        <DollarSign className="size-4" />
                                        <span>{salaryText}</span>
                                    </div>

                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 text-gray-700 font-medium text-xs">
                                        <MapPin className="size-3.5 text-gray-500" />
                                        <span>
                                            {locationList.map((loc) => loc.city_name).filter(Boolean).join(", ")}
                                        </span>
                                    </div>

                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 text-gray-700 font-medium text-xs">
                                        <Briefcase className="size-3.5 text-gray-500" />
                                        <span>{experience_level || ""}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Top Action CTAs */}
                        <div className="flex md:flex-col items-center gap-2.5 w-full md:w-auto shrink-0 pt-2 md:pt-0">
                            {appliedSuccess ? (
                                <button
                                    disabled
                                    className="w-full md:w-48 h-11 rounded-2xl bg-emerald-100 text-primary font-bold text-sm flex items-center justify-center gap-2 cursor-not-allowed"
                                >
                                    <CheckCircle2 className="size-4" /> Đã nộp hồ sơ
                                </button>
                            ) : (
                                <button
                                    onClick={handleOpenApply}
                                    className="w-full md:w-48 h-11 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <Send className="size-4" /> Ứng tuyển ngay
                                </button>
                            )}

                            <Button
                                variant="outline"
                                onClick={() => {
                                    if (!isAuthenticated) {
                                        navigate("/login", { state: { from: { pathname: `/viec-lam/${slug}` } } });
                                        return;
                                    }
                                    const willSave = !saved;
                                    setSaved(willSave);
                                    setToast({
                                        message: willSave
                                            ? "Đã lưu công việc vào danh sách yêu thích!"
                                            : "Đã bỏ công việc khỏi danh sách yêu thích.",
                                        type: "success",
                                    });
                                }}
                                className={`w-full md:w-48 h-10 rounded-2xl text-xs font-semibold flex items-center justify-center gap-1.5 ${saved ? "border-emerald-500 bg-emerald-50 text-primary hover:bg-emerald-100" : "text-gray-700 border-gray-200 hover:bg-gray-50"}`}
                            >
                                <Heart className={`size-4 ${saved ? "fill-[#00b14f] text-primary" : "text-primary"}`} /> Lưu tin tuyển dụng
                            </Button>
                        </div>
                    </div>
                </div>

                {/* 2-Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Job Description & Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Section: Chi tiết tin tuyển dụng */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-gray-200/70 space-y-7">
                            <h2 className="text-lg font-black text-gray-900 border-l-4 border-primary pl-3">
                                Chi tiết tin tuyển dụng
                            </h2>

                            {/* Mô tả công việc */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">
                                    Mô tả công việc
                                </h3>
                                <div
                                    className="prose prose-sm max-w-none text-gray-700 leading-relaxed text-sm [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1"
                                    dangerouslySetInnerHTML={{ __html: description_html || "<p>Chưa cập nhật mô tả.</p>" }}
                                />
                            </div>

                            {/* Yêu cầu ứng viên */}
                            {requirements_html && (
                                <div className="pt-4 border-t border-gray-100">
                                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">
                                        Yêu cầu ứng viên
                                    </h3>
                                    <div
                                        className="prose prose-sm max-w-none text-gray-700 leading-relaxed text-sm [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1"
                                        dangerouslySetInnerHTML={{ __html: requirements_html }}
                                    />
                                </div>
                            )}

                            {/* Quyền lợi được hưởng */}
                            {benefits_html && (
                                <div className="pt-4 border-t border-gray-100">
                                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">
                                        Quyền lợi được hưởng
                                    </h3>
                                    <div
                                        className="prose prose-sm max-w-none text-gray-700 leading-relaxed text-sm [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1"
                                        dangerouslySetInnerHTML={{ __html: benefits_html }}
                                    />
                                </div>
                            )}

                            {/* Địa điểm làm việc */}
                            <div className="pt-4 border-t border-gray-100">
                                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">
                                    Địa điểm làm việc
                                </h3>
                                {locationList.length > 0 ? (
                                    <div className="space-y-2">
                                        {locationList.map((loc, i) => (
                                            <div key={i} className="flex items-start gap-2 text-xs text-gray-700">
                                                <MapPin className="size-4 text-primary shrink-0 mt-0.5" />
                                                <span>
                                                    <strong>{loc.city_name}:</strong> {loc.address_detail || "Chưa có địa chỉ chi tiết"}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                                <p className="text-xs text-gray-500">Chưa cập nhật địa điểm</p>
                                )}
                            </div>

                            {/* Bottom Apply CTA */}
                            <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-xs text-gray-500">
                                    <span>Hạn nộp hồ sơ: <strong>{formattedDeadline}</strong></span>
                                </div>
                                <button
                                    onClick={handleOpenApply}
                                    disabled={appliedSuccess}
                                    className="px-8 h-12 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                >
                                    {appliedSuccess ? (
                                        <>
                                            <CheckCircle2 className="size-4" /> Đã nộp hồ sơ ứng tuyển
                                        </>
                                    ) : (
                                        <>
                                            <Send className="size-4" /> Ứng tuyển ngay
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Company Info & Quick Overview */}
                    <div className="space-y-6">
                        {/* Company Card */}
                        <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-200/70 space-y-4">
                            <h3 className="text-sm font-bold text-gray-900 border-l-4 border-primary pl-3">
                                Thông tin doanh nghiệp
                            </h3>

                            <div className="flex items-center gap-3">
                                <div className="size-14 rounded-2xl bg-gray-50 border border-gray-100 p-1.5 flex items-center justify-center overflow-hidden shrink-0">
                                    {company?.logo_url ? (
                                        <img src={company.logo_url} alt={companyName} className="size-full object-contain" />
                                    ) : (
                                        <Building2 className="size-7 text-emerald-600" />
                                    )}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900 leading-snug">{companyName}</h4>
                                    {company?.tax_code && (
                                        <p className="text-[11px] text-gray-400 mt-0.5">MST: {company.tax_code}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2.5 pt-2 text-xs text-gray-600 border-t border-gray-100">
                                {company?.director && (
                                    <div className="flex items-start gap-2">
                                        <Users className="size-3.5 text-gray-400 shrink-0 mt-0.5" />
                                        <span>Đại diện: <strong>{company.director}</strong></span>
                                    </div>
                                )}
                                {company?.headquarters_address && (
                                    <div className="flex items-start gap-2">
                                        <MapPin className="size-3.5 text-gray-400 shrink-0 mt-0.5" />
                                        <span>{company.headquarters_address}</span>
                                    </div>
                                )}
                                {company?.website && (
                                    <div className="flex items-center gap-2">
                                        <ExternalLink className="size-3.5 text-gray-400 shrink-0" />
                                        <a href={company.website} target="_blank" rel="noreferrer" className="text-emerald-700 hover:underline truncate">
                                            {company.website}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Overview Stats */}
                        <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-200/70 space-y-4">
                            <h3 className="text-sm font-bold text-gray-900 border-l-4 border-primary pl-3">
                                Tổng quan việc làm
                            </h3>

                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                                    <p className="text-gray-400 font-medium">Hình thức</p>
                                    <p className="text-gray-900 font-bold mt-1">{job_type || ""}</p>
                                </div>

                                <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                                    <p className="text-gray-400 font-medium">Số lượng</p>
                                    <p className="text-gray-900 font-bold mt-1">{quantity ? `${quantity} người` : ""}</p>
                                </div>

                                <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                                    <p className="text-gray-400 font-medium">Kinh nghiệm</p>
                                    <p className="text-gray-900 font-bold mt-1">{experience_level || ""}</p>
                                </div>

                                <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                                    <p className="text-gray-400 font-medium">Hạn nhận hồ sơ</p>
                                    <p className="text-gray-900 font-bold mt-1">{formattedDeadline}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* APPLY JOB MODAL */}
            {isApplyModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-emerald-600 to-[#00b14f] p-6 text-white">
                            <h3 className="text-lg font-bold tracking-tight">
                                Ứng tuyển: {title}
                            </h3>
                            <p className="text-xs text-emerald-100 mt-1">{companyName}</p>
                        </div>

                        {/* Body */}
                        <form onSubmit={handleConfirmApply} className="p-6 space-y-4">
                            {/* Candidate Info summary */}
                            <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-xs">
                                <p className="text-emerald-900 font-semibold">
                                    Ứng viên: <strong>{user?.full_name || user?.email}</strong>
                                </p>
                                <p className="text-gray-500 mt-0.5">Email liên hệ: {user?.email}</p>
                            </div>

                            {/* CV Selection */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="text-xs font-bold text-gray-700">
                                        Chọn CV để ứng tuyển <span className="text-red-500">*</span>
                                    </label>
                                    <Link
                                        to="/tao-cv"
                                        className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                                    >
                                        <PlusCircle className="size-3.5" /> Tạo CV mới
                                    </Link>
                                </div>

                                {availableCvs.length > 0 ? (
                                    <div className="space-y-2">
                                        {availableCvs.map((cv) => (
                                            <label
                                                key={cv.id}
                                                className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition ${
                                                    selectedCvId === cv.id
                                                        ? "border-primary bg-emerald-50/50 shadow-xs"
                                                        : "border-gray-200 hover:border-gray-300 bg-white"
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="radio"
                                                        name="selected_cv"
                                                        value={cv.id}
                                                        checked={selectedCvId === cv.id}
                                                        onChange={() => setSelectedCvId(cv.id)}
                                                        className="text-emerald-600"
                                                    />
                                                    <div>
                                                        <p className="text-xs font-bold text-gray-900">
                                                            {cv.full_name ? `CV - ${cv.full_name}` : ""}
                                                        </p>
                                                        <p className="text-[11px] text-gray-400">
                                                            {cv.summary || "Đã lưu trong hệ thống"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <FileText className="size-4 text-emerald-600" />
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 rounded-2xl border border-dashed border-gray-300 text-center space-y-3 bg-gray-50/50">
                                        <p className="text-xs text-gray-500">
                                            Bạn chưa có CV trong hệ thống TopCV.
                                        </p>
                                        <div className="flex items-center justify-center gap-2 flex-wrap">
                                            <button
                                                type="button"
                                                onClick={handleQuickCreateCv}
                                                disabled={isCreatingQuickCv}
                                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-xs hover:bg-primary/90 transition cursor-pointer disabled:opacity-50"
                                            >
                                                {isCreatingQuickCv ? (
                                                    <>
                                                        <Loader2 className="size-3.5 animate-spin" /> Đang tạo CV...
                                                    </>
                                                ) : (
                                                    <>
                                                        <PlusCircle className="size-3.5" /> Tạo nhanh CV từ thông tin cá nhân
                                                    </>
                                                )}
                                            </button>
                                            <Link
                                                to="/tao-cv"
                                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition"
                                            >
                                                <FileText className="size-3.5 text-primary" /> Trang thiết kế CV chi tiết
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Cover Letter */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">
                                    Thư giới thiệu (Cover letter - Tùy chọn)
                                </label>
                                <textarea
                                    rows="3"
                                    value={coverLetter}
                                    onChange={(e) => setCoverLetter(e.target.value)}
                                    placeholder="Viết một đoạn ngắn giới thiệu bản thân và lý do bạn phù hợp với công việc này..."
                                    className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsApplyModalOpen(false)}
                                    className="rounded-xl text-xs h-10 px-4"
                                >
                                    Hủy
                                </Button>
                                <button
                                    type="submit"
                                    disabled={isApplying || !selectedCvId}
                                    className="h-10 px-5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                                >
                                    {isApplying ? (
                                        <>
                                            <Loader2 className="size-4 animate-spin" /> Đang gửi hồ sơ...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="size-3.5" /> Nộp hồ sơ ứng tuyển
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Toast */}
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
