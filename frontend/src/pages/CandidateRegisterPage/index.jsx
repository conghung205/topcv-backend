import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import { useCandidateAuth } from "../../stores/useCandidateAuthStore";
import AuthField from "../../components/Auth/AuthField";
import { registerSchema } from "../../schemas/authSchemas";
import Toast from "../../components/ui/toast";

export default function CandidateRegisterPage() {
    const { register: registerCandidate, isLoading } = useCandidateAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [toast, setToast] = useState({ message: "", type: "error" });
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: { full_name: "", email: "", password: "", confirm_password: "", agree_terms: false },
        mode: "onTouched",
    });

    const onSubmit = async ({ full_name, email, password }) => {
        try {
            await registerCandidate({ full_name: full_name.trim(), email: email.trim(), password });
            navigate("/", { replace: true });
        } catch (error) {
            setToast({ message: error.message || "Đăng ký không thành công. Vui lòng thử lại.", type: "error" });
        }
    };

    return (
        <div>
            <div className="mb-7 text-center">
                <h1 className="text-2xl font-black tracking-tight text-gray-950">Tạo tài khoản ứng viên</h1>
                <p className="mt-2 text-sm text-gray-500">Mở ra cơ hội nghề nghiệp phù hợp với bạn</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <AuthField label="Họ và tên" icon={User} type="text" placeholder="Nguyễn Văn A" error={errors.full_name?.message} {...register("full_name")} />
                <AuthField label="Email cá nhân" icon={Mail} type="email" placeholder="ungvien@example.com" error={errors.email?.message} {...register("email")} />
                <AuthField label="Mật khẩu" icon={Lock} type={showPassword ? "text" : "password"} placeholder="Tối thiểu 6 ký tự" error={errors.password?.message} rightAction={<button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-700" aria-label="Hiện hoặc ẩn mật khẩu">{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button>} {...register("password")} />
                <AuthField label="Nhập lại mật khẩu" icon={Lock} type={showConfirmPassword ? "text" : "password"} placeholder="Xác nhận mật khẩu" error={errors.confirm_password?.message} rightAction={<button type="button" onClick={() => setShowConfirmPassword((value) => !value)} className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-700" aria-label="Hiện hoặc ẩn mật khẩu xác nhận">{showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button>} {...register("confirm_password")} />
                <label className="flex cursor-pointer items-start gap-2.5 pt-1 text-xs leading-5 text-gray-600"><input type="checkbox" className="mt-0.5 size-4 accent-[#00b14f]" {...register("agree_terms")} /><span>Tôi đã đọc và đồng ý với <strong>Điều khoản dịch vụ</strong> và <strong>Chính sách bảo mật</strong> của TopCV.</span></label>
                {errors.agree_terms?.message && <p className="-mt-2 text-xs font-medium text-red-600">{errors.agree_terms.message}</p>}
                <button type="submit" disabled={isLoading} className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60">{isLoading && <Loader2 className="size-4 animate-spin" />} {isLoading ? "Đang tạo tài khoản..." : "Đăng ký tài khoản ngay"}</button>
            </form>
            <p className="mt-6 border-t border-gray-100 pt-5 text-center text-sm text-gray-500">Đã có tài khoản? <Link to="/login" className="font-bold text-emerald-600 hover:underline">Đăng nhập ngay →</Link></p>
            <p className="mt-4 text-center text-xs text-gray-400">Bạn là nhà tuyển dụng? <Link to="/employer/register" className="font-semibold text-gray-600 hover:text-emerald-600">Đăng ký nhà tuyển dụng</Link></p>
            {toast.message && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "error" })} />}
        </div>
    );
}
