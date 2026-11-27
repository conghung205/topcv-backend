import { Link } from "react-router-dom";
import {
    MapPin,
    Phone,
    Mail,
    ShieldCheck,
    Award,
    Globe
} from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#f8fafc] text-gray-600 text-xs pt-12 pb-8 border-t border-border print:hidden">
            <div className="max-w-[1200px] mx-auto px-6">
                {/* Top Row: Brand & Highlight Stats */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#e5e7eb]">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-black tracking-tight text-text">
                                Top<span className="text-primary">CV</span>
                            </span>
                            <span className="text-[10px] font-bold bg-emerald-50 text-primary px-2 py-0.5 rounded-full border border-emerald-200">
                                PRO
                            </span>
                        </div>
                        <span className="hidden sm:inline-block text-gray-300">|</span>
                        <p className="text-xs text-gray-500 font-medium">
                            Tiếp lợi thế, Nối thành công - Hệ sinh thái công nghệ nhân sự hàng đầu Việt Nam
                        </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-semibold text-gray-700">
                        <span className="inline-flex items-center gap-1.5 text-primary">
                            <ShieldCheck className="size-4" /> Xác thực dữ liệu
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-amber-600">
                            <Award className="size-4" /> Doanh nghiệp uy tín
                        </span>
                    </div>
                </div>

                {/* Main 4-Column Footer Links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-10">
                    {/* Col 1: Về TopCV */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-text uppercase tracking-wider">
                            Về TopCV
                        </h3>
                        <ul className="space-y-2.5">
                            <li>
                                <Link to="/gioi-thieu" className="text-text hover:text-primary transition-colors font-medium">
                                    Giới thiệu TopCV
                                </Link>
                            </li>
                            <li>
                                <Link to="/vieclam" className="text-text hover:text-primary transition-colors font-medium">
                                    Cơ hội việc làm
                                </Link>
                            </li>
                            <li>
                                <Link to="/dieu-khoan" className="text-text hover:text-primary transition-colors font-medium">
                                    Điều khoản dịch vụ
                                </Link>
                            </li>
                            <li>
                                <Link to="/chinh-sach" className="text-text hover:text-primary transition-colors font-medium">
                                    Chính sách bảo mật
                                </Link>
                            </li>
                            <li>
                                <Link to="/lien-he" className="text-text hover:text-primary transition-colors font-medium">
                                    Liên hệ hợp tác
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Col 2: Dành cho ứng viên */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-text uppercase tracking-wider">
                            Dành cho ứng viên
                        </h3>
                        <ul className="space-y-2.5">
                            <li>
                                <Link to="/tim-viec-lam" className="text-text hover:text-primary transition-colors font-medium">
                                    Tìm kiếm việc làm
                                </Link>
                            </li>
                            <li>
                                <Link to="/tao-cv" className="text-text hover:text-primary transition-colors font-medium">
                                    Tạo CV trực tuyến
                                </Link>
                            </li>
                            <li>
                                <Link to="/mau-cv" className="text-text hover:text-primary transition-colors font-medium">
                                    Mẫu CV chuyên nghiệp
                                </Link>
                            </li>
                            <li>
                                <Link to="/viec-lam-tot-nhat" className="text-text hover:text-primary transition-colors font-medium">
                                    Việc làm tốt nhất
                                </Link>
                            </li>
                            <li>
                                <Link to="/blog/bi-kip-tim-viec" className="text-text hover:text-primary transition-colors font-medium">
                                    Cẩm nang & Bí kíp phỏng vấn
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Col 3: Dành cho nhà tuyển dụng */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-text uppercase tracking-wider">
                            Nhà tuyển dụng
                        </h3>
                        <ul className="space-y-2.5">
                            <li>
                                <Link to="/employer/post-job" className="text-text hover:text-primary transition-colors font-medium">
                                    Đăng tin tuyển dụng
                                </Link>
                            </li>
                            <li>
                                <Link to="/employer" className="text-text hover:text-primary transition-colors font-medium">
                                    Tìm kiếm ứng viên tài năng
                                </Link>
                            </li>
                            <li>
                                <Link to="/employer/dashboard" className="text-text hover:text-primary transition-colors font-medium">
                                    Bảng quản lý tuyển dụng
                                </Link>
                            </li>
                            <li>
                                <Link to="/employer/login" className="text-text hover:text-primary transition-colors font-medium">
                                    Cổng Nhà Tuyển Dụng
                                </Link>
                            </li>
                            <li>
                                <Link to="/admin/companies" className="text-text hover:text-primary transition-colors font-medium">
                                    Danh sách công ty
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Col 4: Liên hệ & Trụ sở */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-text uppercase tracking-wider">
                            Liên hệ hỗ trợ
                        </h3>
                        <div className="space-y-2.5">
                            <div className="flex items-start gap-2 text-gray-600">
                                <Phone className="size-4 text-primary shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-text">Hotline tư vấn</p>
                                    <p className="text-gray-500">(024) 6680 5588 - (028) 6680 5588</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2 text-gray-600">
                                <Mail className="size-4 text-primary shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-text">Email hỗ trợ</p>
                                    <p className="text-gray-500">hotro@topcv.vn</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2 text-gray-600">
                                <MapPin className="size-4 text-primary shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-text">Trụ sở Hà Nội</p>
                                    <p className="text-gray-500">Tầng 3, Tòa nhà Goldseason, 47 Nguyễn Tuân, Thanh Xuân</p>
                                </div>
                            </div>
                        </div>

                        {/* Social Icons */}
                        <div className="pt-2">
                            <p className="text-xs font-semibold text-text mb-2">Kết nối với chúng tôi</p>
                            <div className="flex items-center gap-3">
                                <a
                                    href="https://facebook.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="Facebook"
                                    className="size-8 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-primary hover:text-white hover:border-primary flex items-center justify-center transition shadow-2xs"
                                >
                                    <svg className="size-4 fill-current" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                </a>
                                <a
                                    href="https://linkedin.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="LinkedIn"
                                    className="size-8 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-primary hover:text-white hover:border-primary flex items-center justify-center transition shadow-2xs"
                                >
                                    <svg className="size-4 fill-current" viewBox="0 0 24 24">
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                    </svg>
                                </a>
                                <a
                                    href="https://youtube.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="YouTube"
                                    className="size-8 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-primary hover:text-white hover:border-primary flex items-center justify-center transition shadow-2xs"
                                >
                                    <svg className="size-4 fill-current" viewBox="0 0 24 24">
                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                    </svg>
                                </a>
                                <a
                                    href="https://topcv.vn"
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="Website"
                                    className="size-8 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-primary hover:text-white hover:border-primary flex items-center justify-center transition shadow-2xs"
                                >
                                    <Globe className="size-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar: Copyright */}
                <div className="pt-6 border-t border-[#e5e7eb] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-500">
                    <p>© 2026 TopCV Vietnam JSC. Tất cả quyền được bảo lưu.</p>
                    <p className="flex items-center gap-2">
                        <span>Giấy phép MXH số 256/GP-BTTTT</span>
                        <span>•</span>
                        <span>Hệ thống tuyển dụng thông minh Smart Recruitment</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
