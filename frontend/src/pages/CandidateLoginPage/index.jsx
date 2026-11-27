import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useCandidateAuth } from "../../stores/useCandidateAuthStore";
import AuthField from "../../components/Auth/AuthField";
import { loginSchema } from "../../schemas/authSchemas";
import Toast from "../../components/ui/toast";

export default function CandidateLoginPage() {
    const { login, isLoading } = useCandidateAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [showPassword, setShowPassword] = useState(false);
    const [toast, setToast] = useState({ message: "", type: "error" });
    const from = location.state?.from?.pathname || "/";
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
        mode: "onTouched",
    });

    const onSubmit = async ({ email, password }) => {
        try {
            await login(email, password);
            navigate(from, { replace: true });
        } catch (error) {
            setToast({ message: error.message || "Đăng nhập không thành công. Vui lòng thử lại.", type: "error" });
        }
    };

    return (
        <div>
            <div className="mb-7 text-center">
                <h1 className="text-2xl font-black tracking-tight text-gray-950">Đăng nhập tài khoản</h1>
                <p className="mt-2 text-sm text-gray-500">Tiếp tục hành trình nghề nghiệp cùng TopCV</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <AuthField label="Email đăng nhập" icon={Mail} type="email" placeholder="ungvien@example.com" error={errors.email?.message} {...register("email")} />
                <AuthField label="Mật khẩu" icon={Lock} type={showPassword ? "text" : "password"} placeholder="Nhập mật khẩu" error={errors.password?.message} rightAction={<button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-700" aria-label="Hiện hoặc ẩn mật khẩu">{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button>} {...register("password")} />
                <button type="button" className="-mt-1 block w-full text-right text-xs font-semibold text-emerald-600 hover:underline">Quên mật khẩu?</button>
                <button type="submit" disabled={isLoading} className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60">{isLoading && <Loader2 className="size-4 animate-spin" />} {isLoading ? "Đang đăng nhập..." : "Đăng nhập ngay"}</button>
            </form>
            <p className="mt-6 border-t border-gray-100 pt-5 text-center text-sm text-gray-500">Chưa có tài khoản? <Link to="/register" className="font-bold text-emerald-600 hover:underline">Đăng ký ngay →</Link></p>
            <p className="mt-4 text-center text-xs text-gray-400">Bạn là nhà tuyển dụng? <Link to="/employer/login" className="font-semibold text-gray-600 hover:text-emerald-600">Đăng nhập nhà tuyển dụng</Link></p>
            {toast.message && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "error" })} />}
        </div>
    );
}
