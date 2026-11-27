import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Building2 } from "lucide-react";
import { formatSalary } from "@/utils/formatters";
import Toast from "../ui/toast";
import { useCandidateAuth } from "../../stores/useCandidateAuthStore";

export default function JobCard({ job }) {
    const navigate = useNavigate();
    const { isAuthenticated } = useCandidateAuth();
    const [saved, setSaved] = useState(false);
    const [toast, setToast] = useState({ message: "", type: "success" });

    const {
        title = "",
        company,
        salary,
        work_location,
        is_hot,
        slug,
        id
    } = job || {};

    const handleCardClick = () => {
        const target = slug || id;
        if (target) {
            navigate(`/viec-lam/${target}`);
        }
    };

    const companyName = company?.company_name || "";
    const companyLogo = company?.logo_url;
    const salaryText = formatSalary(salary);

    const locationText =
        work_location && Array.isArray(work_location) && work_location.length > 0
            ? work_location
                .map((loc) => loc.city_name || loc.address_detail)
                .filter(Boolean)
                .join(" & ")
            : "";

    const showHotBadge = Boolean(is_hot);
    const showProBadge = false;

    return (
        <div
            onClick={handleCardClick}
            className="flex h-full w-full min-w-0 cursor-pointer flex-col justify-between rounded-2xl bg-white p-3.5 border border-border transition-all duration-200 group shadow-2xs hover:shadow-md hover:border-primary"
        >
            {/* Top row: Company Logo + Job info */}
            <div className="flex w-full min-w-0 items-start gap-3">
                {/* Logo container */}
                <div className="relative size-12 shrink-0 items-center justify-center rounded-xl border border-border bg-white p-1 flex shadow-2xs">
                    {/* Standout flash badge on top-left of logo (Image 1) */}
                    {companyLogo ? (
                        <img
                            src={companyLogo}
                            alt={companyName}
                            className="h-full w-full object-contain rounded-lg"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                                if (e.currentTarget.nextSibling) {
                                    e.currentTarget.nextSibling.style.display = "flex";
                                }
                            }}
                        />
                    ) : null}

                    <div
                        className={`size-full items-center justify-center text-primary bg-emerald-50 rounded-lg font-bold text-xs ${companyLogo ? "hidden" : "flex"
                            }`}
                    >
                        {company?.short_name
                            ? company.short_name.slice(0, 3).toUpperCase()
                            : <Building2 className="size-5 text-emerald-600" />}
                    </div>
                </div>

                {/* Job information */}
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1 mb-0.5">
                        {showHotBadge && (
                            <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#ea1e30] text-white shrink-0">
                                HOT
                            </span>
                        )}
                        {showProBadge && (
                            <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#fff3e0] text-[#d97706] border border-amber-200 shrink-0">
                                Pro
                            </span>
                        )}
                    </div>

                    <h3
                        className="truncate-2 text-[13px] font-bold text-gray-900 group-hover:text-primary transition-colors leading-snug line-clamp-2"
                        title={title}
                    >
                        {title}
                    </h3>

                    <p
                        className="mt-0.5 truncate text-[11px] font-medium text-gray-400 uppercase tracking-tight"
                        title={companyName}
                    >
                        {companyName}
                    </p>
                </div>
            </div>

            {/* Bottom Badges & Action */}
            <div className="flex w-full min-w-0 items-center justify-between gap-2 mt-3 pt-2">
                <div className="flex min-w-0 items-center gap-1.5 overflow-hidden flex-wrap">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-semibold shrink-0">
                        {salaryText}
                    </span>

                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium max-w-[130px] truncate shrink-0">
                        <span className="truncate">{locationText}</span>
                    </span>
                </div>

                <button
                    type="button"
                    aria-label="Lưu việc làm"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (!isAuthenticated) {
                            navigate("/login");
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
                    className={`size-8 shrink-0 rounded-full border flex items-center justify-center transition-all cursor-pointer ${saved
                            ? "border-emerald-500 bg-emerald-50 text-primary"
                            : "border-gray-200 text-emerald-500 hover:border-emerald-400 hover:bg-emerald-50/50"
                        }`}
                >
                    <Heart
                        className={`size-4 transition-transform active:scale-125 ${saved ? "fill-[#00b14f]" : ""
                            }`}
                    />
                </button>
            </div>
            {toast.message && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "success" })} />}
        </div>
    );
}
