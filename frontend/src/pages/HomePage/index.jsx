import { useState } from "react";
import { Link } from "react-router-dom";
import BannerSection from "../../components/Home/BannerSection";
import TopBrandsSection from "../../components/Home/TopBrandsSection";
import FilterSection from "../../components/FilterSection";
import JobCard from "../../components/JobCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useJobs, useCategories } from "@/hooks";

const ITEMS_PER_PAGE = 9;

export default function HomePage() {
    const { data: categoriesData } = useCategories();
    const { data: jobsData } = useJobs();

    const categories = Array.isArray(categoriesData) ? categoriesData : [];
    const jobs = Array.isArray(jobsData?.data) ? jobsData.data : (Array.isArray(jobsData) ? jobsData : []);

    const [filter, setFilter] = useState("location");
    const [subFilter, setSubFilter] = useState("all");

    // Real Pagination state (Render 9 items per page)
    const [currentPage, setCurrentPage] = useState(1);


    const handleFilterChange = (value) => {
        setFilter(value);
        setSubFilter("all");
        setCurrentPage(1);
    };

    const handleSubFilterChange = (value) => {
        setSubFilter(value);
        setCurrentPage(1);
    };

    // Real Filter logic based on select & button choices
    const filteredJobs = jobs.filter((job) => {
        if (!subFilter || subFilter === "all" || subFilter === "random") {
            return true;
        }

        if (filter === "location") {
            const locString = (job.work_location || [])
                .map((loc) => `${loc.city_name || ""} ${loc.address_detail || ""}`)
                .join(" ")
                .toLowerCase();

            if (subFilter === "hanoi") {
                return locString.includes("hà nội") || locString.includes("ha noi");
            }
            if (subFilter === "hcm") {
                return locString.includes("hồ chí minh") || locString.includes("hcm") || locString.includes("ho chi minh");
            }
            if (subFilter === "danang") {
                return locString.includes("đà nẵng") || locString.includes("da nang");
            }
            return true;
        }

        if (filter === "salary") {
            const salaryObj = job.salary || {};
            if (subFilter === "negotiable") {
                return salaryObj.is_negotiable || salaryObj.type === "negotiable";
            }
            let min = salaryObj.min ? Number(salaryObj.min) : 0;
            let max = salaryObj.max ? Number(salaryObj.max) : 0;
            if (min > 1000) min = min / 1000000;
            if (max > 1000) max = max / 1000000;

            if (subFilter === "under-10") {
                return (max > 0 && max <= 10) || (min > 0 && min < 10);
            }
            if (subFilter === "10-15") {
                return (min <= 15 && max >= 10) || (min >= 10 && min <= 15) || (max >= 10 && max <= 15);
            }
            if (subFilter === "15-20") {
                return (min <= 20 && max >= 15) || (min >= 15 && min <= 20) || (max >= 15 && max <= 20);
            }
            if (subFilter === "above-20") {
                return max >= 20 || min >= 20;
            }
            return true;
        }

        if (filter === "experience") {
            const exp = (job.experience_level || "").toLowerCase();
            if (subFilter === "none") {
                return exp.includes("chưa có") || exp.includes("không yêu cầu");
            }
            if (subFilter === "under-1") {
                return exp.includes("dưới 1");
            }
            if (subFilter === "1-2") {
                return exp.includes("1 năm") || exp.includes("2 năm") || exp.includes("1 - 2");
            }
            if (subFilter === "3-5") {
                return exp.includes("3 năm") || exp.includes("4 năm") || exp.includes("5 năm") || exp.includes("3 - 5");
            }
            if (subFilter === "above-5") {
                return exp.includes("trên 5") || exp.includes("5 năm");
            }
            return true;
        }

        if (filter === "sector") {
            const text = `${job.category || ""} ${job.title || ""} ${job.specialty || ""}`.toLowerCase();
            if (subFilter === "it") {
                return text.includes("it") || text.includes("phần mềm") || text.includes("lập trình") || text.includes("developer") || text.includes("công nghệ");
            }
            if (subFilter === "sales") {
                return text.includes("kinh doanh") || text.includes("bán hàng") || text.includes("sales") || text.includes("b2b");
            }
            if (subFilter === "marketing") {
                return text.includes("marketing") || text.includes("pr") || text.includes("quảng cáo") || text.includes("truyền thông") || text.includes("seo");
            }
            if (subFilter === "accounting") {
                return text.includes("kế toán") || text.includes("kiểm toán") || text.includes("tài chính");
            }
            if (subFilter === "hr") {
                return text.includes("nhân sự") || text.includes("hành chính") || text.includes("tuyển dụng");
            }
            return true;
        }

        return true;
    });

    // Real Pagination logic
    const totalJobsCount = filteredJobs.length;
    const totalPages = Math.ceil(totalJobsCount / ITEMS_PER_PAGE) || 1;

    // Extract exact 9 jobs for the current page from filtered list
    const currentJobs = filteredJobs.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const isPrevDisabled = currentPage <= 1;
    const isNextDisabled = currentPage >= totalPages;

    const handlePrevPage = () => {
        if (!isPrevDisabled) {
            setCurrentPage((prev) => prev - 1);
            document.getElementById("jobs-section-heading")?.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleNextPage = () => {
        if (!isNextDisabled) {
            setCurrentPage((prev) => prev + 1);
            document.getElementById("jobs-section-heading")?.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="bg-[#f4f5f5]/40 min-h-screen pb-12 font-[Inter,sans-serif]">
            {categories && <BannerSection categories={categories} />}
            <div className="mx-auto w-full max-w-[1200px] px-6">
                <div id="jobs-section-heading" className="flex items-center justify-between mt-6 mb-3">
                    <h2 className="text-lg font-bold text-gray-900 md:text-[24px]">
                        Việc làm tốt nhất
                    </h2>
                    <Link
                        to="/viec-lam-tot-nhat"
                        className="text-xs sm:text-sm font-semibold text-primary hover:underline flex items-center gap-1"
                    >
                        Xem tất cả việc làm →
                    </Link>
                </div>
                <FilterSection
                    filter={filter}
                    onFilterChange={handleFilterChange}
                    subFilter={subFilter}
                    onSubFilterChange={handleSubFilterChange}
                />
                {currentJobs.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                        {currentJobs.map((job) => (
                            <JobCard
                                key={job.id}
                                job={job}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center my-6 shadow-xs">
                        <p className="text-gray-500 font-medium text-sm">
                            Hiện chưa có việc làm nào
                        </p>
                    </div>
                )}

                {/* Pagination Controls with Real Disabled States (Matching Image 1) */}
                <div className="flex items-center justify-center gap-3 mt-8 pb-4">
                    <button
                        type="button"
                        aria-label="Trang trước"
                        onClick={handlePrevPage}
                        disabled={isPrevDisabled}
                        className={`size-8 rounded-full border flex items-center justify-center transition shadow-2xs ${
                            isPrevDisabled
                                ? "border-gray-200 text-gray-300 cursor-not-allowed opacity-50 bg-gray-50"
                                : "border-emerald-400 text-primary hover:bg-emerald-50 cursor-pointer"
                        }`}
                    >
                        <ChevronLeft className="size-4" />
                    </button>

                    <span className="text-xs font-semibold text-gray-600 px-2">
                        <strong className="text-primary font-black text-sm">{currentPage}</strong> / {totalPages} trang
                    </span>

                    <button
                        type="button"
                        aria-label="Trang tiếp"
                        onClick={handleNextPage}
                        disabled={isNextDisabled}
                        className={`size-8 rounded-full border flex items-center justify-center transition shadow-2xs ${
                            isNextDisabled
                                ? "border-gray-200 text-gray-300 cursor-not-allowed opacity-50 bg-gray-50"
                                : "border-emerald-400 text-primary hover:bg-emerald-50 cursor-pointer"
                        }`}
                    >
                        <ChevronRight className="size-4" />
                    </button>
                </div>
            </div>

            <TopBrandsSection />
        </div>
    );
}
