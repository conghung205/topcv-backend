import { useState, useMemo, useCallback } from "react";
import { useQueries } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight, Briefcase, Plus, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCompanies, useJobs } from "@/hooks";
import candidateService from "../../../services/candidateService";

const CATEGORIES = [
    "Tất cả",
    "IT - Phần mềm",
    "Ngân hàng",
    "Tài chính",
    "Bất động sản",
    "Sản xuất",
    "Bán lẻ - FMCG",
    "Logistics - Vận tải"
];

export default function TopBrandsSection() {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState("Tất cả");
    const [followed, setFollowed] = useState({});

    const { data: compRes, isLoading: compsLoading } = useCompanies({ page: 1 });
    const { data: firstJobsRes, isLoading: firstJobsLoading } = useJobs({ page: 1 });

    const firstJobs = useMemo(() => (
        Array.isArray(firstJobsRes?.data)
            ? firstJobsRes.data
            : (Array.isArray(firstJobsRes) ? firstJobsRes : [])
    ), [firstJobsRes]);
    const jobPageCount = Math.max(1, Math.ceil((Number(firstJobsRes?.total) || firstJobs.length) / 20));
    const additionalJobQueries = useQueries({
        queries: Array.from({ length: Math.max(0, jobPageCount - 1) }, (_, index) => ({
            queryKey: ["jobs", { page: index + 2 }],
            queryFn: () => candidateService.getJobs({ page: index + 2 }),
            enabled: !firstJobsLoading,
        })),
    });

    const realCompanies = useMemo(() => {
        if (compRes?.data && Array.isArray(compRes.data)) return compRes.data;
        if (Array.isArray(compRes)) return compRes;
        return [];
    }, [compRes]);

    const loading = compsLoading || firstJobsLoading || additionalJobQueries.some((query) => query.isLoading);

    const companyJobCounts = useMemo(() => {
        const counts = new Map();
        const allJobs = [
            ...firstJobs,
            ...additionalJobQueries.flatMap((query) => {
                const data = query.data;
                return Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
            }),
        ];

        allJobs.forEach((job) => {
            const company = job.company;
            if (!company) return;

            const companyId = company.id ? String(company.id) : null;
            const companyName = company.company_name?.trim().toLowerCase();
            [companyId, companyName].filter(Boolean).forEach((key) => {
                counts.set(key, (counts.get(key) || 0) + 1);
            });
        });

        return counts;
    }, [firstJobs, additionalJobQueries]);

    const getCompanyJobCount = useCallback((company) => {
        const idCount = company?.id ? companyJobCounts.get(String(company.id)) : 0;
        const nameCount = company?.company_name
            ? companyJobCounts.get(company.company_name.trim().toLowerCase())
            : 0;
        return idCount || nameCount || 0;
    }, [companyJobCounts]);


    const handleFollowToggle = (name) => {
        setFollowed((prev) => ({ ...prev, [name]: !prev[name] }));
    };

    // Filter companies by selectedCategory
    const filteredCompanies = useMemo(() => {
        if (!realCompanies || realCompanies.length === 0) return [];
        if (selectedCategory === "Tất cả") return realCompanies;

        const catLower = selectedCategory.toLowerCase();
        return realCompanies.filter((c) => {
            const ind = (c.category || c.industry || c.field_of_activity || "").toLowerCase();
            const name = (c.company_name || c.short_name || "").toLowerCase();
            if (catLower.includes("it") || catLower.includes("phần mềm")) {
                return ind.includes("it") || ind.includes("phần mềm") || ind.includes("công nghệ") || name.includes("software") || name.includes("fpt");
            }
            if (catLower.includes("ngân hàng")) {
                return ind.includes("ngân hàng") || ind.includes("bank") || name.includes("bank") || name.includes("ngân hàng");
            }
            if (catLower.includes("tài chính")) {
                return ind.includes("tài chính") || ind.includes("chứng khoán") || ind.includes("bảo hiểm") || name.includes("tài chính");
            }
            if (catLower.includes("bất động sản")) {
                return ind.includes("bất động sản") || ind.includes("địa ốc") || name.includes("land") || name.includes("bất động sản");
            }
            if (catLower.includes("sản xuất")) {
                return ind.includes("sản xuất") || ind.includes("chế tạo") || ind.includes("ô tô") || name.includes("sản xuất");
            }
            if (catLower.includes("bán lẻ")) {
                return ind.includes("bán lẻ") || ind.includes("tiêu dùng") || ind.includes("fmcg") || name.includes("retail");
            }
            if (catLower.includes("logistics")) {
                return ind.includes("logistics") || ind.includes("vận tải") || ind.includes("kho vận") || name.includes("logistics");
            }
            return ind.includes(catLower) || name.includes(catLower);
        });
    }, [realCompanies, selectedCategory]);

    // Chunk filtered companies into slides (1 featured + up to 6 companies each)
    const slides = useMemo(() => {
        let list = filteredCompanies;
        if (selectedCategory === "Tất cả" && list.length === 0) {
            list = realCompanies;
        }
        if (list.length === 0) return [];


        const result = [];
        const chunkSize = 7; // 1 featured + 6 grid cards
        for (let i = 0; i < list.length; i += chunkSize) {
            const chunk = list.slice(i, i + chunkSize);
            const featuredComp = chunk[0];
            const otherComps = chunk.slice(1);

            // If only 1 company in chunk and we have more in list, fill from list
            const displayOthers = [...otherComps];
            if (displayOthers.length < 6 && list.length > 1) {
                for (const item of list) {
                    if (displayOthers.length >= 6) break;
                    if (item.id !== featuredComp.id && !displayOthers.some(o => o.id === item.id)) {
                        displayOthers.push(item);
                    }
                }
            }

            result.push({
                id: `slide-${i}`,
                featured: {
                    id: featuredComp.id,
                    name: featuredComp.company_name,
                    shortName: featuredComp.short_name || featuredComp.company_name,
                    industry: featuredComp.category || featuredComp.industry || "",
                    jobsCount: getCompanyJobCount(featuredComp),
                    logo: featuredComp.logo_url,
                    logoText: (featuredComp.short_name || featuredComp.company_name || "").slice(0, 4).toUpperCase(),
                    logoColor: "text-emerald-800 bg-emerald-50",
                    isVerified: featuredComp.verification_tier === "VERIFIED",
                },
                companies: displayOthers.map((c, cIdx) => ({
                    id: c.id,
                    name: c.company_name,
                    industry: c.category || c.industry || "",
                    jobsCount: getCompanyJobCount(c),
                    logo: c.logo_url,
                    logoText: (c.short_name || c.company_name || "").slice(0, 3).toUpperCase(),
                    logoColor: cIdx % 3 === 0 ? "text-blue-700 bg-blue-50" : cIdx % 3 === 1 ? "text-emerald-700 bg-emerald-50" : "text-amber-800 bg-amber-50"
                }))
            });
        }
        return result;
    }, [filteredCompanies, realCompanies, selectedCategory, getCompanyJobCount]);

    const handleCompanyClick = (comp) => {
        const companyId = comp.id || comp.company_id;
        const companyName = comp.name || comp.company_name;
        navigate(`/tim-viec-lam?company=${encodeURIComponent(companyId || companyName)}`);
    };

    return (
        <section className="my-8 w-full max-w-[1200px] mx-auto px-6 font-[Inter,sans-serif]">
            {/* Header Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-[linear-gradient(90deg,#241407_0%,#3d250d_45%,#201205_100%)] p-5 sm:p-7 text-white shadow-md border border-amber-900/30">
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl sm:text-2xl font-black text-amber-100 tracking-tight">
                                Doanh nghiệp đang tuyển dụng
                            </h2>
                        </div>
                        <p className="text-xs sm:text-sm text-amber-200/80 mt-1 font-medium">
                            Khám phá doanh nghiệp và các vị trí đang tuyển dụng trên TopCV
                        </p>
                    </div>
                </div>
            </div>

            {/* Category Filter Pills */}
            <div className="mt-4 flex items-center justify-between gap-2 overflow-x-auto pb-2 scrollbar-none">
                <div className="flex items-center gap-2 flex-nowrap shrink-0">
                    {CATEGORIES.map((cat) => {
                        const isActive = selectedCategory === cat;
                        return (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setSelectedCategory(cat)}
                                className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                                    isActive
                                        ? "bg-[#5a3f1a] text-white shadow-xs"
                                        : "bg-white text-gray-700 hover:bg-amber-50 border border-gray-200"
                                }`}
                            >
                                {cat}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main Brand Slider Showcase */}
            <div className="relative group/brands mt-4">
                {slides.length > 0 ? (
                    <Swiper
                        modules={[Navigation, Autoplay]}
                        spaceBetween={20}
                        slidesPerView={1}
                        loop={slides.length > 1}
                        autoplay={{
                            delay: 6000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        navigation={{
                            prevEl: ".brand-nav-prev",
                            nextEl: ".brand-nav-next",
                        }}
                        className="rounded-3xl"
                    >
                        {slides.map((slide) => (
                            <SwiperSlide key={slide.id}>
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                                    {/* LEFT: Featured Showcase Card (4 cols) */}
                                    <div className="lg:col-span-4 relative rounded-3xl overflow-hidden shadow-md min-h-[330px] flex flex-col justify-end p-6 text-white text-center bg-gradient-to-br from-slate-800 via-slate-900 to-emerald-950">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/20 to-transparent" />

                                        {/* Content */}
                                        <div className="relative z-10 flex flex-col items-center justify-center h-full my-auto">
                                            {/* Logo Container */}
                                            <div
                                                onClick={() => handleCompanyClick(slide.featured)}
                                                className="size-24 rounded-2xl bg-white p-2 shadow-xl flex items-center justify-center mx-auto cursor-pointer hover:scale-105 transition overflow-hidden"
                                            >
                                                {slide.featured.logo ? (
                                                    <img
                                                        src={slide.featured.logo}
                                                        alt={slide.featured.name}
                                                        className="size-full object-contain"
                                                    />
                                                ) : (
                                                    <span
                                                        className={`text-base font-black tracking-tight ${slide.featured.logoColor}`}
                                                    >
                                                        {slide.featured.logoText}
                                                    </span>
                                                )}
                                            </div>

                                            <h3
                                                onClick={() => handleCompanyClick(slide.featured)}
                                                className="text-base sm:text-lg font-black text-white text-center mt-4 px-2 leading-snug cursor-pointer hover:text-amber-300 transition line-clamp-2"
                                            >
                                                {slide.featured.name}
                                            </h3>
                                            <p className="text-xs text-gray-300 text-center mt-1 truncate max-w-[260px]">
                                                {slide.featured.industry}
                                            </p>

                                            <div className="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-white/20 text-xs text-white">
                                                <Briefcase className="size-3.5 text-amber-400" />
                                                <span>{slide.featured.jobsCount > 0 ? `${slide.featured.jobsCount} việc làm` : "Chưa có việc làm"}</span>
                                            </div>

                                            {slide.featured.isVerified && (
                                                <div className="mt-2.5">
                                                    <span className="rounded-full bg-emerald-400/90 px-3 py-0.5 text-[10px] font-bold text-emerald-950 shadow-xs inline-block">
                                                        Đã xác minh
                                                    </span>
                                                </div>
                                            )}

                                            <button
                                                type="button"
                                                onClick={() => handleFollowToggle(slide.featured.name)}
                                                className={`mt-4 inline-flex items-center justify-center gap-1.5 px-6 py-2 rounded-full text-xs font-bold transition shadow-md cursor-pointer ${
                                                    followed[slide.featured.name]
                                                        ? "bg-emerald-500 text-white"
                                                        : "bg-white hover:bg-gray-100 text-gray-900"
                                                }`}
                                            >
                                                {followed[slide.featured.name] ? (
                                                    <>
                                                        <Check className="size-3.5" /> Đã theo dõi
                                                    </>
                                                ) : (
                                                    <>
                                                        <Plus className="size-3.5" /> Theo dõi
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* RIGHT: Company Cards Grid (8 cols - tight layout without excessive gap) */}
                                    <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5 content-start">
                                        {slide.companies.map((c) => (
                                            <div
                                                key={c.id}
                                                onClick={() => handleCompanyClick(c)}
                                                className="bg-white rounded-2xl border border-border p-3.5 hover:border-primary hover:shadow-md transition flex items-start gap-3.5 cursor-pointer group"
                                            >
                                                {/* Company Logo Square */}
                                                <div
                                                    className={`size-13 rounded-xl border border-border p-2 flex items-center justify-center shrink-0 font-black text-xs shadow-2xs group-hover:scale-105 transition-transform overflow-hidden ${c.logoColor}`}
                                                >
                                                    {c.logo ? (
                                                        <img
                                                            src={c.logo}
                                                            alt={c.name}
                                                            className="size-full object-contain"
                                                        />
                                                    ) : (
                                                        c.logoText
                                                    )}
                                                </div>

                                                {/* Company Info */}
                                                <div className="min-w-0 flex-1">
                                                    <h4
                                                        className="text-xs font-bold text-gray-900 group-hover:text-primary transition uppercase truncate leading-snug"
                                                        title={c.name}
                                                    >
                                                        {c.name}
                                                    </h4>
                                                    <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                                                        {c.industry}
                                                    </p>
                                                    <div className="flex items-center gap-1 text-xs text-gray-600 mt-2 font-medium">
                                                        <Briefcase className="size-3 text-gray-400 shrink-0" />
                                                        <span>{c.jobsCount > 0 ? `${c.jobsCount} việc làm` : "Chưa có việc làm"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <div className="bg-white rounded-3xl border border-border p-12 text-center text-gray-500 text-sm">
                        {loading ? "Đang tải danh sách thương hiệu..." : "Hiện chưa có công ty nào"}
                    </div>
                )}

                {/* Pre / Next Navigation Buttons for Swiper */}
                {slides.length > 1 && (
                    <>
                        <button
                            type="button"
                            aria-label="Previous company slide"
                            className="brand-nav-prev absolute -left-4 top-1/2 -translate-y-1/2 z-20 size-8 sm:size-9 rounded-full bg-white shadow-lg border border-gray-200 text-gray-700 hover:text-primary hover:border-emerald-300 flex items-center justify-center transition cursor-pointer"
                        >
                            <ChevronLeft className="size-4 sm:size-5" />
                        </button>
                        <button
                            type="button"
                            aria-label="Next company slide"
                            className="brand-nav-next absolute -right-4 top-1/2 -translate-y-1/2 z-20 size-8 sm:size-9 rounded-full bg-white shadow-lg border border-gray-200 text-gray-700 hover:text-primary hover:border-emerald-300 flex items-center justify-center transition cursor-pointer"
                        >
                            <ChevronRight className="size-4 sm:size-5" />
                        </button>
                    </>
                )}
            </div>
        </section>
    );
}
