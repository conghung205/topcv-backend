import { Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";

export default function EmployerFooter() {
    return (
        <footer className="bg-[#002b33] text-gray-300 pt-14 pb-8 font-[Inter,sans-serif] border-t border-emerald-950">
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-emerald-900/60">
                    {/* Col 1: About */}
                    <div className="space-y-4">
                        <div className="flex h-10 w-28 items-center justify-center overflow-hidden rounded-[6px]">
                            <img src={logo} alt="TopCV" className="h-full w-full rounded-[6px] object-cover object-center" />
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Hệ sinh thái nhân sự và nền tảng tuyển dụng thông minh hàng đầu tại Việt Nam.
                        </p>
                        <div className="text-sm space-y-1.5 text-gray-300">
                            <p className="flex items-center gap-2">
                                <Phone className="size-3.5 text-emerald-400 shrink-0" />
                                <span>Hotline: <strong>024 6680 5588</strong></span>
                            </p>
                            <p className="flex items-center gap-2">
                                <Mail className="size-3.5 text-emerald-400 shrink-0" />
                                <span>Email: hotro.ntd@topcv.vn</span>
                            </p>
                        </div>
                    </div>

                    {/* Col 2: Services */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
                            Dành cho Nhà tuyển dụng
                        </h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#services" className="hover:text-emerald-400 transition">Đăng tin tuyển dụng miễn phí</a></li>
                            <li><a href="#services" className="hover:text-emerald-400 transition">Tìm kiếm hồ sơ ứng viên</a></li>
                            <li><a href="#services" className="hover:text-emerald-400 transition">Smart Matching Tuyển Dụng</a></li>
                            <li><a href="#pricing" className="hover:text-emerald-400 transition">Báo giá dịch vụ & VIP</a></li>
                            <li><a href="#services" className="hover:text-emerald-400 transition">Quản lý tuyển dụng ATS</a></li>
                        </ul>
                    </div>

                    {/* Col 3: Resources */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
                            Tài nguyên & Hỗ trợ
                        </h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#blog" className="hover:text-emerald-400 transition">Cẩm nang tuyển dụng HR</a></li>
                            <li><a href="#blog" className="hover:text-emerald-400 transition">Báo cáo thị trường lương 2026</a></li>
                            <li><a href="#support" className="hover:text-emerald-400 transition">Trung tâm trợ giúp NTD</a></li>
                            <li><a href="#support" className="hover:text-emerald-400 transition">Quy định & Chính sách duyệt tin</a></li>
                            <li><a href="#support" className="hover:text-emerald-400 transition">Điều khoản bảo mật thông tin</a></li>
                        </ul>
                    </div>

                    {/* Col 4: Quick candidate link */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
                            Hệ thống TopCV
                        </h4>
                        <p className="text-sm text-gray-400">
                            Bạn là người tìm việc? Chuyển sang Cổng Ứng viên để tạo CV và tìm việc làm phù hợp.
                        </p>
                        <Link
                            to="/"
                            className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition"
                        >
                            Trang chủ Người tìm việc
                        </Link>
                    </div>
                </div>

                <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-4">
                    <p>© 2026 TopCV Vietnam JSC. Tất cả quyền được bảo lưu.</p>
                    <div className="flex items-center gap-4">
                        <a href="#terms" className="hover:text-gray-400">Điều khoản sử dụng</a>
                        <a href="#privacy" className="hover:text-gray-400">Chính sách bảo mật</a>
                        <a href="#sitemap" className="hover:text-gray-400">Sơ đồ trang</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
