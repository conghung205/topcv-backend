import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Sparkles } from "lucide-react";

const CAMPAIGNS = [
    {
        title: "Manage your works with",
        accent: "Campaigns",
        description: "Tối ưu hóa quy trình tuyển dụng thông minh, theo dõi hiệu quả từng chiến dịch và quản lý ứng viên bằng công nghệ AI hàng đầu.",
        leftMetric: "+45 CV hôm nay",
        rightMetric: "92%",
    },
    {
        title: "Find the right talent with",
        accent: "Smart Matching",
        description: "Kết nối doanh nghiệp với ứng viên phù hợp nhanh hơn nhờ dữ liệu tuyển dụng trực quan và bộ lọc thông minh.",
        leftMetric: "+85% phù hợp",
        rightMetric: "12 cuộc hẹn",
    },
    {
        title: "Grow your team with",
        accent: "TopCV ATS",
        description: "Quản lý toàn bộ quy trình tuyển dụng trên một nền tảng, từ đăng tin đến theo dõi hồ sơ ứng viên.",
        leftMetric: "4 Offer mới",
        rightMetric: "Đang hoạt động",
    },
];

function CampaignSlide({ campaign }) {
    return (
        <div className="flex h-full flex-col justify-between px-8 py-8 lg:px-12 lg:py-12">
            <div className="relative z-10 pt-4">
                <h2 className="text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl lg:text-[34px]">
                    {campaign.title} <br />
                    <span className="text-primary">{campaign.accent}</span>
                </h2>
                <p className="mt-2.5 max-w-sm text-xs leading-relaxed text-gray-300 sm:text-sm">
                    {campaign.description}
                </p>
            </div>

            <div className="relative z-10 my-8 flex items-center justify-center">
                <div className="relative flex h-[280px] w-full max-w-[420px] items-center justify-center">
                    <svg className="pointer-events-none absolute inset-0 z-20 h-full w-full" viewBox="0 0 400 280" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M 20 250 C 120 240, 160 140, 260 180 C 310 200, 340 100, 370 40" stroke="#00b14f" strokeWidth="12" strokeLinecap="round" className="drop-shadow-[0_0_15px_rgba(0,177,79,0.7)]" />
                        <polygon points="370,25 390,55 350,55" fill="#00b14f" className="drop-shadow-[0_0_20px_rgba(0,177,79,0.9)]" />
                    </svg>

                    <div className="relative z-10 flex scale-95 items-end gap-3 sm:scale-100">
                        <div className="h-32 w-44 -rotate-6 transform rounded-xl border-2 border-gray-700/80 bg-gray-900/90 p-2 shadow-2xl backdrop-blur-sm transition duration-300 hover:rotate-0">
                            <div className="flex items-center justify-between border-b border-gray-800 pb-1">
                                <div className="flex items-center gap-1"><span className="size-1.5 rounded-full bg-red-400" /><span className="size-1.5 rounded-full bg-amber-400" /><span className="size-1.5 rounded-full bg-emerald-400" /></div>
                                <span className="font-mono text-[8px] font-bold text-emerald-400">TopCV ATS</span>
                            </div>
                            <div className="my-1 space-y-1">
                                <div className="h-2 w-3/4 rounded bg-gray-800" />
                                <div className="flex h-2 items-center rounded bg-emerald-950 px-1 text-[7px] text-emerald-300">{campaign.leftMetric}</div>
                            </div>
                            <div className="grid grid-cols-3 gap-1 border-t border-gray-800 pt-1">
                                <div className="flex h-6 items-center justify-center rounded bg-emerald-900/40 text-[7px] font-bold text-emerald-300">85% Match</div>
                                <div className="flex h-6 items-center justify-center rounded bg-teal-900/40 text-[7px] font-bold text-teal-300">12 Phỏng vấn</div>
                                <div className="flex h-6 items-center justify-center rounded bg-blue-900/40 text-[7px] font-bold text-blue-300">4 Offer</div>
                            </div>
                        </div>

                        <div className="h-36 w-52 rotate-6 transform rounded-xl border-2 border-emerald-500/60 bg-gray-900/95 p-2.5 shadow-2xl backdrop-blur-sm transition duration-300 hover:rotate-0">
                            <div className="flex items-center justify-between border-b border-gray-800 pb-1">
                                <span className="flex items-center gap-1 text-[9px] font-bold text-white"><Sparkles className="size-2.5 text-emerald-400" /> Toppy AI Funnel</span>
                                <span className="rounded bg-emerald-950/80 px-1.5 py-0.5 text-[8px] font-bold text-emerald-400">LIVE</span>
                            </div>
                            <div className="my-1.5 space-y-1.5">
                                <div className="flex items-center justify-between text-[8px] text-gray-300"><span>Senior React Developer</span><span className="font-bold text-emerald-400">{campaign.rightMetric}</span></div>
                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-800"><div className="h-full w-4/5 bg-gradient-to-r from-emerald-500 to-teal-400" /></div>
                            </div>
                            <div className="flex h-7 items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-950/90 px-2 text-[8px]"><span className="text-gray-300">Tự động đẩy top:</span><span className="font-bold text-emerald-300">Hoạt động</span></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative z-10 flex flex-col items-center gap-1 pt-4 text-center">
                <div className="flex items-center gap-1 text-2xl font-black tracking-tight text-white"><span>top</span><span className="text-primary">cv</span><span className="-ml-0.5 mt-1.5 size-1.5 self-start rounded-full bg-primary" /></div>
                <p className="text-[11px] font-medium tracking-wide text-gray-400">Tiếp lợi thế, nối thành công</p>
            </div>
        </div>
    );
}

export default function RightCampaignBanner() {
    return (
        <div className="relative h-full w-full overflow-hidden bg-gradient-to-b from-[#091524] via-[#0c1a2d] to-[#07101c] text-white">
            <div className="pointer-events-none absolute right-0 top-1/4 size-80 rounded-full bg-emerald-500/15 blur-3xl" />
            <div className="pointer-events-none absolute bottom-1/4 left-0 size-72 rounded-full bg-teal-500/10 blur-3xl" />
            <Swiper
                modules={[Autoplay, Pagination]}
                slidesPerView={1}
                loop
                autoplay={{ delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }}
                pagination={{ clickable: true }}
                className="campaign-swiper relative z-10 h-full w-full"
            >
                {CAMPAIGNS.map((campaign) => (
                    <SwiperSlide key={campaign.accent} className="h-full"><CampaignSlide campaign={campaign} /></SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
