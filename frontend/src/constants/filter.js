export const FILTER_BUTTONS_MAP = {
    location: [
        { id: "all", label: "Ngẫu nhiên" },
        { id: "hanoi", label: "Hà Nội" },
        { id: "hcm", label: "Thành Phố Hồ Chí Minh" },
        { id: "danang", label: "Đà Nẵng" },
    ],
    salary: [
        { id: "all", label: "Tất cả mức lương" },
        { id: "under-10", label: "Dưới 10 triệu" },
        { id: "10-15", label: "10 - 15 triệu" },
        { id: "15-20", label: "15 - 20 triệu" },
        { id: "above-20", label: "Trên 20 triệu" },
        { id: "negotiable", label: "Thỏa thuận" },
    ],
    experience: [
        { id: "all", label: "Tất cả kinh nghiệm" },
        { id: "none", label: "Chưa có kinh nghiệm" },
        { id: "under-1", label: "Dưới 1 năm" },
        { id: "1-2", label: "1 - 2 năm" },
        { id: "3-5", label: "3 - 5 năm" },
        { id: "above-5", label: "Trên 5 năm" },
    ],
    sector: [
        { id: "all", label: "Tất cả ngành nghề" },
        { id: "it", label: "IT - Phần mềm" },
        { id: "sales", label: "Kinh doanh / Bán hàng" },
        { id: "marketing", label: "Marketing / PR" },
        { id: "accounting", label: "Kế toán / Kiểm toán" },
        { id: "hr", label: "Hành chính / Nhân sự" },
    ],
};

export const filterLabels = {
    location: "Địa điểm",
    salary: "Mức lương",
    experience: "Kinh nghiệm",
    sector: "Ngành nghề",
};
