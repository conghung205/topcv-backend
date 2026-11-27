import { useNavigate } from "react-router-dom";
import { useEmployerAuth } from "../../stores/useEmployerAuthStore";
import { Check, Sparkles } from "lucide-react";
import { Button } from "../ui/button";

export default function PricingSection() {
    const { isAuthenticated } = useEmployerAuth();
    const navigate = useNavigate();

    const handleAction = () => {
        if (isAuthenticated) {
            navigate("/employer/post-job");
        } else {
            navigate("/employer/register");
        }
    };

    const plans = [
        {
            name: "Gói Khởi Nghiệp",
            price: "0",
            period: "Miễn phí vĩnh viễn",
            desc: "Dành cho doanh nghiệp mới bắt đầu trải nghiệm tuyển dụng trên TopCV.",
            isPopular: false,
            badge: "Trải nghiệm",
            features: [
                "Đăng 03 tin tuyển dụng thường",
                "Tiếp cận 5.4M hồ sơ ứng viên",
                "Quản lý hồ sơ ứng tuyển cơ bản",
                "Hệ thống hỗ trợ tạo JD tự động",
                "Hỗ trợ qua email & tài liệu hướng dẫn"
            ],
            cta: "Đăng ký miễn phí",
            buttonVariant: "outline"
        },
        {
            name: "Gói Tiêu Chuẩn Nổi Bật",
            price: "1.890.000",
            period: "VNĐ / tháng",
            desc: "Tăng tốc tuyển dụng với huy hiệu HOT và đẩy top tin tự động hàng ngày.",
            isPopular: true,
            badge: "Được chọn nhiều nhất",
            features: [
                "Đăng 15 tin tuyển dụng gắn huy hiệu HOT",
                "Tự động làm mới & đẩy top mỗi ngày",
                "Hệ thống Smart Matching lọc ứng viên phù hợp",
                "Mở xem 50 hồ sơ ứng viên chủ động",
                "Hệ thống ATS phân loại & hẹn phỏng vấn",
                "Hỗ trợ kỹ thuật ưu tiên qua hotline riêng"
            ],
            cta: "Trải nghiệm ngay",
            buttonVariant: "default"
        },
        {
            name: "Gói Doanh Nghiệp VIP Pro",
            price: "4.500.000",
            period: "VNĐ / tháng",
            desc: "Giải pháp toàn diện tối đa hóa chuyển đổi cho doanh nghiệp tăng trưởng nhanh.",
            isPopular: false,
            badge: "Cao cấp",
            features: [
                "Đăng tin tuyển dụng không giới hạn",
                "Smart Matching phân tích chuyên sâu 85%+",
                "Mở xem 200 hồ sơ ứng viên chất lượng cao",
                "Trang Employer Branding riêng biệt",
                "Banner quảng bá thương hiệu trang chủ",
                "Chuyên viên tuyển dụng (Account Manager) đồng hành 1-1"
            ],
            cta: "Liên hệ tư vấn VIP",
            buttonVariant: "outline"
        }
    ];

    return (
        <section id="pricing" className="py-16 bg-white font-[Inter,sans-serif]">
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 tracking-wide uppercase inline-block mb-3">
                        Bảng giá minh bạch
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight mb-3">
                        Lựa chọn gói dịch vụ tối ưu ngân sách
                    </h2>
                    <p className="text-sm text-gray-600">
                        Đăng tin miễn phí ngay hôm nay hoặc nâng cấp gói dịch vụ để đẩy nhanh tốc độ tuyển dụng gấp 3 lần.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                                plan.isPopular
                                    ? "bg-gradient-to-b from-emerald-900 to-teal-950 text-white shadow-2xl shadow-emerald-900/30 border-2 border-emerald-400 ring-4 ring-emerald-500/10 scale-100 lg:-translate-y-2"
                                    : "bg-white border border-gray-200 text-gray-900 shadow-md hover:shadow-xl hover:border-emerald-300"
                            }`}
                        >
                            {/* Popular Badge */}
                            {plan.isPopular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-emerald-400 to-teal-300 text-gray-950 font-black text-xs uppercase tracking-wider shadow-md flex items-center gap-1.5">
                                    <Sparkles className="size-3.5 fill-gray-950" /> {plan.badge}
                                </div>
                            )}

                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className={`text-xl font-bold ${plan.isPopular ? "text-white" : "text-gray-900"}`}>
                                        {plan.name}
                                    </h3>
                                    {!plan.isPopular && (
                                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                                            {plan.badge}
                                        </span>
                                    )}
                                </div>

                                <p className={`text-sm mb-6 ${plan.isPopular ? "text-emerald-200/80" : "text-gray-500"}`}>
                                    {plan.desc}
                                </p>

                                <div className="mb-6 pb-6 border-b border-gray-100/20">
                                    <span className="text-3xl sm:text-4xl font-black">{plan.price}</span>{" "}
                                    <span className={`text-xs font-semibold ${plan.isPopular ? "text-emerald-300" : "text-gray-500"}`}>
                                        {plan.period}
                                    </span>
                                </div>

                                <div className="space-y-3.5 mb-8">
                                    <p className={`text-sm font-bold uppercase tracking-wider ${plan.isPopular ? "text-emerald-300" : "text-gray-700"}`}>
                                        Quyền lợi bao gồm:
                                    </p>
                                    {plan.features.map((feat, fIdx) => (
                                        <div key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                                            <div
                                                className={`size-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                                                    plan.isPopular ? "bg-emerald-400 text-gray-950" : "bg-emerald-100 text-emerald-700"
                                                }`}
                                            >
                                                <Check className="size-3 stroke-[3]" />
                                            </div>
                                            <span className={plan.isPopular ? "text-gray-100" : "text-gray-700"}>
                                                {feat}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Button
                                onClick={handleAction}
                                className={`w-full h-11 rounded-xl font-bold text-sm shadow-md transition cursor-pointer ${
                                    plan.isPopular
                                        ? "bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 text-gray-950 font-black shadow-emerald-400/20"
                                        : "bg-primary hover:bg-primary/90 text-white shadow-emerald-600/20"
                                }`}
                            >
                                {plan.cta}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
