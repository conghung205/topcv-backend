import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useLocation, Link, useNavigate } from "react-router-dom";
import candidateService from "../../services/candidateService";
import {
    slugToKeyword,
    keywordToSlug,
    POPULAR_KEYWORDS
} from "../../constants/searchKeywords";
import { useJobs } from "../../hooks";
import { formatDate, formatSalary } from "../../utils/formatters";
import {
    Search,
    MapPin,
    Building2,
    Bell,
    Heart,
    X,
    Check,
    ArrowRight,
    Loader2,
    TrendingUp,
    
} from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../components/ui/select";
import Toast from "../../components/ui/toast";
import { getSelectLabel } from "../../constants/selectLabels";
import { useCandidateAuth } from "../../stores/useCandidateAuthStore";

export default function SearchJobsPage() {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useCandidateAuth();
    const companyFilter = searchParams.get("company") || "";

    // Helper to extract keyword from URL pathname or query
    const getKeywordFromUrl = useCallback(() => {
        const path = location.pathname.replace(/^\//, "");
        if (path.startsWith("tim-viec-lam-")) {
            const rawSlug = path.replace(/^tim-viec-lam-/, "");
            return slugToKeyword(rawSlug);
        }
        if (path.startsWith("tim-viec-lam/")) {
            const rawSlug = path.replace(/^tim-viec-lam\//, "");
            return slugToKeyword(rawSlug);
        }
        return searchParams.get("keyword") || "";
    }, [location.pathname, searchParams]);

    const routeKey = `${location.pathname}?${searchParams.toString()}`;
    const [keywordState, setKeywordState] = useState(() => ({
        routeKey,
        value: getKeywordFromUrl(),
    }));
    const keyword = keywordState.routeKey === routeKey
        ? keywordState.value
        : getKeywordFromUrl();
    const setKeyword = (value) => setKeywordState({ routeKey, value });
    const [isFocused, setIsFocused] = useState(false);
    const [isHeaderHidden, setIsHeaderHidden] = useState(false);
    const searchContainerRef = useRef(null);

    // UI filters & sorting
    const [searchBy, setSearchBy] = useState("job_title"); // "job_title" | "company" | "both"
    const [sortBy, setSortBy] = useState("relevant"); // "relevant" | "newest" | "salary"
    const [saturdayFilter, setSaturdayFilter] = useState("none");
    const [bizType, setBizType] = useState("all");

    // Data
    const [jobs, setJobs] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    // Live search results inside dropdown
    const [liveSuggestions, setLiveSuggestions] = useState([]);
    const [isSearchingDropdown, setIsSearchingDropdown] = useState(false);
    const [savedJobs, setSavedJobs] = useState({});
    const [toast, setToast] = useState({ message: "", type: "success" });

    // Dynamic suggested jobs from API (limit 5 items)
    const { data: rawSuggestedJobs, isLoading: isLoadingSuggested } = useJobs({ limit: 5 });
    const suggestedJobs = (
        Array.isArray(rawSuggestedJobs?.data) ? rawSuggestedJobs.data : (Array.isArray(rawSuggestedJobs) ? rawSuggestedJobs : [])
    ).slice(0, 5);

    // Debounced live search when input changes
    useEffect(() => {
        const trimmed = keyword.trim();
        if (!trimmed) {
            return;
        }

        const timer = setTimeout(async () => {
            setIsSearchingDropdown(true);
            try {
                const res = await candidateService.getJobs({
                    keyword: trimmed,
                });
                setLiveSuggestions(res.data || []);
            } catch (error) {
                console.error("Dropdown live search error:", error);
                setLiveSuggestions([]);
            } finally {
                setIsSearchingDropdown(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [keyword]);

    // Close focus dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setIsFocused(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        let previousScrollY = window.scrollY;
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setIsHeaderHidden(currentScrollY > previousScrollY && currentScrollY > 72);
            previousScrollY = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Fetch jobs whenever keyword, searchBy, or sortBy changes
    useEffect(() => {
        let isMounted = true;
        const fetchSearchResults = async () => {
            setLoading(true);
            try {
                const currentKw = getKeywordFromUrl();
                const firstResponse = await candidateService.getJobs({
                    page: 1,
                    keyword: companyFilter ? undefined : (currentKw.trim() || undefined),
                });
                let res = firstResponse;

                if (companyFilter) {
                    const firstPage = Array.isArray(firstResponse?.data) ? firstResponse.data : [];
                    const totalPages = Math.max(1, Math.ceil((Number(firstResponse?.total) || firstPage.length) / 20));
                    const remainingPages = await Promise.all(
                        Array.from({ length: totalPages - 1 }, (_, index) =>
                            candidateService.getJobs({ page: index + 2 })
                        )
                    );
                    const allJobs = [
                        ...firstPage,
                        ...remainingPages.flatMap((response) => Array.isArray(response?.data) ? response.data : []),
                    ];
                    const normalizedFilter = companyFilter.trim().toLowerCase();
                    const filteredByCompany = allJobs.filter((job) => {
                        const companyId = job.company?.id ? String(job.company.id).toLowerCase() : "";
                        const companyName = job.company?.company_name?.trim().toLowerCase() || "";
                        return companyId === normalizedFilter || companyName === normalizedFilter;
                    });
                    res = { data: filteredByCompany, total: filteredByCompany.length };
                }

                if (isMounted) {
                    if (res?.data && res.data.length > 0) {
                        setJobs(res.data);
                        setTotal(res.total || res.data.length);
                    } else {
                        setJobs([]);
                        setTotal(0);
                    }
                }
            } catch (err) {
                console.error("Search fetch error:", err);
                if (isMounted) {
                    setJobs([]);
                    setTotal(0);
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchSearchResults();
        return () => {
            isMounted = false;
        };
    }, [location.pathname, searchBy, sortBy, companyFilter, getKeywordFromUrl]);


    const handleSearchSubmit = (e) => {
        if (e) e.preventDefault();
        setIsFocused(false);
        const trimmed = keyword.trim();
        if (trimmed) {
            const newSlug = keywordToSlug(trimmed);
            navigate(`/tim-viec-lam-${newSlug}`);
        } else {
            navigate(`/viec-lam`);
        }
    };

    const handleClearKeyword = () => {
        setKeyword("");
        setLiveSuggestions([]);
    };

    const handleKeywordChange = (event) => {
        const value = event.target.value;
        setKeyword(value);
        if (!value.trim()) {
            setLiveSuggestions([]);
            setIsSearchingDropdown(false);
        }
    };

    const handleKeywordClick = (item) => {
        setIsFocused(false);
        setKeyword(item.label);
        navigate(`/tim-viec-lam-${item.slug}`);
    };

    const handleJobClick = (job) => {
        setIsFocused(false);
        navigate(`/viec-lam/${job.slug}`);
    };

    const handleToggleSaveJob = (event, jobId) => {
        event.stopPropagation();
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }
        const willSave = !savedJobs[jobId];
        setSavedJobs((previous) => ({ ...previous, [jobId]: willSave }));
        setToast({
            message: willSave
                ? "Đã lưu công việc vào danh sách yêu thích!"
                : "Đã bỏ công việc khỏi danh sách yêu thích.",
            type: "success",
        });
    };

    const displayKeyword = keyword || "Tất cả việc làm";
    const capitalizedKeyword = displayKeyword.charAt(0).toUpperCase() + displayKeyword.slice(1);

    return (
        <div className="bg-bg-main min-h-screen pb-20 font-[Inter,sans-serif]">
            {/* Top Search Filter Header (Image 2 style) */}
            <div className={`bg-white border-b border-gray-200 shadow-xs py-3 sticky z-30 transition-[top] duration-300 ${isHeaderHidden ? "top-0" : "top-[72px]"}`}>
                <div className="max-w-[1300px] mx-auto px-6" ref={searchContainerRef}>
                    <form
                        onSubmit={handleSearchSubmit}
                        className="relative flex flex-col md:flex-row items-stretch gap-2.5 bg-transparent"
                    >
                        {/* Keyword input with clear button & focus dropdown */}
                        <div className="flex-1 relative flex items-center bg-white rounded-xl border border-gray-200 px-3.5 shadow-2xs hover:border-primary transition">
                            <Search className="size-4 text-gray-400 shrink-0 mr-2" />
                            <input
                                type="text"
                                value={keyword}
                                onChange={handleKeywordChange}
                                onFocus={() => setIsFocused(true)}
                                placeholder="Vị trí tuyển dụng, tên công ty..."
                                className="w-full py-2.5 text-xs sm:text-sm bg-transparent outline-none font-medium text-gray-900 placeholder:text-gray-400"
                            />
                            {keyword && (
                                <button
                                    type="button"
                                    onClick={handleClearKeyword}
                                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full cursor-pointer"
                                >
                                    <X className="size-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Search Button */}
                        <button
                            type="submit"
                            className="px-7 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                        >
                            Tìm kiếm
                        </button>

                        {/* Focused Dropdown (Popular keywords / Live search results) */}
                        {isFocused && (
                            <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                                {!keyword.trim() ? (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                                            {/* Left: Popular keywords */}
                                            <div className="md:col-span-5 p-5 space-y-3">
                                                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                                                    Từ khóa phổ biến
                                                </h3>
                                                <div className="space-y-1">
                                                    {POPULAR_KEYWORDS.map((item, index) => (
                                                        <div
                                                            key={index}
                                                            onClick={() => handleKeywordClick(item)}
                                                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-700 hover:bg-emerald-50 hover:text-primary transition cursor-pointer font-medium text-xs"
                                                        >
                                                            <TrendingUp className="size-3.5 text-gray-400 shrink-0" />
                                                            <span className="truncate">{item.label}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Right: 5 Suggested jobs from API */}
                                            <div className="md:col-span-7 p-5 space-y-3">
                                                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                                                    Việc làm có thể bạn quan tâm
                                                </h3>

                                                {isLoadingSuggested ? (
                                                    <div className="py-6 flex flex-col items-center justify-center gap-1.5 text-gray-400">
                                                        <Loader2 className="size-4 animate-spin text-primary" />
                                                        <p className="text-[11px]">Đang tải việc làm...</p>
                                                    </div>
                                                ) : suggestedJobs.length === 0 ? (
                                                    <div className="py-6 text-center text-xs text-gray-400 font-normal">
                                                        Hiện chưa có việc làm nào
                                                    </div>
                                                ) : (
                                                    <div className="space-y-2">
                                                        {suggestedJobs.map((j) => (
                                                            <div
                                                                key={j.id}
                                                                onClick={() => handleJobClick(j)}
                                                                className="flex items-start gap-3 p-2 rounded-xl border border-border hover:border-primary hover:bg-emerald-50/40 transition cursor-pointer group"
                                                            >
                                                                <div className="size-10 rounded-xl bg-gray-50 border border-border flex items-center justify-center shrink-0 overflow-hidden font-bold text-xs text-gray-600 shadow-xs">
                                                                    {j.company?.logo_url ? (
                                                                        <img
                                                                            src={j.company.logo_url}
                                                                            alt={j.company.company_name}
                                                                            className="size-full object-contain p-0.5"
                                                                        />
                                                                    ) : (
                                                                        <span className="uppercase text-emerald-700 bg-emerald-100/70 size-full flex items-center justify-center font-black text-xs">
                                                                            {(j.company?.company_name || j.company_name || "").charAt(0)}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div className="min-w-0 flex-1">
                                                                    <h4 className="text-xs font-bold text-gray-900 group-hover:text-primary transition truncate">
                                                                        {j.title}
                                                                    </h4>
                                                                    <p className="text-[11px] text-gray-400 uppercase truncate mt-0.5">
                                                                        {j.company?.company_name || j.company_name || ""}
                                                                    </p>
                                                                    <span className="text-[11px] font-bold text-primary inline-block mt-0.5">
                                                                        {formatSalary(j.salary)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    /* Live Search Results from API */
                                    <div className="flex flex-col">
                                        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50/70">
                                            <div className="flex items-center gap-2">
                                                <Search className="size-4 text-primary" />
                                                <span className="text-xs font-semibold text-gray-700">
                                                    Kết quả tìm kiếm cho <span className="text-gray-900 font-bold">"{keyword}"</span>
                                                </span>
                                            </div>
                                            {isSearchingDropdown ? (
                                                <span className="flex items-center gap-1.5 text-xs text-gray-400">
                                                    <Loader2 className="size-3.5 animate-spin text-primary" />
                                                    Đang tìm...
                                                </span>
                                            ) : (
                                                <span className="text-xs text-gray-500 font-medium">
                                                    {liveSuggestions.length} việc làm phù hợp
                                                </span>
                                            )}
                                        </div>

                                        {isSearchingDropdown && liveSuggestions.length === 0 ? (
                                            <div className="p-8 flex flex-col items-center justify-center gap-2 text-gray-400">
                                                <Loader2 className="size-6 animate-spin text-primary" />
                                                <p className="text-xs font-medium">Đang tìm việc làm phù hợp từ hệ thống...</p>
                                            </div>
                                        ) : liveSuggestions.length > 0 ? (
                                            <div className="p-3 max-h-[380px] overflow-y-auto space-y-1.5 divide-y divide-gray-50">
                                                {liveSuggestions.map((j) => (
                                                    <div
                                                        key={j.id}
                                                        onClick={() => handleJobClick(j)}
                                                        className="flex items-start gap-3 p-3 rounded-2xl border border-border hover:border-primary hover:bg-emerald-50/50 transition cursor-pointer group"
                                                    >
                                                        <div className="size-10 rounded-xl bg-gray-50 border border-border flex items-center justify-center shrink-0 overflow-hidden font-bold text-xs text-gray-600 shadow-xs">
                                                            {j.company?.logo_url ? (
                                                                <img
                                                                    src={j.company.logo_url}
                                                                    alt={j.company.company_name}
                                                                    className="size-full object-contain p-1"
                                                                />
                                                            ) : (
                                                                <span className="uppercase text-emerald-700 bg-emerald-100/70 size-full flex items-center justify-center font-black text-xs">
                                                                    {(j.company?.company_name || "").charAt(0)}
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="min-w-0 flex-1">
                                                            <h4 className="text-xs font-bold text-gray-900 group-hover:text-primary transition truncate">
                                                                {j.title}
                                                            </h4>
                                                            <p className="text-[11px] text-gray-500 truncate mt-0.5 font-medium">
                                                                {j.company?.company_name || ""}
                                                            </p>
                                                            <div className="flex items-center gap-3 mt-1 text-[11px]">
                                                                <span className="font-bold text-primary">
                                                                    {formatSalary(j.salary)}
                                                                </span>
                                                                {j.work_location?.[0]?.city_name && (
                                                                    <span className="text-gray-400 flex items-center gap-0.5">
                                                                        <MapPin className="size-3 text-gray-400" />
                                                                        {j.work_location[0].city_name}
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
                                                <p className="text-xs font-normal text-gray-400">
                                                    Hiện chưa có việc làm nào
                                                </p>
                                            </div>
                                        )}

                                        <div className="bg-gray-50 px-5 py-2.5 border-t border-gray-100 flex items-center justify-between">
                                            <button
                                                type="button"
                                                onClick={handleSearchSubmit}
                                                className="text-xs font-bold text-primary hover:text-[#009c45] flex items-center gap-1 cursor-pointer"
                                            >
                                                Xem tất cả kết quả cho "{keyword}"
                                                <ArrowRight className="size-3.5" />
                                            </button>
                                            <span className="text-[11px] text-gray-400">Nhấn Enter để tìm kiếm</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </form>
                </div>
            </div>

            {/* Sub-Header & Breadcrumb Bar (Matching Image 2) */}
            <div className="max-w-[1300px] mx-auto px-6 pt-5 pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h1 className="text-base sm:text-lg font-black text-gray-900 leading-snug">
                            Tuyển dụng <span className="text-primary">{total} việc làm {capitalizedKeyword}</span>{" "}
                            <span className="text-xs font-normal text-gray-500">[Update 09/09/2026]</span>
                        </h1>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                            <Link to="/" className="hover:text-primary">Trang chủ</Link>
                            <span>&gt;</span>
                            <Link to="/viec-lam" className="hover:text-primary">Việc làm</Link>
                            <span>&gt;</span>
                            <span className="text-gray-700 font-semibold">{capitalizedKeyword}</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:border-primary hover:text-primary transition shadow-xs cursor-pointer shrink-0"
                    >
                        <Bell className="size-4 text-primary" /> Tạo thông báo việc làm
                    </button>
                </div>

                {/* Sub-Banner: Location highlight */}
                <div className="mt-4 p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex items-center justify-between text-xs text-emerald-950">
                    <span>
                        Có <strong>{total}</strong> việc làm &ldquo;{displayKeyword}&rdquo; phù hợp nhất.{" "}
                        <span className="font-bold text-primary hover:underline cursor-pointer">
                            Xem ngay &rarr;
                        </span>
                    </span>
                </div>
            </div>

            {/* Main 2-Column Content (Matching Image 2) */}
            <div className="max-w-[1300px] mx-auto px-6 pt-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* LEFT COLUMN: FILTERS SIDEBAR (4 cols) */}
                <div className="lg:col-span-4 space-y-4">
                    <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-6">
                        {/* Filter 1: Nghỉ thứ 7 */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-1.5">
                                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                                    Nghỉ thứ 7
                                </h3>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs">
                                {[
                                    { id: "none", label: "Không lọc" },
                                    { id: "sat_work", label: "Làm thứ 7" },
                                    { id: "sat_off", label: "Nghỉ thứ 7" },
                                    { id: "unspecified", label: "Tin đăng không đề cập" }
                                ].map((item) => (
                                    <label
                                        key={item.id}
                                        className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-gray-900"
                                    >
                                        <input
                                            type="radio"
                                            name="saturday_filter"
                                            value={item.id}
                                            checked={saturdayFilter === item.id}
                                            onChange={(e) => setSaturdayFilter(e.target.value)}
                                            className="size-3.5 text-primary"
                                        />
                                        <span className="text-xs truncate">{item.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>


                        {/* Filter 3: Hình thức kinh doanh */}
                        <div className="pt-4 border-t border-gray-100 space-y-3">
                            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                                Hình thức kinh doanh
                            </h3>

                            <div className="grid grid-cols-2 gap-2 text-xs">
                                {[
                                    { id: "all", label: "Tất cả" },
                                    { id: "direct", label: "Direct Sales" },
                                    { id: "telesales", label: "Telesales" },
                                    { id: "online", label: "Online Sales" }
                                ].map((b) => (
                                    <label
                                        key={b.id}
                                        className="flex items-center gap-2 cursor-pointer text-gray-700"
                                    >
                                        <input
                                            type="radio"
                                            name="biz_type"
                                            value={b.id}
                                            checked={bizType === b.id}
                                            onChange={(e) => setBizType(e.target.value)}
                                            className="size-3.5 text-primary"
                                        />
                                        <span className="text-xs">{b.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

                {/* RIGHT COLUMN: JOB LIST (8 cols) (Matching Image 2) */}
                <div className="lg:col-span-8 space-y-4">
                    {/* Top Sort & SearchBy Tabs (Matching Image 2) */}
                    <div className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-1.5 text-gray-600">
                            <span className="font-semibold text-gray-500">Tìm kiếm theo:</span>
                            {[
                                { id: "job_title", label: "Tên việc làm" },
                                { id: "company", label: "Tên công ty" },
                                { id: "both", label: "Cả hai" }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setSearchBy(tab.id)}
                                    className={`px-3 py-1 rounded-full font-bold transition cursor-pointer ${
                                        searchBy === tab.id
                                            ? "bg-emerald-50 text-primary border border-emerald-300"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                >
                                    {searchBy === tab.id && <Check className="size-3 inline mr-1" />}
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
                            <span className="font-semibold text-gray-500 text-xs">Sắp xếp theo:</span>
                            <Select itemToStringLabel={getSelectLabel} value={sortBy} onValueChange={(val) => setSortBy(val)}>
                                <SelectTrigger className="h-8 min-w-[140px] rounded-xl border-gray-200 bg-gray-50 text-xs font-bold text-gray-800">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="relevant">Phù hợp nhất</SelectItem>
                                    <SelectItem value="newest">Mới nhất</SelectItem>
                                    <SelectItem value="salary">Lương cao nhất</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Job Cards List */}
                    {loading ? (
                        <div className="py-16 flex flex-col items-center justify-center gap-3">
                            <Loader2 className="size-8 animate-spin text-primary" />
                            <p className="text-xs text-gray-500 font-medium">Đang tìm kiếm việc làm phù hợp...</p>
                        </div>
                    ) : jobs.length > 0 ? (
                        <div className="space-y-3.5">
                            {jobs.map((job) => {
                                const salaryFormatted = formatSalary(job.salary);
                                const locationLabel =
                                    Array.isArray(job.work_location) && job.work_location.length > 0
                                        ? job.work_location.map((l) => l.city_name || l.address_detail).join(" & ")
                                        : "";

                                return (
                                    <div
                                        key={job.id}
                                        onClick={() => navigate(`/viec-lam/${job.slug || job.id}`)}
                                        className="bg-white rounded-3xl p-5 border border-border hover:border-primary hover:shadow-sm transition cursor-pointer group relative"
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Company Logo */}
                                            <div className="size-16 sm:size-20 rounded-2xl bg-gray-50 border border-border p-2 flex items-center justify-center overflow-hidden shrink-0">
                                                {job.company?.logo_url ? (
                                                    <img
                                                        src={job.company.logo_url}
                                                        alt={job.company?.company_name}
                                                        className="size-full object-contain"
                                                    />
                                                ) : (
                                                    <Building2 className="size-8 text-emerald-600" />
                                                )}
                                            </div>

                                            {/* Job Main Information */}
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="min-w-0 pr-2">
                                                        <h3 className="text-sm sm:text-base font-black text-gray-900 group-hover:text-primary transition leading-snug">
                                                            {job.title}
                                                        </h3>
                                                        <p className="text-xs text-gray-500 uppercase font-medium mt-1 truncate">
                                                            {job.company?.company_name || ""}
                                                        </p>
                                                    </div>

                                                    {/* Salary badge on top right */}
                                                    <div className="text-right shrink-0">
                                                        <span className="text-sm font-bold text-primary">
                                                            {salaryFormatted || "Thoả thuận"}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Meta tags: Location & Experience */}
                                                <div className="flex items-center gap-2 mt-3 flex-wrap text-xs">
                                                    <span className="px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[11px] font-medium">
                                                        {locationLabel}
                                                    </span>
                                                    <span className="px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[11px] font-medium">
                                                        {job.experience_level || ""}
                                                    </span>
                                                </div>

                                                {/* Bottom bar: tags, post time, heart */}
                                                <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100 text-[11px] text-gray-400">
                                                    <div className="flex items-center gap-2 truncate">
                                                        <span className="text-gray-500 font-medium truncate">
                                                            {job.specialty || job.category || ""}
                                                        </span>
                                                        {(job.created_at || job.updated_at) && <span>•</span>}
                                                        <span>{formatDate(job.created_at || job.updated_at)}</span>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={(e) => handleToggleSaveJob(e, job.id)}
                                                        className={`p-1 rounded-md transition cursor-pointer ${savedJobs[job.id] ? "bg-emerald-50 text-primary" : "text-gray-400 hover:text-primary"}`}
                                                    >
                                                        <Heart className={`size-4 ${savedJobs[job.id] ? "fill-[#00b14f]" : ""}`} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-white p-12 rounded-3xl text-center border border-gray-200">
                            <p className="text-sm font-normal text-gray-400">
                                Hiện chưa có việc làm nào
                            </p>
                        </div>
                    )}
                </div>
            </div>
            {toast.message && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "success" })} />}
        </div>
    );
}
