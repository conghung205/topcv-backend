import { useState } from "react";
import JobCard from "../../components/JobCard";
import { Search, Briefcase, Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useJobs } from "@/hooks";

export default function JobListingsPage() {
    const [page, setPage] = useState(1);

    // Filters
    const [keyword, setKeyword] = useState("");
    const [activeKeyword, setActiveKeyword] = useState("");
    const [cityId, setCityId] = useState("");
    const [categorySlug, setCategorySlug] = useState("");

    const { data: jobsResponse, isLoading: loading } = useJobs({
        page,
        keyword: activeKeyword.trim() || undefined,
        city_id: cityId ? Number(cityId) : undefined,
        category_slug: categorySlug || undefined
    });

    const jobs = jobsResponse?.data || [];
    const total = jobsResponse?.total || 0;

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        setActiveKeyword(keyword);
    };

    return (
        <div className="bg-bg-main min-h-screen pb-16 font-[Inter,sans-serif]">
            {/* Search Banner */}
            <div className="bg-gradient-to-r from-emerald-800 via-[#00b14f] to-teal-800 py-10 px-6 text-white">
                <div className="max-w-[1200px] mx-auto space-y-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                            Tìm việc làm mơ ước của bạn
                        </h1>
                        <p className="text-xs sm:text-sm text-emerald-100 mt-1">
                            Tiếp cận hàng nghìn cơ hội việc làm chất lượng cao từ các nhà tuyển dụng hàng đầu.
                        </p>
                    </div>

                    {/* Filter Form */}
                    <form
                        onSubmit={handleSearchSubmit}
                        className="bg-white p-2.5 sm:p-3 rounded-2xl sm:rounded-3xl shadow-xl flex flex-col md:flex-row gap-2 text-gray-800"
                    >
                        {/* Keyword */}
                        <div className="flex-1 relative flex items-center">
                            <Search className="absolute left-3.5 size-4 text-gray-400" />
                            <input
                                type="text"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                placeholder="Tên công việc, vị trí, công ty..."
                                className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-transparent focus:outline-none placeholder:text-gray-400 font-medium"
                            />
                        </div>



                        {/* Submit button */}
                        <button
                            type="submit"
                            className="px-6 py-2.5 rounded-xl sm:rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
                        >
                            <Search className="size-4" /> Tìm kiếm
                        </button>
                    </form>
                </div>
            </div>

            {/* Content Body */}
            <div className="max-w-[1200px] mx-auto px-6 pt-8 space-y-6">
                {/* Header count & Category Pills */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                            <Briefcase className="size-5 text-primary" /> Danh sách việc làm mới nhất
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Tìm thấy <strong className="text-primary">{total}</strong> vị trí tuyển dụng phù hợp
                        </p>
                    </div>

                    {/* Quick reset */}
                    {(activeKeyword || cityId || categorySlug) && (
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setKeyword("");
                                setActiveKeyword("");
                                setCityId("");
                                setCategorySlug("");
                                setPage(1);
                            }}
                            className="text-xs text-red-600 hover:bg-red-50 h-8"
                        >
                            Xóa bộ lọc
                        </Button>
                    )}
                </div>

                {/* Job Cards Grid */}
                {loading ? (
                    <div className="py-16 flex flex-col items-center justify-center gap-3">
                        <Loader2 className="size-8 animate-spin text-primary" />
                        <p className="text-xs text-gray-500 font-medium">Đang tải việc làm...</p>
                    </div>
                ) : jobs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {jobs.map((job) => (
                            <JobCard key={job.id} job={job} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white p-12 rounded-3xl text-center border border-gray-200/80">
                        <p className="text-sm font-semibold text-gray-700">
                            Hiện chưa có việc làm nào
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
