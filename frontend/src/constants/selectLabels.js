const SELECT_LABELS = {
    FULL_TIME: "Toàn thời gian (Full-time)",
    PART_TIME: "Bán thời gian (Part-time)",
    FREELANCE: "Freelance / Dự án",
    INTERNSHIP: "Thực tập sinh (Internship)",
    RANGE: "Trong khoảng (Min - Max)",
    UP_TO: "Lên đến (Tối đa)",
    MINIMUM: "Từ (Tối thiểu)",
    AGREEMENT: "Thoả thuận",
    relevant: "Phù hợp nhất",
    newest: "Mới nhất",
    salary: "Lương cao nhất",
};

export const getSelectLabel = (value) => SELECT_LABELS[value] || value;

export default SELECT_LABELS;
