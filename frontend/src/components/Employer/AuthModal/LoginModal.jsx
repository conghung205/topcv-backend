import { useState } from "react";
import Modal from "../../ui/modal";
import { Button } from "../../ui/button";
import logo from "../../../assets/images/logo.png";
import { useEmployerAuth } from "../../../stores/useEmployerAuthStore";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginModal({ isOpen, onClose, onSwitchToRegister, onSuccess }) {
    const { login } = useEmployerAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!email || !password) {
            setError("Vui lòng nhập đầy đủ Email và Mật khẩu.");
            return;
        }

        setLoading(true);
        try {
            await login(email, password);
            onClose();
            if (onSuccess) onSuccess();
        } catch (err) {
            setError(err.message || "Email hoặc mật khẩu không chính xác.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
            <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center size-12 rounded-2xl bg-emerald-50 text-emerald-600 mb-3 font-bold text-xl">
                    <img src={logo} alt="TopCV" className="h-6 w-auto" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Chào mừng trở lại!</h2>
                <p className="text-sm text-gray-500 mt-1">Đăng nhập tài khoản Nhà tuyển dụng TopCV</p>
            </div>

            {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                        Email doanh nghiệp <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                            <Mail className="size-4" />
                        </div>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="hr@congty.com"
                            className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                        />
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Mật khẩu <span className="text-red-500">*</span>
                        </label>
                        <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-xs text-emerald-600 hover:underline font-medium">
                            Quên mật khẩu?
                        </a>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                            <Lock className="size-4" />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-10 pr-10 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2 text-sm"
                >
                    {loading ? (
                        <>
                            <Loader2 className="size-4 animate-spin" />
                            Đang xử lý...
                        </>
                    ) : (
                        "Đăng nhập ngay"
                    )}
                </Button>
            </form>

            <div className="mt-6 pt-5 border-t border-gray-100 text-center text-xs text-gray-500">
                Doanh nghiệp chưa có tài khoản?{" "}
                <button
                    type="button"
                    onClick={() => {
                        onClose();
                        if (onSwitchToRegister) onSwitchToRegister();
                    }}
                    className="text-emerald-600 font-bold hover:underline"
                >
                    Đăng ký Nhà tuyển dụng
                </button>
            </div>
        </Modal>
    );
}
