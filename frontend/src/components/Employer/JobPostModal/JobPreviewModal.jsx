import Modal from "../../ui/modal";
import { Button } from "../../ui/button";
import { formatSalary, formatDate } from "../../../utils/formatters";
import { getSelectLabel } from "../../../constants/selectLabels";
import { Building2, MapPin, CheckCircle2, Clock } from "lucide-react";

export default function JobPreviewModal({ isOpen, onClose, jobData, companyName, onConfirmPublish, isPublishing }) {
    if (!jobData) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            maxWidth="max-w-4xl"
            bodyClassName="p-0"
            className="max-h-[92vh] overflow-y-auto p-0"
            closeButtonClassName="border-0 bg-transparent shadow-none hover:bg-gray-100"
        >
            {/* Modal Header */}
            <div className="border-b border-gray-200 bg-white p-6 text-gray-900">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Xem trước tin tuyển dụng</span>
                        {jobData.is_hot && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-gray-950">
                                HOT JOB
                            </span>
                        )}
                    </div>
                    <h2 className="text-xl font-bold">{jobData.title || "Chưa nhập tiêu đề"}</h2>
                    <p className="text-gray-500 text-sm flex items-center gap-1.5 mt-0.5">
                        <Building2 className="size-4 shrink-0 text-emerald-600" /> {companyName || "Công ty tuyển dụng"}
                    </p>
                </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 text-sm text-gray-800">
                {/* Highlights Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-emerald-50/60 p-4 rounded-xl border border-emerald-100">
                    <div>
                        <span className="text-xs text-gray-500 block">Mức lương</span>
                        <span className="font-bold text-emerald-700 text-base">{formatSalary(jobData.salary)}</span>
                    </div>
                    <div>
                        <span className="text-xs text-gray-500 block">Hình thức</span>
                        <span className="font-semibold text-gray-800">{getSelectLabel(jobData.job_type)}</span>
                    </div>
                    <div>
                        <span className="text-xs text-gray-500 block">Kinh nghiệm</span>
                        <span className="font-semibold text-gray-800">{jobData.experience_level || ""}</span>
                    </div>
                    <div>
                        <span className="text-xs text-gray-500 block">Hạn nộp hồ sơ</span>
                        <span className="font-semibold text-gray-800 flex items-center gap-1">
                            <Clock className="size-3.5 text-emerald-600" /> {formatDate(jobData.deadline) || "30 ngày"}
                        </span>
                    </div>
                </div>

                {/* Locations */}
                {jobData.work_location && jobData.work_location.length > 0 && (
                    <div className="flex items-start gap-2 text-sm text-gray-600 bg-gray-50 p-3.5 rounded-xl">
                        <MapPin className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                            <span className="font-semibold text-gray-800">Địa điểm làm việc: </span>
                            {jobData.work_location.map((loc, idx) => (
                                <span key={idx}>
                                    {loc.address_detail ? `${loc.address_detail}, ` : ""}{loc.city_name || "Hà Nội"}
                                    {idx < jobData.work_location.length - 1 ? " | " : ""}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Section 1: Mô tả công việc */}
                <div className="space-y-2">
                    <h3 className="text-base font-bold text-gray-900 border-l-4 border-emerald-600 pl-3">
                        Mô tả công việc
                    </h3>
                    <div
                        className="prose prose-sm text-gray-700 leading-relaxed pl-4"
                        dangerouslySetInnerHTML={{ __html: jobData.description_html || "<p>Chưa có mô tả</p>" }}
                    />
                </div>

                {/* Section 2: Yêu cầu ứng viên */}
                {jobData.requirements_html && (
                    <div className="space-y-2">
                        <h3 className="text-base font-bold text-gray-900 border-l-4 border-emerald-600 pl-3">
                            Yêu cầu ứng viên
                        </h3>
                        <div
                            className="prose prose-sm text-gray-700 leading-relaxed pl-4"
                            dangerouslySetInnerHTML={{ __html: jobData.requirements_html }}
                        />
                    </div>
                )}

                {/* Section 3: Quyền lợi được hưởng */}
                {jobData.benefits_html && (
                    <div className="space-y-2">
                        <h3 className="text-base font-bold text-gray-900 border-l-4 border-emerald-600 pl-3">
                            Quyền lợi được hưởng
                        </h3>
                        <div
                            className="prose prose-sm text-gray-700 leading-relaxed pl-4"
                            dangerouslySetInnerHTML={{ __html: jobData.benefits_html }}
                        />
                    </div>
                )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-100 p-4 bg-gray-50 flex items-center justify-end gap-3">
                <Button variant="outline" onClick={onClose} className="h-11 rounded-lg px-5">
                    Chỉnh sửa lại
                </Button>
                <Button
                    onClick={onConfirmPublish}
                    disabled={isPublishing}
                    className="h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-6 font-semibold flex items-center gap-2 shadow-md shadow-emerald-600/20"
                >
                    <CheckCircle2 className="size-4" />
                    {isPublishing ? "Đang xuất bản..." : "Xác nhận & Đăng tin"}
                </Button>
            </div>
        </Modal>
    );
}
