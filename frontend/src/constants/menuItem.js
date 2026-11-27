import { ChevronDown } from "lucide-react";
import { ArrowRight } from "lucide-react";

export const MENU_ITEMS = [
    {
        label: "Việc làm",
        path: "/vieclam",
        icon: ChevronDown,
        columns: [
            {
                title: "VIỆC LÀM",
                items: [
                    {
                        label: "Tìm việc làm",
                        path: "vieclam",
                        icon: ArrowRight,
                        type: "link",
                    },
                ],
            },
            {
                title: "VIỆC LÀM THEO VỊ TRÍ",
                items: [
                    {
                        label: "Việc làm Kế toán",
                        slug: "ke-toan",
                        icon: ArrowRight,
                        type: "search",
                    },
                    {
                        label: "Việc làm IT",
                        slug: "it",
                        icon: ArrowRight,
                        type: "search",
                    },
                ],
            },
        ],
    },
    {
        label: "Tạo CV",
        path: "/mau-cv",
        icon: ChevronDown,
        columns: [
            {
                title: "Mẫu theo style",
                items: [
                    {
                        label: "Mẫu CV đơn giản",
                        path: "mau-cv-don-gian",
                        icon: ArrowRight,
                        type: "link",
                    },
                ],
            },
        ],
    },
    {
        label: "Công cụ",
        path: "#",
        icon: ChevronDown,
        columns: [
            {
                title: "Khám phá và nâng cấp bản thân",
                items: [
                    {
                        label: "Bộ câu hỏi phỏng vấn",
                        path: "bo-cau-hoi-phong-van",
                        icon: ArrowRight,
                        type: "link",
                    },
                ],
            },
        ],
    },
    {
        label: "Cẩm nang nghề nghiệp",
        path: "/blog",
        icon: ChevronDown,
        columns: [
            {
                title: "Bí kíp tìm việc",
                items: [
                    {
                        label: "Bí kíp tìm việc",
                        path: "blog/bi-kip-tim-viec",
                        icon: ArrowRight,
                        type: "link",
                    },
                ],
            },
        ],
    },
];
