import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { HOME_CATEGORY_LINKS } from "../../../constants/homeCategoryLinks";
export default function Categories({ categories }) {
    const list = Array.isArray(categories) && categories.length > 0
        ? categories
        : HOME_CATEGORY_LINKS;

    return (
        <div className="hidden w-[328px] flex-col rounded-2xl border-r border-border bg-white py-2 md:flex">
            {list.map((item) => (
                <Link
                    key={item.id}
                    to={`/tim-viec-lam-${item.group_slug}`}
                    className="group flex w-full cursor-pointer items-center justify-between gap-[30px] px-[21px] py-2.5"
                >
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-text group-hover:text-primary">
                        {item.group_name}
                    </span>
                    <ChevronRight className="size-4 shrink-0 text-text group-hover:text-primary" />
                </Link>
            ))}
        </div>
    );
}
