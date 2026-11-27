import { useState } from "react";
import Modal from "../../ui/modal";
import { Button } from "../../ui/button";
import { useEmployerAuth } from "../../../stores/useEmployerAuthStore";
import { Building2, Mail, Lock, Phone, User, MapPin, Globe, FileText, Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin, onSuccess }) {
    const { registerCompany } = useEmployerAuth();

    const [formData, setFormData] = useState({
        tax_code: "",
        company_name: "",
        international_name: "",
        short_name: "",
        director: "",
        headquarters_address: "",
        email: "",
        phone_number: "",
        website: "",
        password: "",
        confirm_password: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMsg("");

        if (!formData.tax_code || !formData.company_name || !formData.email || !formData.phone_number || !formData.password) {
            setError("Vui lòng điền đầy đủ các trường bắt buộc (*).");
            return;
        }

        if (formData.password.length < 6) {
            setError("Mật khẩu phải có tối thiểu 6 ký tự.");
            return;
        }

        if (formData.password !== formData.confirm_password) {
            setError("Mật khẩu xác nhận không khớp.");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                tax_code: formData.tax_code.trim(),
                company_name: formData.company_name.trim(),
                international_name: formData.international_name.trim() || undefined,
                short_name: formData.short_name.trim() || undefined,
                director: formData.director.trim() || undefined,
                headquarters_address: formData.headquarters_address.trim() || undefined,
                email: formData.email.trim(),
                phone_number: formData.phone_number.trim(),
                website: formData.website.trim() || undefined,
                password: formData.password
            };

            await registerCompany(payload);
            setSuccessMsg("Đăng ký tài khoản doanh nghiệp thành công! Đang đăng nhập...");
            setTimeout(() => {
                onClose();
                if (onSuccess) onSuccess();
            }, 1200);
        } catch (err) {
            setError(err.message || "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin mã số thuế hoặc email.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-3xl" className="max-h-[90vh] flex flex-col">
            <div className="text-center mb-5 shrink-0">
                <div className="inline-flex items-center justify-center size-11 rounded-2xl bg-emerald-50 text-emerald-600 mb-2">
                    <Building2 className="size-6" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Đăng ký Nhà tuyển dụng TopCV</h2>
                <p className="text-sm text-gray-500">Tiếp cận hơn 5.4 triệu hồ sơ ứng viên chất lượng cao</p>
            </div>

            {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium shrink-0">
                    {error}
                </div>
            )}

            {successMsg && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 shrink-0">
                    <CheckCircle2 className="size-4 text-emerald-600" />
                    {successMsg}
                </div>
            )}

            <form onSubmit={handleSubmit} className="overflow-y-auto pr-1 space-y-5 text-left text-sm flex-1">
                {/* Nhóm 1: Thông tin doanh nghiệp */}
                <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-100">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-3 flex items-center gap-1.5">
                        <FileText className="size-4" /> 1. Thông tin doanh nghiệp
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Mã số thuế (MST) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="tax_code"
                                required
                                value={formData.tax_code}
                                onChange={handleChange}
                                placeholder="VD: 0108888888"
                                className="w-full px-3.5 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Tên công ty đầy đủ <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="company_name"
                                required
                                value={formData.company_name}
                                onChange={handleChange}
                                placeholder="VD: CÔNG TY CỔ PHẦN CÔNG NGHỆ TOPCV"
                                className="w-full px-3.5 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Tên viết tắt / Tên giao dịch
                            </label>
                            <input
                                type="text"
                                name="short_name"
                                value={formData.short_name}
                                onChange={handleChange}
                                placeholder="VD: TOPCV VIETNAM"
                                className="w-full px-3.5 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Người đại diện pháp luật / Giám đốc
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 size-4 text-gray-400" />
                                <input
                                    type="text"
                                    name="director"
                                    value={formData.director}
                                    onChange={handleChange}
                                    placeholder="VD: Nguyễn Văn A"
                                    className="w-full pl-9 pr-3.5 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Địa chỉ trụ sở chính <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-2.5 size-4 text-gray-400" />
                                <input
                                    type="text"
                                    name="headquarters_address"
                                    required
                                    value={formData.headquarters_address}
                                    onChange={handleChange}
                                    placeholder="VD: Tầng 3, Tòa FS GoldSeason, 47 Nguyễn Tuân, Thanh Xuân, Hà Nội"
                                    className="w-full pl-9 pr-3.5 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Nhóm 2: Thông tin tài khoản & Liên hệ */}
                <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-100">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-3 flex items-center gap-1.5">
                        <Mail className="size-4" /> 2. Thông tin tài khoản & liên hệ
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Email đăng nhập & nhận CV <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 size-4 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="hr@congty.com"
                                    className="w-full pl-9 pr-3.5 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Số điện thoại liên hệ <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-2.5 size-4 text-gray-400" />
                                <input
                                    type="tel"
                                    name="phone_number"
                                    required
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    placeholder="0987654321"
                                    className="w-full pl-9 pr-3.5 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Website công ty
                            </label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-2.5 size-4 text-gray-400" />
                                <input
                                    type="url"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    placeholder="https://congty.com"
                                    className="w-full pl-9 pr-3.5 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Mật khẩu đăng nhập <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 size-4 text-gray-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Tối thiểu 6 ký tự"
                                    className="w-full pl-9 pr-10 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Xác nhận mật khẩu <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 size-4 text-gray-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="confirm_password"
                                    required
                                    value={formData.confirm_password}
                                    onChange={handleChange}
                                    placeholder="Nhập lại mật khẩu"
                                    className="w-full pl-9 pr-3.5 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-2">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                Đang hoàn tất đăng ký...
                            </>
                        ) : (
                            "Hoàn tất đăng ký & Bắt đầu tuyển dụng"
                        )}
                    </Button>
                </div>
            </form>

            <div className="mt-4 pt-4 border-t border-gray-100 text-center text-xs text-gray-500 shrink-0">
                Đã có tài khoản doanh nghiệp?{" "}
                <button
                    type="button"
                    onClick={() => {
                        onClose();
                        if (onSwitchToLogin) onSwitchToLogin();
                    }}
                    className="text-emerald-600 font-bold hover:underline"
                >
                    Đăng nhập ngay
                </button>
            </div>
        </Modal>
    );
}
