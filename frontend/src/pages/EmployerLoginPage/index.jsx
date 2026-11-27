import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEmployerAuth } from "../../stores/useEmployerAuthStore";
import RightCampaignBanner from "../../components/Employer/RightCampaignBanner";
import Toast from "../../components/ui/toast";
import { employerLoginSchema } from "../../schemas/authSchemas";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";

function FieldError({ message }) {
    return message ? <p className="mt-1.5 text-xs font-medium text-red-600">{message}</p> : null;
}

export default function EmployerLoginPage() {
    const { login } = useEmployerAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState("");
    const [toast, setToast] = useState({ message: "", type: "success" });
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(employerLoginSchema),
        defaultValues: { email: "", password: "" },
        mode: "onTouched",
    });

    const onSubmit = async ({ email, password }) => {
        setServerError("");
        try {
            await login(email.trim(), password);
            setToast({ message: "Đăng nhập thành công! Đang chuyển hướng...", type: "success" });
            setTimeout(() => navigate("/employer/post-job"), 800);
        } catch (error) {
            setServerError(error.message || "Email hoặc mật khẩu không chính xác.");
        }
    };

    return (
        <div className="min-h-screen bg-white font-[Inter,sans-serif] flex flex-col lg:flex-row">
            <div className="w-full lg:w-[58%] min-h-screen p-6 sm:p-10 lg:p-16 flex flex-col justify-between">
                <div className="max-w-md mx-auto w-full my-auto py-8">
                    <div className="mb-6">
                        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-1.5">Chào mừng bạn trở lại</h1>
                        <p className="text-xs sm:text-sm text-gray-500">Đăng nhập tài khoản Nhà tuyển dụng TopCV để bắt đầu đăng tin và tìm kiếm nhân tài.</p>
                    </div>

                    {serverError && <Toast message={serverError} type="error" onClose={() => setServerError("")} />}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-sm" noValidate>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-700">Email doanh nghiệp <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-2.5 size-4 text-gray-400" />
                                <input type="email" {...register("email")} placeholder="hr@congty.com" className={`w-full rounded-xl border bg-gray-50 py-2.5 pl-10 pr-3.5 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 ${errors.email ? "border-red-500" : "border-gray-200"}`} />
                            </div>
                            <FieldError message={errors.email?.message} />
                        </div>

                        <div>
                            <div className="mb-1 flex items-center justify-between">
                                <label className="block text-xs font-semibold text-gray-700">Mật khẩu <span className="text-red-500">*</span></label>
                                <button type="button" className="text-xs font-semibold text-emerald-700 hover:underline">Quên mật khẩu?</button>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-2.5 size-4 text-gray-400" />
                                <input type={showPassword ? "text" : "password"} {...register("password")} placeholder="Nhập mật khẩu" className={`w-full rounded-xl border bg-gray-50 py-2.5 pl-10 pr-10 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 ${errors.password ? "border-red-500" : "border-gray-200"}`} />
                                <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3.5 top-2.5 text-gray-400 hover:text-gray-600" aria-label="Hiện hoặc ẩn mật khẩu">{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button>
                            </div>
                            <FieldError message={errors.password?.message} />
                        </div>

                        <button type="submit" disabled={isSubmitting} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-base font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50">
                            {isSubmitting && <Loader2 className="size-5 animate-spin" />}
                            {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập ngay"}
                        </button>
                    </form>

                    <div className="mt-8 border-t border-gray-100 pt-6 text-center text-xs text-gray-500">Chưa có tài khoản Nhà tuyển dụng? <Link to="/employer/register" className="font-bold text-emerald-700 hover:underline">Đăng ký tài khoản mới ngay</Link></div>
                </div>
                <div className="py-4 text-center text-xs text-gray-400">© 2026 TopCV Vietnam. Tiếp lợi thế, nối thành công.</div>
            </div>

            <div className="sticky top-0 hidden h-screen lg:block lg:w-[42%]">
                <RightCampaignBanner />
            </div>

            {toast.message && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "success" })} />}
        </div>
    );
}
