import { useState } from "react";
import Modal from "../../ui/modal";
import { Button } from "../../ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../ui/select";
import { getSelectLabel } from "../../../constants/selectLabels";
import { useEmployerAuth } from "../../../stores/useEmployerAuthStore";
import JobPreviewModal from "./JobPreviewModal";
import CKEditorField from "../../ui/CKEditorField";
import { Briefcase, DollarSign, FileText, Loader2, Eye, Flame } from "lucide-react";

export default function CreateJobModal({ isOpen, onClose, initialData = null, onSuccess }) {
    const { addJob, company } = useEmployerAuth();

    const [formData, setFormData] = useState(() => ({
        title: "",
        category: "",
        specialty: "",
        job_type: "",
        experience_level: "",
        gender: "",
        quantity: "",
        salary_type: "",
        salary_min: "",
        salary_max: "",
        salary_currency: "VND",
        salary_is_negotiable: false,
        city_name: "",
        address_detail: "",
        deadline: "",
        is_hot: false,
        description_html: "",
        requirements_html: "",
        benefits_html: "",
        ...(initialData || {}),
    }));

    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");


    const getPayload = () => {
        return {
            title: formData.title.trim(),
            category: formData.category,
            specialty: formData.specialty,
            job_type: formData.job_type,
            experience_level: formData.experience_level,
            gender: formData.gender,
            quantity: Number(formData.quantity) || 1,
            salary: {
                type: formData.salary_type,
                min: formData.salary_type !== "AGREEMENT" ? Number(formData.salary_min) : null,
                max: formData.salary_type !== "AGREEMENT" ? Number(formData.salary_max) : null,
                currency: formData.salary_currency,
                is_negotiable: formData.salary_is_negotiable
            },
            work_location: [
                {
                    city_id: {
                        "Hà Nội": 1,
                        "TP. Hồ Chí Minh": 2,
                        "Đà Nẵng": 3,
                        "Hải Phòng": 4,
                        "Bình Dương": 5,
                        "Cần Thơ": 6,
                    }[formData.city_name] || null,
                    city_name: formData.city_name,
                    address_detail: formData.address_detail.trim() || undefined
                }
            ],
            deadline: formData.deadline ? new Date(formData.deadline).toISOString() : new Date().toISOString(),
            is_hot: formData.is_hot,
            description_html: formData.description_html || "<p></p>",
            requirements_html: formData.requirements_html || "<p></p>",
            benefits_html: formData.benefits_html || "<p></p>"
        };
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setError("");

        if (!formData.title.trim()) {
            setError("Vui lòng nhập tiêu đề công việc tuyển dụng.");
            return;
        }

        if (!formData.description_html || formData.description_html.trim() === "<p></p>") {
            setError("Vui lòng nhập mô tả công việc.");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = getPayload();
            await addJob(payload);
            setIsPreviewOpen(false);
            onClose();
            if (onSuccess) onSuccess();
        } catch (err) {
            setError(err.message || "Không thể đăng tin. Vui lòng kiểm tra lại thông tin.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                maxWidth="max-w-4xl"
                bodyClassName="p-0 flex flex-col min-h-0"
                className="max-h-[92vh] flex flex-col p-0 overflow-hidden"
            >
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white px-6 py-4 shrink-0 rounded-t-xl flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Briefcase className="size-5 text-emerald-200" /> Tạo Tin Tuyển Dụng Mới
                        </h2>
                        <p className="text-xs text-emerald-100 mt-0.5">Tiếp cận nhanh chóng hàng ngàn ứng viên tiềm năng</p>
                    </div>
                </div>

                {/* Form Container */}
                <div className="p-6 overflow-y-auto space-y-6 text-sm flex-1 text-gray-800">
                    {error && (
                        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                            {error}
                        </div>
                    )}

                    {/* Section 1: Thông tin chung */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                            <Briefcase className="size-4" /> 1. Thông tin chung về vị trí
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Tiêu đề tin tuyển dụng <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="VD: Senior Frontend Developer (ReactJS / NextJS)"
                                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Ngành nghề tuyển dụng <span className="text-red-500">*</span>
                                </label>
                                <Select
                                    itemToStringLabel={getSelectLabel}
                                    value={formData.category}
                                    onValueChange={(val) => setFormData({ ...formData, category: val })}
                                >
                                    <SelectTrigger className="w-full h-10 rounded-xl border-gray-200 bg-gray-50 focus:bg-white text-sm">
                                        <SelectValue placeholder="Chọn ngành nghề" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="IT - Phần mềm">IT - Phần mềm</SelectItem>
                                        <SelectItem value="Kinh doanh / Bán hàng">Kinh doanh / Bán hàng</SelectItem>
                                        <SelectItem value="Marketing / Truyền thông / Quảng cáo">Marketing / Truyền thông / Quảng cáo</SelectItem>
                                        <SelectItem value="Kế toán / Kiểm toán">Kế toán / Kiểm toán</SelectItem>
                                        <SelectItem value="Hành chính / Nhân sự">Hành chính / Nhân sự</SelectItem>
                                        <SelectItem value="Chăm sóc khách hàng">Chăm sóc khách hàng</SelectItem>
                                        <SelectItem value="Tài chính / Ngân hàng">Tài chính / Ngân hàng</SelectItem>
                                        <SelectItem value="Thiết kế / Sáng tạo">Thiết kế / Sáng tạo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Chuyên môn chi tiết
                                </label>
                                <input
                                    type="text"
                                    value={formData.specialty}
                                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                                    placeholder="VD: ReactJS, NodeJS, SEO, Thuế..."
                                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Hình thức làm việc
                                </label>
                                <Select
                                    itemToStringLabel={getSelectLabel}
                                    value={formData.job_type}
                                    onValueChange={(val) => setFormData({ ...formData, job_type: val })}
                                >
                                    <SelectTrigger className="w-full h-10 rounded-xl border-gray-200 bg-gray-50 focus:bg-white text-sm">
                                        <SelectValue placeholder="Chọn hình thức làm việc" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="FULL_TIME">Toàn thời gian (Full-time)</SelectItem>
                                        <SelectItem value="PART_TIME">Bán thời gian (Part-time)</SelectItem>
                                        <SelectItem value="FREELANCE">Freelance / Dự án</SelectItem>
                                        <SelectItem value="INTERNSHIP">Thực tập sinh (Internship)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Kinh nghiệm yêu cầu
                                </label>
                                <Select
                                    itemToStringLabel={getSelectLabel}
                                    value={formData.experience_level}
                                    onValueChange={(val) => setFormData({ ...formData, experience_level: val })}
                                >
                                    <SelectTrigger className="w-full h-10 rounded-xl border-gray-200 bg-gray-50 focus:bg-white text-sm">
                                        <SelectValue placeholder="Chọn kinh nghiệm" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Chưa có kinh nghiệm">Chưa có kinh nghiệm</SelectItem>
                                        <SelectItem value="Dưới 1 năm">Dưới 1 năm</SelectItem>
                                        <SelectItem value="1-2 năm">1 - 2 năm</SelectItem>
                                        <SelectItem value="3-5 năm">3 - 5 năm</SelectItem>
                                        <SelectItem value="Trên 5 năm">Trên 5 năm</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Số lượng cần tuyển
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Hạn nộp hồ sơ
                                </label>
                                <input
                                    type="date"
                                    value={formData.deadline}
                                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Mức lương & Địa điểm */}
                    <div className="space-y-4 pt-2 border-t border-gray-100">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                            <DollarSign className="size-4" /> 2. Mức lương & Địa điểm làm việc
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Kiểu mức lương
                                </label>
                                <Select
                                    itemToStringLabel={getSelectLabel}
                                    value={formData.salary_type}
                                    onValueChange={(val) => setFormData({ ...formData, salary_type: val })}
                                >
                                    <SelectTrigger className="w-full h-10 rounded-xl border-gray-200 bg-gray-50 focus:bg-white text-sm">
                                        <SelectValue placeholder="Chọn kiểu mức lương" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="RANGE">Trong khoảng (Min - Max)</SelectItem>
                                        <SelectItem value="UP_TO">Lên đến (Tối đa)</SelectItem>
                                        <SelectItem value="MINIMUM">Từ (Tối thiểu)</SelectItem>
                                        <SelectItem value="AGREEMENT">Thoả thuận</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {formData.salary_type !== "AGREEMENT" && (
                                <>
                                    {(formData.salary_type === "RANGE" || formData.salary_type === "MINIMUM") && (
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Lương tối thiểu (VND)
                                            </label>
                                            <input
                                                type="number"
                                                step="500000"
                                                value={formData.salary_min}
                                                onChange={(e) => setFormData({ ...formData, salary_min: Number(e.target.value) })}
                                                placeholder="VD: 15000000"
                                                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                            />
                                        </div>
                                    )}

                                    {(formData.salary_type === "RANGE" || formData.salary_type === "UP_TO") && (
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Lương tối đa (VND)
                                            </label>
                                            <input
                                                type="number"
                                                step="500000"
                                                value={formData.salary_max}
                                                onChange={(e) => setFormData({ ...formData, salary_max: Number(e.target.value) })}
                                                placeholder="VD: 25000000"
                                                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Tỉnh / Thành phố làm việc
                                </label>
                                <Select
                                    itemToStringLabel={getSelectLabel}
                                    value={formData.city_name}
                                    onValueChange={(val) => setFormData({ ...formData, city_name: val })}
                                >
                                    <SelectTrigger className="w-full h-10 rounded-xl border-gray-200 bg-gray-50 focus:bg-white text-sm">
                                        <SelectValue placeholder="Chọn tỉnh thành" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Hà Nội">Hà Nội</SelectItem>
                                        <SelectItem value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</SelectItem>
                                        <SelectItem value="Đà Nẵng">Đà Nẵng</SelectItem>
                                        <SelectItem value="Hải Phòng">Hải Phòng</SelectItem>
                                        <SelectItem value="Bình Dương">Bình Dương</SelectItem>
                                        <SelectItem value="Cần Thơ">Cần Thơ</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Địa chỉ làm việc cụ thể
                                </label>
                                <input
                                    type="text"
                                    value={formData.address_detail}
                                    onChange={(e) => setFormData({ ...formData, address_detail: e.target.value })}
                                    placeholder="VD: Tầng 5, Tòa nhà Landmark 81, 720A Điện Biên Phủ"
                                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-1">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={formData.is_hot}
                                    onChange={(e) => setFormData({ ...formData, is_hot: e.target.checked })}
                                    className="size-4 text-emerald-600 rounded focus:ring-emerald-500"
                                />
                                <span className="text-xs font-semibold text-amber-700 flex items-center gap-1">
                                    <Flame className="size-4 text-amber-500 fill-amber-500" /> Đặt làm Tin Nổi Bật (Ưu tiên tiếp cận x3 ứng viên)
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Section 3: Chi tiết nội dung công việc với CKEditor 5 */}
                    <div className="space-y-5 pt-2 border-t border-gray-100">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                            <FileText className="size-4" /> 3. Soạn thảo chi tiết công việc
                        </h3>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                Mô tả công việc <span className="text-red-500">*</span>
                            </label>
                            <CKEditorField
                                value={formData.description_html}
                                onChange={(data) => setFormData((prev) => ({ ...prev, description_html: data }))}
                                placeholder="Nhập các nhiệm vụ, trách nhiệm chính của vị trí..."
                                minHeight="160px"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                Yêu cầu ứng viên
                            </label>
                            <CKEditorField
                                value={formData.requirements_html}
                                onChange={(data) => setFormData((prev) => ({ ...prev, requirements_html: data }))}
                                placeholder="Kỹ năng chuyên môn, kinh nghiệm, bằng cấp yêu cầu..."
                                minHeight="150px"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                Quyền lợi được hưởng
                            </label>
                            <CKEditorField
                                value={formData.benefits_html}
                                onChange={(data) => setFormData((prev) => ({ ...prev, benefits_html: data }))}
                                placeholder="Lương thưởng, chế độ đãi ngộ, bảo hiểm, đào tạo..."
                                minHeight="150px"
                            />
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="border-t border-gray-100 p-4 bg-gray-50 flex items-center justify-between shrink-0 rounded-b-2xl">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsPreviewOpen(true)}
                        className="rounded-xl px-4 flex items-center gap-1.5 text-gray-700 hover:text-emerald-700"
                    >
                        <Eye className="size-4" /> Xem trước tin
                    </Button>

                    <div className="flex items-center gap-3">
                        <Button variant="ghost" onClick={onClose} className="rounded-xl px-4">
                            Hủy bỏ
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 font-semibold shadow-md shadow-emerald-600/20 flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Đang xuất bản...
                                </>
                            ) : (
                                "Đăng tin tuyển dụng"
                            )}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Preview Modal */}
            <JobPreviewModal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                jobData={getPayload()}
                companyName={company?.company_name || ""}
                onConfirmPublish={handleSubmit}
                isPublishing={isSubmitting}
            />
        </>
    );
}
