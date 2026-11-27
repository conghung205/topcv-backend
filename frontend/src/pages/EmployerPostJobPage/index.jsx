import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEmployerAuth } from "../../stores/useEmployerAuthStore";
import EmployerHeader from "../../components/Employer/EmployerHeader";
import JobPreviewModal from "../../components/Employer/JobPostModal/JobPreviewModal";
import CKEditorField from "../../components/ui/CKEditorField";
import Toast from "../../components/ui/toast";
import { Button } from "../../components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../components/ui/select";
import { getSelectLabel } from "../../constants/selectLabels";
import {
    Briefcase,
    DollarSign,
    FileText,
    Eye,
    CheckCircle2,
    Loader2,
    ArrowLeft,
    Flame
} from "lucide-react";


export default function EmployerPostJobPage() {
    const { addJob, company } = useEmployerAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
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
        benefits_html: ""
    });

    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [toast, setToast] = useState({ message: "", type: "success" });


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
            setError("Vui lòng nhập tiêu đề vị trí tuyển dụng.");
            return;
        }

        if (!formData.description_html || formData.description_html.trim() === "<p></p>") {
            setError("Vui lòng nhập nội dung mô tả công việc.");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = getPayload();
            await addJob(payload);

            setToast({
                message: "Tin tuyển dụng đã xuất bản thành công! Đang chuyển đến bảng quản lý...",
                type: "success"
            });

            setTimeout(() => {
                navigate("/employer/dashboard");
            }, 1000);
        } catch (err) {
            setError(err.message || "Không thể tạo tin tuyển dụng. Vui lòng thử lại.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-[Inter,sans-serif]">
            <EmployerHeader />

            <main className="max-w-[1000px] mx-auto px-4 sm:px-6 py-8 space-y-6">
                {/* Back link */}
                <Link
                    to="/employer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-emerald-700 transition"
                >
                    <ArrowLeft className="size-3.5" /> Quay lại Trang Chủ Nhà Tuyển Dụng
                </Link>

                {/* Header title */}
                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                            <Briefcase className="size-6 text-emerald-600" /> Tạo Tin Tuyển Dụng Mới
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            Tiếp cận ngay 5.4 triệu ứng viên tiềm năng và tuyển dụng nhanh chóng.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsPreviewOpen(true)}
                            className="rounded-xl px-4 text-xs font-semibold flex items-center gap-1.5"
                        >
                            <Eye className="size-4" /> Xem trước
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="bg-primary hover:bg-primary/90 text-white rounded-xl px-5 text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer"
                        >
                            {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                            Xuất bản tin
                        </Button>
                    </div>
                </div>

                {error && (
                    <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                        {error}
                    </div>
                )}

                {/* Form Sections */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Section 1: Thông tin vị trí */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-800 border-l-4 border-emerald-600 pl-3 flex items-center gap-1.5">
                            <Briefcase className="size-4" /> 1. Vị trí & Ngành nghề tuyển dụng
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Tiêu đề công việc <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="VD: Senior Frontend Developer (ReactJS)"
                                    className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-gray-900"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Ngành nghề chính <span className="text-red-500">*</span>
                                </label>
                                <Select
                                    itemToStringLabel={getSelectLabel}
                                    value={formData.category}
                                    onValueChange={(val) => setFormData({ ...formData, category: val })}
                                >
                                    <SelectTrigger className="w-full h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white text-sm">
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
                                    placeholder="VD: ReactJS, TypeScript..."
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
                                    <SelectTrigger className="w-full h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white text-sm">
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
                                    <SelectTrigger className="w-full h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white text-sm">
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
                                    Số lượng tuyển
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
                                    Hạn nhận hồ sơ
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
                    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-800 border-l-4 border-emerald-600 pl-3 flex items-center gap-1.5">
                            <DollarSign className="size-4" /> 2. Mức lương & Địa điểm làm việc
                        </h2>

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
                                    <SelectTrigger className="w-full h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white text-sm">
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
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Lương tối thiểu (VND)
                                        </label>
                                        <input
                                            type="number"
                                            step="500000"
                                            value={formData.salary_min}
                                            onChange={(e) => setFormData({ ...formData, salary_min: Number(e.target.value) })}
                                            className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Lương tối đa (VND)
                                        </label>
                                        <input
                                            type="number"
                                            step="500000"
                                            value={formData.salary_max}
                                            onChange={(e) => setFormData({ ...formData, salary_max: Number(e.target.value) })}
                                            className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Tỉnh / Thành phố
                                </label>
                                <Select
                                    itemToStringLabel={getSelectLabel}
                                    value={formData.city_name}
                                    onValueChange={(val) => setFormData({ ...formData, city_name: val })}
                                >
                                    <SelectTrigger className="w-full h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white text-sm">
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
                                    placeholder="Tầng, Số nhà, Tòa nhà, Đường..."
                                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={formData.is_hot}
                                    onChange={(e) => setFormData({ ...formData, is_hot: e.target.checked })}
                                    className="size-4 text-emerald-600 rounded"
                                />
                                <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                                    <Flame className="size-4 text-amber-500 fill-amber-500" /> Đặt làm Tin Nổi Bật (Ưu tiên tiếp cận x3 ứng viên tiềm năng)
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Section 3: Nội dung chi tiết JD bằng CKEditor 5 */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-6">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-800 border-l-4 border-emerald-600 pl-3 flex items-center gap-1.5">
                            <FileText className="size-4" /> 3. Soạn thảo chi tiết công việc
                        </h2>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                Mô tả công việc <span className="text-red-500">*</span>
                            </label>
                            <CKEditorField
                                value={formData.description_html}
                                onChange={(data) => setFormData((prev) => ({ ...prev, description_html: data }))}
                                placeholder="Nhập các nhiệm vụ, trách nhiệm chính của vị trí..."
                                minHeight="180px"
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
                                minHeight="160px"
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
                                minHeight="160px"
                            />
                        </div>
                    </div>

                    {/* Submit Bar */}
                    <div className="flex items-center justify-between pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsPreviewOpen(true)}
                            className="rounded-2xl px-5 h-11 text-sm font-semibold flex items-center gap-2"
                        >
                            <Eye className="size-4" /> Xem trước tin đăng
                        </Button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-8 h-12 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-base shadow-lg shadow-emerald-600/25 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="size-5 animate-spin" /> Đang xuất bản tin...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="size-5" /> Xuất bản tin tuyển dụng ngay
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </main>

            {/* Preview Modal */}
            <JobPreviewModal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                jobData={getPayload()}
                companyName={company?.company_name || ""}
                onConfirmPublish={handleSubmit}
                isPublishing={isSubmitting}
            />

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
