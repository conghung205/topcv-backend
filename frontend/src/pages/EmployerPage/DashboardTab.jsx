import { useState } from "react";
import { useEmployerAuth } from "../../stores/useEmployerAuthStore";
import { formatSalary, formatDate } from "../../utils/formatters";
import { getSelectLabel } from "../../constants/selectLabels";
import { Button } from "../../components/ui/button";
import JobPreviewModal from "../../components/Employer/JobPostModal/JobPreviewModal";
import {
    PlusCircle,
    Search,
    Eye,
    Briefcase,
    Flame,
    Building2,
    Calendar,
} from "lucide-react";

export default function DashboardTab({ onOpenPostJob }) {
    const { employerJobs, company } = useEmployerAuth();
    const [searchKeyword, setSearchKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [previewJob, setPreviewJob] = useState(null);

    const filteredJobs = (employerJobs || []).filter((job) => {
        const matchesSearch = (job.title || "").toLowerCase().includes(searchKeyword.toLowerCase()) ||
                              (job.category || "").toLowerCase().includes(searchKeyword.toLowerCase());
        const matchesStatus = statusFilter === "ALL" || job.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalApplications = (employerJobs || []).reduce((acc, curr) => acc + (curr.applications_count || 0), 0);

    return (
        <div className="py-8 bg-gray-50 min-h-[75vh] font-[Inter,sans-serif] text-body">
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6 space-y-6">
                {/* Header Profile & Quick Action */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="size-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center font-bold text-2xl shadow-md">
                            <Building2 className="size-7" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-bold text-ink">
                                    {company?.company_name || ""}
                                </h1>
                                {company?.verification_tier && (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                        {company.verification_tier}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-muted-copy mt-0.5">
                                {company?.tax_code && <><span>Mã số thuế: <strong className="text-secondary-copy">{company.tax_code}</strong></span><span> • </span></>}
                                {company?.email && <span>Email: {company.email}</span>}
                            </p>
                        </div>
                    </div>

                    <Button
                        onClick={onOpenPostJob}
                        className="h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-0 rounded-2xl shadow-md shadow-emerald-600/20 flex items-center gap-2 text-sm shrink-0"
                    >
                        <PlusCircle className="size-4" /> Đăng tin tuyển dụng mới
                    </Button>
                </div>

                {/* Metric Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
                        <span className="text-xs text-ink font-normal block mb-1">Tổng tin tuyển dụng</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl sm:text-3xl font-semibold text-ink">{employerJobs.length}</span>
                            <span className="text-xs text-ink font-normal">tin đăng</span>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
                        <span className="text-xs text-ink font-normal block mb-1">Tin đang hoạt động</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl sm:text-3xl font-semibold text-ink">
                                {employerJobs.filter((j) => j.status === "PUBLISHED").length}
                            </span>
                            <span className="text-xs text-ink font-normal">hiển thị</span>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
                        <span className="text-xs text-ink font-normal block mb-1">Hồ sơ ứng tuyển (CV)</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl sm:text-3xl font-semibold text-ink">{totalApplications}</span>
                            <span className="text-xs text-ink font-normal">CV nhận về</span>
                        </div>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
                    {/* Search */}
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-2.5 size-4 text-muted-copy" />
                        <input
                            type="text"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            placeholder="Tìm theo chức danh, kỹ năng..."
                            className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        />
                    </div>

                    {/* Status Tabs */}
                    <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto text-xs">
                        {[
                            { id: "ALL", label: "Tất cả tin" },
                            { id: "PUBLISHED", label: "Đang tuyển dụng" },
                            { id: "DRAFT", label: "Tin nháp" },
                            { id: "CLOSED", label: "Hết hạn" },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setStatusFilter(tab.id)}
                                className={`px-3.5 py-1.5 rounded-xl font-semibold transition shrink-0 ${
                                    statusFilter === tab.id
                                        ? "bg-emerald-600 text-white shadow-xs"
                                        : "bg-gray-100 text-secondary-copy hover:bg-gray-200"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Job Cards List */}
                {filteredJobs.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-4">
                        <div className="size-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                            <Briefcase className="size-8" />
                        </div>
                        <h3 className="text-lg font-bold text-body">Hiện chưa có việc làm nào</h3>
                        <p className="text-xs text-muted-copy max-w-md mx-auto">
                            Bắt đầu thu hút nhân tài ngay hôm nay bằng cách đăng tin tuyển dụng mới trên hệ thống TopCV.
                        </p>
                        <Button
                            onClick={onOpenPostJob}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl px-5 py-2 shadow-md shadow-emerald-600/20"
                        >
                            + Tạo tin tuyển dụng ngay
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-3.5">
                        {filteredJobs.map((job) => (
                            <div
                                key={job.id}
                                className="bg-white rounded-2xl p-5 border border-border hover:border-primary shadow-xs hover:shadow-sm transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                            >
                                <div className="space-y-1.5 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="text-base font-bold text-ink hover:text-emerald-700 transition">
                                            {job.title}
                                        </h3>
                                        {job.is_hot && (
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                                                <Flame className="size-3 fill-amber-500 text-amber-500" /> HOT
                                            </span>
                                        )}
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                                            {job.category || ""}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-copy">
                                        <span className="font-bold text-emerald-700">{formatSalary(job.salary)}</span>
                                        <span>•</span>
                                        <span>{getSelectLabel(job.job_type)}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="size-3.5 text-muted-copy" />
                                            {job.deadline && <>Hạn: {formatDate(job.deadline)}</>}
                                        </span>
                                    </div>
                                </div>

                                {/* Views and Applications */}
                                <div className="flex items-center text-xs text-secondary-copy bg-gray-50/80 px-4 py-2.5 rounded-xl border border-gray-100">
                                    <div className="text-center">
                                        <span className="block font-bold text-emerald-700 text-sm">{job.applications_count || 0}</span>
                                        <span className="text-[11px] text-emerald-800 font-semibold">CV Ứng tuyển</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPreviewJob(job)}
                                        className="rounded-xl h-8 px-3 text-xs flex items-center gap-1 text-secondary-copy hover:text-emerald-700"
                                    >
                                        <Eye className="size-3.5" /> Xem trước
                                    </Button>

                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Preview Modal */}
            <JobPreviewModal
                isOpen={!!previewJob}
                onClose={() => setPreviewJob(null)}
                jobData={previewJob}
                companyName={company?.company_name || ""}
                onConfirmPublish={() => setPreviewJob(null)}
                isPublishing={false}
            />

        </div>
    );
}
