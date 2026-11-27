export const POPULAR_KEYWORDS = [
    { label: "trưởng phòng kinh doanh", slug: "truong-phong-kinh-doanh" },
    { label: "trưởng nhóm kinh doanh", slug: "truong-nhom-kinh-doanh" },
    { label: "trưởng phòng marketing", slug: "truong-phong-marketing" },
    { label: "trưởng phòng nhân sự", slug: "truong-phong-nhan-su" },
    { label: "tester", slug: "tester" },
    { label: "lập trình viên php", slug: "lap-trinh-vien-php" },
    { label: "truyền thông", slug: "truyen-thong" },
    { label: "digital marketing", slug: "digital-marketing" },
    { label: "nhân viên kỹ thuật", slug: "nhan-vien-ky-thuat" },
    { label: "nhân viên telesales", slug: "nhan-vien-telesales" }
];

const SLUG_MAP = {
    "truong-phong-kinh-doanh": "trưởng phòng kinh doanh",
    "truong-nhom-kinh-doanh": "trưởng nhóm kinh doanh",
    "truong-phong-marketing": "trưởng phòng marketing",
    "truong-phong-nhan-su": "trưởng phòng nhân sự",
    "tester": "tester",
    "lap-trinh-vien-php": "lập trình viên php",
    "truyen-thong": "truyền thông",
    "digital-marketing": "digital marketing",
    "nhan-vien-ky-thuat": "nhân viên kỹ thuật",
    "nhan-vien-telesales": "nhân viên telesales",
    "ke-toan": "Kế toán",
    "marketing": "Marketing",
    "it": "IT",
    "san-xuat": "Sản xuất",
    "it-phan-mem": "IT - Phần mềm"
};

export function slugToKeyword(slug) {
    if (!slug) return "";
    const cleanSlug = slug.replace(/^tim-viec-lam-/, "");
    if (SLUG_MAP[cleanSlug]) {
        return SLUG_MAP[cleanSlug];
    }
    return cleanSlug.replace(/-/g, " ");
}

export function keywordToSlug(keyword) {
    if (!keyword) return "";
    return keyword
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
}
