import { Sparkles, Bot, Search, BarChart3, ShieldCheck, Zap } from "lucide-react";

export default function FeaturesSection() {
    const features = [
        {
            title: "Smart Matching Tuyển Dụng",
            desc: "Thuật toán thông minh phân tích hơn 30 tiêu chí giữa JD và CV, tự động xếp hạng độ phù hợp ứng viên chính xác tới 85%.",
            icon: Bot,
            badge: "Công nghệ lõi",
            color: "from-emerald-500 to-teal-600",
        },
        {
            title: "Tạo JD Tự động & Chuẩn SEO",
            desc: "Chỉ cần 1 câu lệnh ngắn, hệ thống tự động sinh mô tả công việc, yêu cầu chuyên môn và quyền lợi chuẩn quốc tế trong 3 giây.",
            icon: Sparkles,
            badge: "Tiết kiệm 80% time",
            color: "from-teal-500 to-cyan-600",
        },
        {
            title: "Tìm kiếm Hồ sơ Đa chiều",
            desc: "Bộ lọc thông minh theo kỹ năng, số năm kinh nghiệm, mức lương kỳ vọng và địa điểm chính xác từ kho 5.4 triệu ứng viên.",
            icon: Search,
            badge: "Smart Filter",
            color: "from-blue-500 to-indigo-600",
        },
        {
            title: "Quản lý Ứng viên ATS Toàn diện",
            desc: "Theo dõi toàn bộ phễu tuyển dụng: Tiếp nhận CV, Đánh giá, Lên lịch phỏng vấn và Gửi thư mời nhận việc tập trung trên 1 màn hình.",
            icon: BarChart3,
            badge: "All-in-one",
            color: "from-amber-500 to-orange-600",
        },
        {
            title: "Định vị Thương hiệu Tuyển dụng",
            desc: "Xây dựng Company Profile ấn tượng, khẳng định văn hóa doanh nghiệp và thu hút nhân tài hàng đầu thị trường.",
            icon: ShieldCheck,
            badge: "Employer Branding",
            color: "from-purple-500 to-pink-600",
        },
        {
            title: "Đăng tin Tốc độ & Tiếp cận Tức thì",
            desc: "Tin tuyển dụng được tự động đẩy lên các vị trí tìm kiếm nổi bật, tiếp cận ngay các ứng viên đang chủ động tìm việc.",
            icon: Zap,
            badge: "Tiếp cận nhanh",
            color: "from-rose-500 to-red-600",
        },
    ];

    return (
        <section id="services" className="py-16 bg-[#f8fafc] font-[Inter,sans-serif]">
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
                {/* Title */}
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 tracking-wide uppercase inline-block mb-3">
                        Hệ sinh thái Tuyển dụng Thông minh
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight mb-3">
                        Giải pháp tuyển dụng toàn diện và đột phá
                    </h2>
                    <p className="text-sm text-gray-600">
                        Ứng dụng trí tuệ nhân tạo giúp doanh nghiệp tối ưu hóa chi phí và chiêu mộ nhân tài nhanh chóng.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feat, index) => {
                        const IconComponent = feat.icon;
                        return (
                            <div
                                key={index}
                                className="group relative bg-white rounded-3xl p-6 border border-gray-100 hover:border-emerald-300 shadow-xs hover:shadow-sm transition-all duration-300 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div
                                            className={`size-12 rounded-2xl bg-gradient-to-br ${feat.color} text-white flex items-center justify-center shadow-md`}
                                        >
                                            <IconComponent className="size-6" />
                                        </div>
                                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-700 group-hover:bg-emerald-50 group-hover:text-emerald-700 transition">
                                            {feat.badge}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition">
                                        {feat.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {feat.desc}
                                    </p>
                                </div>

                                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-emerald-600">
                                    <span>Khám phá ngay</span>
                                    <span className="group-hover:translate-x-1 transition duration-200">→</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
