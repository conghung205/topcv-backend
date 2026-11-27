import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Search,
    MapPin,
    TrendingUp,
    X,
    Loader2,
    ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    POPULAR_KEYWORDS,
    keywordToSlug,
} from "../../../constants/searchKeywords";
import candidateService from "../../../services/candidateService";
import { useJobs } from "../../../hooks";
import { formatSalary } from "../../../utils/formatters";
export default function SearchBar() {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const containerRef = useRef(null);

    // Live search results state
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // Dynamic suggested jobs from API (limit 5 items)
    const { data: rawJobs, isLoading: isLoadingSuggested } = useJobs({
        limit: 5,
    });
    const suggestedJobs = (
        Array.isArray(rawJobs?.data)
            ? rawJobs.data
            : Array.isArray(rawJobs)
              ? rawJobs
              : []
    ).slice(0, 5);

    // Debounced search when input changes
    useEffect(() => {
        const trimmed = keyword.trim();
        if (!trimmed) {
            return;
        }

        const timer = setTimeout(async () => {
            setIsSearching(true);
            try {
                const res = await candidateService.getJobs({
                    keyword: trimmed,
                });
                setSearchResults(res.data || []);
            } catch (error) {
                console.error("Live search error:", error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [keyword]);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                setIsFocused(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearchSubmit = (e) => {
        if (e) e.preventDefault();
        setIsFocused(false);
        const trimmed = keyword.trim();
        if (trimmed) {
            const slug = keywordToSlug(trimmed);
            navigate(`/tim-viec-lam-${slug}`);
        } else {
            navigate(`/vieclam`);
        }
    };

    const handleKeywordClick = (item) => {
        setIsFocused(false);
        setKeyword(item.label);
        navigate(`/tim-viec-lam-${item.slug}`);
    };

    const handleJobClick = (job) => {
        setIsFocused(false);
        navigate(`/viec-lam/${job.slug || job.id}`);
    };

    const handleClearKeyword = () => {
        setKeyword("");
        setSearchResults([]);
        setIsSearching(false);
    };

    const handleKeywordChange = (event) => {
        const value = event.target.value;
        setKeyword(value);
        if (!value.trim()) {
            setSearchResults([]);
            setIsSearching(false);
        }
    };

    return (
        <div className="relative mx-0 mb-9 mt-[42px]" ref={containerRef}>
            {/* Search Input Bar */}
            <form
                onSubmit={handleSearchSubmit}
                className="flex items-center rounded-2xl bg-white px-2 py-1 shadow-lg border border-gray-100"
            >
                {/* Text input */}
                <div className="flex flex-1 items-center px-3 gap-2">
                    <input
                        type="text"
                        value={keyword}
                        onChange={handleKeywordChange}
                        onFocus={() => setIsFocused(true)}
                        placeholder="Vị trí tuyển dụng, tên công ty"
                        className="w-full border-none bg-transparent text-sm outline-none text-gray-800 placeholder:text-gray-400 font-medium py-1"
                    />
                    {keyword && (
                        <button
                            type="button"
                            onClick={handleClearKeyword}
                            className="p-1 text-gray-400 hover:text-gray-600 rounded-full cursor-pointer shrink-0"
                            title="Xóa tìm kiếm"
                        >
                            <X className="size-3.5" />
                        </button>
                    )}
                </div>

                {/* Search Button */}
                <div className="pl-2 border-l-2 ">
                    <Button
                        type="submit"
                        className="rounded-xl bg-primary hover:bg-primary/90 text-white px-6 py-2.5 text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                        <Search className="size-4" />
                        <span>Tìm kiếm</span>
                    </Button>
                </div>
            </form>

            {/* Dropdown Popup on Focus */}
            {isFocused && (
                <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden text-sm animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* Lần đầu focus hoặc input trống -> Hiển thị từ khóa phổ biến + 5 gợi ý */}
                    {!keyword.trim() ? (
                        <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                            {/* Left Column: Từ khóa phổ biến (5 cols) */}
                            <div className="md:col-span-5 p-5 space-y-3">
                                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                                    Từ khóa phổ biến
                                </h3>

                                <div className="space-y-1">
                                    {POPULAR_KEYWORDS.map((item, index) => (
                                        <div
                                            key={index}
                                            onClick={() =>
                                                handleKeywordClick(item)
                                            }
                                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-emerald-50 hover:text-primary transition cursor-pointer font-medium text-sm"
                                        >
                                            <TrendingUp className="size-4 text-gray-400 shrink-0" />
                                            <span className="truncate">
                                                {item.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Column: Việc làm có thể bạn quan tâm (7 cols) - 5 items from API */}
                            <div className="md:col-span-7 p-5 space-y-3">
                                <h3 className="text-base font-bold text-gray-900">
                                    Việc làm có thể bạn quan tâm
                                </h3>

                                {isLoadingSuggested ? (
                                    <div className="py-8 flex flex-col items-center justify-center gap-2 text-gray-400">
                                        <Loader2 className="size-5 animate-spin text-primary" />
                                        <p className="text-xs">
                                            Đang tải gợi ý việc làm...
                                        </p>
                                    </div>
                                ) : suggestedJobs.length === 0 ? (
                                    <div className="py-8 text-center text-xs text-gray-500 font-medium">
                                        Hiện chưa có việc làm nào
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {suggestedJobs.map((job) => (
                                            <div
                                                key={job.id}
                                                onClick={() =>
                                                    handleJobClick(job)
                                                }
                                                className="flex items-start gap-3 p-2.5 rounded-2xl border border-border hover:border-primary hover:bg-emerald-50/40 transition cursor-pointer group"
                                            >
                                                {/* Company logo */}
                                                <div className="size-11 rounded-xl bg-gray-50 border border-border flex items-center justify-center shrink-0 overflow-hidden font-bold text-xs text-gray-600 shadow-xs">
                                                    {job.company?.logo_url ? (
                                                        <img
                                                            src={
                                                                job.company
                                                                    .logo_url
                                                            }
                                                            alt={
                                                                job.company
                                                                    .company_name
                                                            }
                                                            className="size-full object-contain p-1"
                                                        />
                                                    ) : (
                                                        <span className="uppercase text-emerald-700 bg-emerald-100/70 size-full flex items-center justify-center font-black text-xs">
                                                            {(
                                                                job.company
                                                                    ?.company_name ||
                                                                job.company_name ||
                                                                job.title ||
                                                                ""
                                                            ).charAt(0)}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Job info */}
                                                <div className="min-w-0 flex-1">
                                                    <h4
                                                        className="text-sm font-bold text-gray-900 group-hover:text-primary transition leading-snug line-clamp-1"
                                                        title={job.title}
                                                    >
                                                        {job.title}
                                                    </h4>
                                                    <p className="text-xs text-gray-500 uppercase font-medium mt-0.5 truncate">
                                                        {job.company
                                                            ?.company_name ||
                                                            job.company_name ||
                                                            ""}
                                                    </p>
                                                    <span className="inline-block mt-1 text-xs font-bold text-primary">
                                                        {formatSalary(
                                                            job.salary,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* CASE 2: Khi user nhập từ khóa (input change) -> Gọi API thật và render */
                        <div className="flex flex-col">
                            {/* Live Search Header */}
                            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50/70">
                                <div className="flex items-center gap-2">
                                    <Search className="size-4 text-primary" />
                                    <span className="text-sm font-semibold text-gray-700">
                                        Kết quả tìm kiếm cho{" "}
                                        <span className="text-gray-900 font-bold">
                                            "{keyword}"
                                        </span>
                                    </span>
                                </div>
                            </div>

                            {/* Live Search Content */}
                            {isSearching && searchResults.length === 0 ? (
                                <div className="p-8 flex flex-col items-center justify-center gap-2 text-gray-400">
                                    <Loader2 className="size-6 animate-spin text-primary" />
                                    <p className="text-sm font-medium">
                                        Đang tìm việc làm phù hợp từ hệ thống...
                                    </p>
                                </div>
                            ) : searchResults.length > 0 ? (
                                <div className="p-3 max-h-[380px] overflow-y-auto space-y-1.5 divide-y divide-gray-50">
                                    {searchResults.map((job) => (
                                        <div
                                            key={job.id}
                                            onClick={() => handleJobClick(job)}
                                            className="flex items-start gap-3 p-3 rounded-2xl border border-border hover:border-primary hover:bg-emerald-50/50 transition cursor-pointer group"
                                        >
                                            {/* Company Logo / Letter */}
                                            <div className="size-12 rounded-xl bg-gray-50 border border-border flex items-center justify-center shrink-0 overflow-hidden font-bold text-xs text-gray-600 shadow-xs">
                                                {job.company?.logo_url ? (
                                                    <img
                                                        src={
                                                            job.company.logo_url
                                                        }
                                                        alt={
                                                            job.company
                                                                .company_name
                                                        }
                                                        className="size-full object-contain p-1"
                                                    />
                                                ) : (
                                                    <span className="uppercase text-emerald-700 bg-emerald-100/70 size-full flex items-center justify-center font-black text-sm">
                                                        {(
                                                            job.company
                                                                ?.company_name ||
                                                            job.title ||
                                                            ""
                                                        ).charAt(0)}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Job Info */}
                                            <div className="min-w-0 flex-1">
                                                <h4 className="text-sm font-bold text-gray-900 group-hover:text-primary transition truncate leading-snug">
                                                    {job.title}
                                                </h4>
                                                <p className="text-xs text-gray-500 truncate mt-0.5 font-medium">
                                                    {job.company
                                                        ?.company_name ||
                                                        ""}
                                                </p>
                                                <div className="flex items-center gap-3 mt-1.5 text-xs">
                                                    <span className="font-bold text-primary">
                                                        {formatSalary(
                                                            job.salary,
                                                        )}
                                                    </span>
                                                    {job.work_location?.[0]
                                                        ?.city_name && (
                                                        <span className="text-gray-400 flex items-center gap-0.5">
                                                            <MapPin className="size-3 text-gray-400" />
                                                            {
                                                                job
                                                                    .work_location[0]
                                                                    .city_name
                                                            }
                                                        </span>
                                                    )}
                                                    {job.category && (
                                                        <span className="text-gray-500 bg-gray-100 px-2 py-0.5 rounded text-[11px]">
                                                            {job.category}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center space-y-2">
                                    <div className="size-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
                                        <Search className="size-5" />
                                    </div>
                                    <p className="text-sm font-bold text-gray-700">
                                        Hiện chưa có việc làm nào
                                    </p>
                                </div>
                            )}

                            {/* Live Search Footer */}
                            <div className="bg-gray-50 px-5 py-2.5 border-t border-gray-100 flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={handleSearchSubmit}
                                    className="text-xs font-bold text-primary hover:text-[#009c45] flex items-center gap-1 cursor-pointer"
                                >
                                    Xem tất cả kết quả cho "{keyword}"
                                    <ArrowRight className="size-3.5" />
                                </button>
                                <span className="text-[11px] text-gray-400">
                                    Nhấn Enter để tìm kiếm
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
