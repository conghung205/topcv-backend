import { useState } from "react";
import { Link } from "react-router-dom";
import { useCompanies } from "@/hooks";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
    Building2,
    Search,
    ShieldCheck,
    Phone,
    Mail,
    MapPin,
    Globe,
    ExternalLink,
    Loader2,
    Eye,
    X,
    CheckCircle2,
    ChevronLeft,
    ChevronRight
} from "lucide-react";

export default function AdminCompaniesPage() {
    const [page, setPage] = useState(1);
    const [keyword, setKeyword] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [selectedCompany, setSelectedCompany] = useState(null);

    const { data: res, isLoading: loading } = useCompanies({
        page,
        keyword: searchKeyword.trim() || undefined
    });

    const companies = res?.data || [];
    const total = res?.total || 0;

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        setSearchKeyword(keyword);
    };

    return (
        <div className="bg-bg-main min-h-screen pb-16 font-[Inter,sans-serif]">
            {/* Top Admin Header */}
            <div className="bg-[linear-gradient(180deg,#002b33,rgba(0,43,51,.25)),linear-gradient(90deg,#008060_21.86%,#2bab60_78.13%)] text-white py-8 px-6 shadow-md">
                <div className="max-w-[1400px] mx-auto space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2 border border-emerald-500/30">
                                <ShieldCheck className="size-3.5" /> Quản trị viên TopCV
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                                Danh sách Doanh Nghiệp & Nhà Tuyển Dụng
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-300 mt-1">
                                Quản lý, kiểm duyệt thông tin pháp lý (Mã số thuế, Giám đốc, Tên quốc tế, Liên hệ) của tất cả doanh nghiệp đăng ký.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                            <Link
                                to="/employer/register"
                                className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
                            >
                                <Building2 className="size-4" /> Đăng ký doanh nghiệp mới
                            </Link>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <form onSubmit={handleSearchSubmit} className="pt-2 flex flex-col sm:flex-row gap-2.5 max-w-xl">
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-3 size-4 text-gray-400" />
                            <input
                                type="text"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                placeholder="Tìm kiếm theo Tên công ty hoặc Mã số thuế..."
                                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-white rounded-xl text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition cursor-pointer"
                        >
                            Tìm kiếm
                        </button>
                    </form>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-[1400px] mx-auto px-6 pt-6 space-y-4">
                {/* Stats row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
                        <p className="text-xs font-normal text-gray-700">Tổng doanh nghiệp</p>
                        <p className="text-2xl font-medium text-gray-900 mt-1">{total}</p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
                        <p className="text-xs font-normal text-gray-700">Đã kích hoạt tài khoản</p>
                        <p className="text-2xl font-medium text-gray-900 mt-1">{total}</p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
                        <p className="text-xs font-normal text-gray-700">Trạng thái hồ sơ MST</p>
                        <p className="text-2xl font-medium text-gray-900 mt-1">100% Khớp pháp lý</p>
                    </div>
                </div>

                {/* Table container */}
                <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                            <Building2 className="size-4 text-primary" /> Bảng thông tin pháp lý doanh nghiệp
                        </h2>
                        <span className="text-xs text-gray-500">
                            Hiển thị <strong>{companies.length}</strong> / <strong>{total}</strong> công ty
                        </span>
                    </div>

                    {loading ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-3">
                            <Loader2 className="size-8 animate-spin text-primary" />
                            <p className="text-xs text-gray-500 font-medium">Đang tải danh sách công ty...</p>
                        </div>
                    ) : companies.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-gray-700">
                                <thead className="bg-gray-50/80 text-gray-500 font-bold uppercase tracking-wider text-[11px] border-b border-gray-200">
                                    <tr>
                                        <th className="px-5 py-3.5">Mã số thuế</th>
                                        <th className="px-5 py-3.5">Tên công ty & Tên quốc tế</th>
                                        <th className="px-5 py-3.5">Người đại diện / GĐ</th>
                                        <th className="px-5 py-3.5">Số điện thoại</th>
                                        <th className="px-5 py-3.5">Email liên hệ</th>
                                        <th className="px-5 py-3.5">Trụ sở</th>
                                        <th className="px-5 py-3.5 text-right">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {companies.map((comp) => (
                                        <tr key={comp.id} className="hover:bg-emerald-50/30 transition">
                                            {/* MST */}
                                            <td className="px-5 py-4 font-mono font-bold text-emerald-800 whitespace-nowrap">
                                                {comp.tax_code}
                                            </td>

                                            {/* Company Name & International Name */}
                                            <td className="px-5 py-4 max-w-xs">
                                                <p className="font-bold text-gray-900 leading-snug">{comp.company_name}</p>
                                                {comp.international_name && (
                                                    <p className="text-[11px] text-gray-400 font-medium mt-0.5 truncate" title={comp.international_name}>
                                                        {comp.international_name}
                                                    </p>
                                                )}
                                                {comp.short_name && (
                                                    <span className="inline-block px-2 py-0.5 mt-1 rounded bg-gray-100 text-[10px] font-semibold text-gray-600">
                                                        {comp.short_name}
                                                    </span>
                                                )}
                                            </td>

                                            {/* Director */}
                                            <td className="px-5 py-4 font-semibold text-gray-800 whitespace-nowrap">
                                                {comp.director || "Chưa cập nhật"}
                                            </td>

                                            {/* Phone */}
                                            <td className="px-5 py-4 whitespace-nowrap font-medium text-gray-700">
                                                <a href={`tel:${comp.phone_number}`} className="hover:text-primary flex items-center gap-1">
                                                    <Phone className="size-3 text-gray-400" />
                                                    {comp.phone_number}
                                                </a>
                                            </td>

                                            {/* Email */}
                                            <td className="px-5 py-4 whitespace-nowrap font-medium text-gray-700">
                                                <a href={`mailto:${comp.email}`} className="hover:text-primary flex items-center gap-1">
                                                    <Mail className="size-3 text-gray-400" />
                                                    {comp.email}
                                                </a>
                                            </td>

                                            {/* Headquarters */}
                                            <td className="px-5 py-4 max-w-[220px] truncate text-gray-600" title={comp.headquarters_address}>
                                                {comp.headquarters_address || "Chưa có địa chỉ"}
                                            </td>

                                            {/* Action */}
                                            <td className="px-5 py-4 text-right whitespace-nowrap">
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedCompany(comp)}
                                                    className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-emerald-100 text-gray-700 hover:text-emerald-800 text-xs font-semibold transition inline-flex items-center gap-1 cursor-pointer"
                                                >
                                                    <Eye className="size-3.5" /> Chi tiết
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-12 text-center text-gray-500 text-xs">
                            Hiện chưa có công ty nào
                        </div>
                    )}

                    {/* Pagination */}
                    {total > 20 && (
                        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                            <span>Trang {page} / {Math.ceil(total / 20)}</span>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page <= 1}
                                    onClick={() => setPage(page - 1)}
                                    className="h-8 px-2.5"
                                >
                                    <ChevronLeft className="size-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page >= Math.ceil(total / 20)}
                                    onClick={() => setPage(page + 1)}
                                    className="h-8 px-2.5"
                                >
                                    <ChevronRight className="size-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* DETAIL COMPANY MODAL */}
            {selectedCompany && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                        {/* Header */}
                        <div className="p-5 text-gray-900 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                                    <Building2 className="size-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-base font-medium leading-tight">Hồ sơ pháp lý doanh nghiệp</h3>
                                    <p className="text-xs text-gray-500 font-mono mt-0.5">MST: {selectedCompany.tax_code}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedCompany(null)}
                                className="p-2 text-gray-400 hover:text-gray-700 rounded-lg transition cursor-pointer"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        {/* Dossier Body */}
                        <div className="p-6 space-y-5 text-xs text-gray-800 max-h-[75vh] overflow-y-auto">
                            {/* Main legal info */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <div>
                                    <p className="text-gray-400 font-medium">Tên công ty tiếng Việt</p>
                                    <p className="font-bold text-gray-900 mt-0.5 text-sm">{selectedCompany.company_name}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 font-medium">Tên quốc tế (International Name)</p>
                                    <p className="font-semibold text-gray-900 mt-0.5">
                                        {selectedCompany.international_name || "Chưa khai báo"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-400 font-medium">Tên viết tắt / Thương hiệu</p>
                                    <p className="font-semibold text-gray-900 mt-0.5">
                                        {selectedCompany.short_name || "Chưa khai báo"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-400 font-medium">Người đại diện pháp luật / Giám đốc</p>
                                    <p className="font-bold text-emerald-700 mt-0.5 text-sm">
                                        {selectedCompany.director || "Chưa khai báo"}
                                    </p>
                                </div>
                            </div>

                            {/* Contact info */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-3.5 rounded-2xl border border-gray-100 flex items-center gap-3">
                                    <Phone className="size-4 text-primary shrink-0" />
                                    <div>
                                        <p className="text-[11px] text-gray-400">Số điện thoại liên hệ</p>
                                        <p className="font-bold text-gray-900">{selectedCompany.phone_number}</p>
                                    </div>
                                </div>

                                <div className="p-3.5 rounded-2xl border border-gray-100 flex items-center gap-3">
                                    <Mail className="size-4 text-primary shrink-0" />
                                    <div>
                                        <p className="text-[11px] text-gray-400">Email doanh nghiệp</p>
                                        <p className="font-bold text-gray-900">{selectedCompany.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Address & Website */}
                            <div className="space-y-3">
                                <div className="p-3.5 rounded-2xl border border-gray-100 flex items-start gap-3">
                                    <MapPin className="size-4 text-primary shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-[11px] text-gray-400">Địa chỉ trụ sở chính</p>
                                        <p className="font-medium text-gray-900 leading-relaxed">
                                            {selectedCompany.headquarters_address || "Chưa cập nhật"}
                                        </p>
                                    </div>
                                </div>

                                {selectedCompany.website && (
                                    <div className="p-3.5 rounded-2xl border border-gray-100 flex items-center gap-3">
                                        <Globe className="size-4 text-primary shrink-0" />
                                        <div>
                                            <p className="text-[11px] text-gray-400">Website chính thức</p>
                                            <a
                                                href={selectedCompany.website}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-primary font-semibold hover:underline flex items-center gap-1"
                                            >
                                                {selectedCompany.website} <ExternalLink className="size-3" />
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Verification status */}
                            <div className="pt-2 flex items-center justify-between border-t border-gray-100">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-500 font-medium">Trạng thái xác thực:</span>
                                    <Badge className="bg-emerald-100 text-primary hover:bg-emerald-100 font-bold text-[11px]">
                                        <CheckCircle2 className="size-3 mr-1" /> Doanh nghiệp đã đăng ký hợp lệ
                                    </Badge>
                                </div>

                                <Button
                                    variant="outline"
                                    onClick={() => setSelectedCompany(null)}
                                    className="rounded-xl h-9 text-xs"
                                >
                                    Đóng
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
