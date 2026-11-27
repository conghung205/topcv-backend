import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEmployerAuth } from "../../stores/useEmployerAuthStore";
import RightCampaignBanner from "../../components/Employer/RightCampaignBanner";
import Toast from "../../components/ui/toast";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../components/ui/select";
import {
    ChevronUp,
    ChevronDown,
    Phone,
    Mail,
    Lock,
    User,
    Building2,
    MapPin,
    Globe,
    Eye,
    EyeOff,
    Loader2,
} from "lucide-react";
import { employerRegisterSchema } from "../../schemas/authSchemas";

function FieldError({ message }) {
    return message ? <p className="mt-1.5 text-xs font-medium text-red-600">{message}</p> : null;
}

export default function EmployerRegisterPage() {
    const { registerCompany } = useEmployerAuth();
    const navigate = useNavigate();

    const [isRuleOpen, setIsRuleOpen] = useState(true);

    const defaultValues = {
        email: "",
        password: "",
        confirm_password: "",
        full_name: "",
        director: "",
        phone_number: "",
        gender: "Nam",
        company_name: "",
        international_name: "",
        tax_code: "",
        short_name: "",
        headquarters_address: "",
        city_name: "Hà Nội",
        company_size: "25-99 nhân viên",
        website: "",
        consent_terms: false,
        consent_marketing: false,
    };

    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(employerRegisterSchema),
        defaultValues,
        mode: "onTouched",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [toast, setToast] = useState({ message: "", type: "success" });

    const onSubmit = async (formData) => {
        try {
            const payload = {
                tax_code: formData.tax_code.trim(),
                company_name: formData.company_name.trim(),
                international_name: formData.international_name.trim() || undefined,
                short_name: formData.short_name.trim() || undefined,
                director: formData.director.trim() || formData.full_name.trim() || undefined,
                headquarters_address: `${formData.headquarters_address.trim() || ""}, ${formData.city_name}`,
                email: formData.email.trim(),
                phone_number: formData.phone_number.trim(),
                website: formData.website.trim() || undefined,
                password: formData.password
            };

            await registerCompany(payload);

            setToast({
                message: "Đăng ký tài khoản Nhà tuyển dụng thành công! Đang chuyển đến trang tạo tin tuyển dụng...",
                type: "success"
            });

            setTimeout(() => {
                navigate("/employer/post-job");
            }, 1000);
        } catch (err) {
            setToast({ message: err.message || "Đăng ký không thành công. Vui lòng kiểm tra lại thông tin mã số thuế hoặc email.", type: "error" });
        }
    };

    return (
        <div className="min-h-screen bg-white font-[Inter,sans-serif] flex flex-col lg:flex-row">
            {/* Left Form Container */}
            <div className="w-full lg:w-[58%] min-h-screen p-6 sm:p-10 lg:p-14 overflow-y-auto">
                <div className="max-w-2xl mx-auto">
                    {/* Top Header & Logo */}
                    <div className="flex items-center justify-between mb-6">
                        <Link to="/employer" className="flex items-center gap-1">
                            <img src={logo} alt="TopCV" className="h-8 w-auto" />
                        </Link>
                        <Link
                            to="/employer/login"
                            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 transition"
                        >
                            Đã có tài khoản? Đăng nhập
                        </Link>
                    </div>

                    {/* Headline */}
                    <div className="mb-6">
                        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-2">
                            Đăng ký tài khoản Nhà tuyển dụng
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                            Cùng tạo dựng lợi thế cho doanh nghiệp bằng trải nghiệm công nghệ tuyển dụng ứng dụng sâu AI & Hiring Funnel.
                        </p>
                    </div>

                    {/* Green Box: Quy định */}
                    <div className="mb-8 rounded-2xl border border-emerald-500/80 bg-white shadow-xs overflow-hidden">
                        <button
                            type="button"
                            onClick={() => setIsRuleOpen(!isRuleOpen)}
                            className="w-full px-5 py-3.5 flex items-center justify-between text-left font-bold text-sm text-primary hover:bg-emerald-50/50 transition"
                        >
                            <span className="text-base font-bold">Quy định</span>
                            {isRuleOpen ? <ChevronUp className="size-5 text-emerald-600" /> : <ChevronDown className="size-5 text-emerald-600" />}
                        </button>

                        {isRuleOpen && (
                            <div className="px-5 pb-5 pt-1 text-xs text-gray-700 space-y-3 leading-relaxed border-t border-emerald-100 bg-emerald-50/20">
                                <p>
                                    Để đảm bảo chất lượng dịch vụ, TopCV <strong className="text-red-600 font-bold">không cho phép một người dùng tạo nhiều tài khoản khác nhau</strong>.
                                </p>
                                <p>
                                    Nếu phát hiện vi phạm, TopCV sẽ ngừng cung cấp dịch vụ tới tất cả các tài khoản trùng lặp hoặc chặn toàn bộ truy cập tới hệ thống website của TopCV.
                                </p>
                                <p>
                                    Sau khi đăng ký tài khoản nhà tuyển dụng (NTD) và cung cấp các thông tin cần thiết, NTD có thể được hỗ trợ hiển thị tin tuyển dụng cơ bản (standard), ngoại trừ một số vị trí nhất định. Số lượng tin đăng và cách thức hiển thị phụ thuộc vào quy định của TopCV tại từng thời điểm.
                                </p>
                                <div className="pt-1 flex items-center gap-2 text-emerald-800 font-semibold">
                                    <span>Mọi thắc mắc vui lòng liên hệ Hotline CSKH:</span>
                                    <a href="tel:1900068889" className="inline-flex items-center gap-1 text-emerald-700 hover:underline font-bold">
                                        <Phone className="size-3.5 fill-emerald-600 text-emerald-600" /> 1900 068 889 / 024 6680 5588
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Registration Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 text-sm" noValidate>
                        {/* Section 1: Tài khoản */}
                        <div className="space-y-4">
                            <h2 className="text-base font-bold text-gray-900 border-l-4 border-primary pl-3">
                                Tài khoản
                            </h2>

                            <p className="text-xs text-gray-600 leading-relaxed">
                                Để cung cấp dịch vụ cho bạn, chúng tôi cần xử lý một số dữ liệu cá nhân theo quy định tại{" "}
                                <a href="#privacy" onClick={(e) => e.preventDefault()} className="text-emerald-700 font-bold hover:underline">
                                    Chính sách quyền riêng tư
                                </a>{" "}
                                và{" "}
                                <a href="#terms" onClick={(e) => e.preventDefault()} className="text-emerald-700 font-bold hover:underline">
                                    Điều khoản dịch vụ
                                </a>. Vui lòng lựa chọn các mục đích mà bạn đồng ý dưới đây:
                            </p>

                            {/* Consents */}
                            <div className="space-y-3 bg-gray-50/80 p-4 rounded-2xl border border-gray-100 text-xs">
                                <label className="flex items-start gap-2.5 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        {...register("consent_terms")}
                                        className="size-4 text-emerald-600 rounded mt-0.5"
                                    />
                                    <div className="text-gray-800">
                                        <span>Tôi đã đọc và đồng ý với Điều khoản dịch vụ và Chính sách Quyền riêng tư của TopCV.</span>
                                        <span className="block text-[11px] text-emerald-700 mt-0.5 italic">
                                            * Chúng tôi không thể cung cấp dịch vụ nếu không nhận được sự đồng ý ở mục này.
                                        </span>
                                    </div>
                                </label>
                                <FieldError message={errors.consent_terms?.message} />

                                <label className="flex items-start gap-2.5 cursor-pointer pt-2 border-t border-gray-200/60">
                                    <input
                                        type="checkbox"
                                        {...register("consent_marketing")}
                                        className="size-4 text-emerald-600 rounded mt-0.5"
                                    />
                                    <div className="text-gray-800">
                                        <span>Tôi đồng ý nhận thông tin tư vấn của TopCV để được hỗ trợ đăng tin nhanh, cách tối ưu hiệu quả tin đăng, các thông báo quan trọng về tin đăng, CV ứng tuyển và các giải pháp/chương trình tuyển dụng phù hợp.</span>
                                        <span className="block text-[11px] text-emerald-700 mt-0.5 italic">
                                            * Khuyên dùng: Nếu không có sự đồng ý, chuyên viên sẽ không thể liên hệ để hỗ trợ Quý khách xác thực tài khoản nhanh chóng & đăng tin kịp thời.
                                        </span>
                                    </div>
                                </label>
                            </div>

                            {/* Inputs for Account */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Email đăng nhập (Email công ty / doanh nghiệp) <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3.5 top-2.5 size-4 text-gray-400" />
                                        <input
                                            type="email"
                                            required
                                            name="email"
                                            {...register("email")}
                                            aria-invalid={Boolean(errors.email)}
                                            placeholder="hr@congty.com"
                                            className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                        />
                                    </div>
                                    <FieldError message={errors.email?.message} />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Mật khẩu <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3.5 top-2.5 size-4 text-gray-400" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            name="password"
                                            {...register("password")}
                                            aria-invalid={Boolean(errors.password)}
                                            placeholder="Tối thiểu 6 ký tự"
                                            className="w-full pl-10 pr-10 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3.5 top-2.5 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                        </button>
                                    </div>
                                    <FieldError message={errors.password?.message} />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Nhập lại mật khẩu <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3.5 top-2.5 size-4 text-gray-400" />
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            required
                                            name="confirm_password"
                                            {...register("confirm_password")}
                                            aria-invalid={Boolean(errors.confirm_password)}
                                            placeholder="Xác nhận mật khẩu"
                                            className="w-full pl-10 pr-10 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3.5 top-2.5 text-gray-400 hover:text-gray-600"
                                        >
                                            {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                        </button>
                                    </div>
                                    <FieldError message={errors.confirm_password?.message} />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Họ và tên người liên hệ / NTD <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3.5 top-2.5 size-4 text-gray-400" />
                                        <input
                                            type="text"
                                            required
                                            name="full_name"
                                            {...register("full_name")}
                                            aria-invalid={Boolean(errors.full_name)}
                                            placeholder="VD: Nguyễn Văn A"
                                            className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                        />
                                    </div>
                                    <FieldError message={errors.full_name?.message} />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Số điện thoại cá nhân <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3.5 top-2.5 size-4 text-gray-400" />
                                        <input
                                            type="tel"
                                            required
                                            name="phone_number"
                                            {...register("phone_number")}
                                            aria-invalid={Boolean(errors.phone_number)}
                                            placeholder="VD: 0987654321"
                                            className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                        />
                                    </div>
                                    <FieldError message={errors.phone_number?.message} />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Giới tính
                                    </label>
                                    <div className="flex items-center gap-6 pt-2">
                                        <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="Nam"
                                                {...register("gender")}
                                                className="text-emerald-600"
                                            />
                                            Nam
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="Nữ"
                                                {...register("gender")}
                                                className="text-emerald-600"
                                            />
                                            Nữ
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Thông tin doanh nghiệp */}
                        <div className="space-y-4 pt-4 border-t border-gray-100">
                            <h2 className="text-base font-bold text-gray-900 border-l-4 border-primary pl-3">
                                Thông tin doanh nghiệp
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Tên công ty đầy đủ <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3.5 top-2.5 size-4 text-gray-400" />
                                        <input
                                            type="text"
                                            required
                                            name="company_name"
                                            {...register("company_name")}
                                            aria-invalid={Boolean(errors.company_name)}
                                            placeholder="VD: CÔNG TY CỔ PHẦN CÔNG NGHỆ TOPCV VIỆT NAM"
                                            className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                                        />
                                    </div>
                                    <FieldError message={errors.company_name?.message} />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Mã số thuế (MST) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        name="tax_code"
                                        {...register("tax_code")}
                                        aria-invalid={Boolean(errors.tax_code)}
                                        placeholder="VD: 0108888888"
                                        className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                    />
                                    <FieldError message={errors.tax_code?.message} />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Tên quốc tế (International Name)
                                    </label>
                                    <input
                                        type="text"
                                        name="international_name"
                                        {...register("international_name")}
                                        aria-invalid={Boolean(errors.international_name)}
                                        placeholder="VD: TOPCV VIETNAM JOINT STOCK COMPANY"
                                        className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                    />
                                    <FieldError message={errors.international_name?.message} />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Người đại diện pháp luật / Giám đốc
                                    </label>
                                    <input
                                        type="text"
                                        name="director"
                                        {...register("director")}
                                        aria-invalid={Boolean(errors.director)}
                                        placeholder="VD: Trần Trung Hiếu"
                                        className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                    />
                                    <FieldError message={errors.director?.message} />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Tên viết tắt / Thương hiệu
                                    </label>
                                    <input
                                        type="text"
                                        name="short_name"
                                        {...register("short_name")}
                                        aria-invalid={Boolean(errors.short_name)}
                                        placeholder="VD: TOPCV VIETNAM"
                                        className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                    />
                                    <FieldError message={errors.short_name?.message} />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Tỉnh / Thành phố trụ sở
                                    </label>
                                    <Controller name="city_name" control={control} render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger aria-invalid={Boolean(errors.city_name)} className="w-full h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white text-sm">
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
                                    )} />
                                    <FieldError message={errors.city_name?.message} />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Quy mô công ty
                                    </label>
                                    <Controller name="company_size" control={control} render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger aria-invalid={Boolean(errors.company_size)} className="w-full h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white text-sm">
                                            <SelectValue placeholder="Chọn quy mô công ty" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Dưới 10 nhân viên">Dưới 10 nhân viên</SelectItem>
                                            <SelectItem value="10-24 nhân viên">10 - 24 nhân viên</SelectItem>
                                            <SelectItem value="25-99 nhân viên">25 - 99 nhân viên</SelectItem>
                                            <SelectItem value="100-499 nhân viên">100 - 499 nhân viên</SelectItem>
                                            <SelectItem value="500-1000 nhân viên">500 - 1000 nhân viên</SelectItem>
                                            <SelectItem value="Trên 1000 nhân viên">Trên 1000 nhân viên</SelectItem>
                                        </SelectContent>
                                        </Select>
                                    )} />
                                    <FieldError message={errors.company_size?.message} />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Địa chỉ chi tiết trụ sở chính <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3.5 top-2.5 size-4 text-gray-400" />
                                        <input
                                            type="text"
                                            required
                                            name="headquarters_address"
                                            {...register("headquarters_address")}
                                            aria-invalid={Boolean(errors.headquarters_address)}
                                            placeholder="Tầng, Tòa nhà, Số nhà, Đường, Phường, Quận..."
                                            className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                        />
                                    </div>
                                    <FieldError message={errors.headquarters_address?.message} />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Website công ty
                                    </label>
                                    <div className="relative">
                                        <Globe className="absolute left-3.5 top-2.5 size-4 text-gray-400" />
                                        <input
                                            type="url"
                                            name="website"
                                            {...register("website")}
                                            aria-invalid={Boolean(errors.website)}
                                            placeholder="https://company.vn"
                                            className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                        />
                                    </div>
                                    <FieldError message={errors.website?.message} />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-base shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="size-5 animate-spin" />
                                        Đang tạo tài khoản doanh nghiệp...
                                    </>
                                ) : (
                                    "Hoàn tất đăng ký & Đăng tin tuyển dụng ngay"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Right Campaign Marketing Banner */}
            <div className="hidden lg:block lg:w-[42%] sticky top-0 h-screen">
                <RightCampaignBanner />
            </div>

            {/* Toast feedback */}
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
