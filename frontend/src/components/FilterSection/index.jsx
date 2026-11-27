import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FILTER_BUTTONS_MAP, filterLabels } from "../../constants/filter";

export default function FilterSection({
    filter = "location",
    onFilterChange,
    subFilter = "all",
    onSubFilterChange,
}) {
    const currentButtons = FILTER_BUTTONS_MAP[filter] || FILTER_BUTTONS_MAP.location;

    const handleSelectChange = (newVal) => {
        onFilterChange(newVal);
        onSubFilterChange("all");
    };

    return (
        <div className="mt-2 mb-3 flex flex-wrap items-center gap-2">
            {/* Select */}
            <div className="flex h-8 items-center gap-1 rounded-[5px] border border-border bg-white px-2 transition-colors hover:border-primary">
                <div className="flex items-center gap-0.75 text-xs font-medium whitespace-nowrap text-text-secondary">
                    <Filter className="size-4 text-text" />
                    <span>Lọc theo:</span>
                </div>

                <Select value={filter} onValueChange={handleSelectChange}>
                    <SelectTrigger className="h-full w-[100px] rounded-none border-none bg-transparent p-0 text-xs font-semibold text-primary shadow-none sm:w-[120px]">
                        <SelectValue>
                            {(value) => filterLabels[value]}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="location">Địa điểm</SelectItem>
                        <SelectItem value="salary">Mức lương</SelectItem>
                        <SelectItem value="experience">Kinh nghiệm</SelectItem>
                        <SelectItem value="sector">Ngành nghề</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Dynamic Filter buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
                {currentButtons.map((btn) => {
                    const isActive = subFilter === btn.id;
                    return (
                        <Button
                            key={btn.id}
                            variant={isActive ? "default" : "outline"}
                            onClick={() => onSubFilterChange(btn.id)}
                            className={`h-8 shrink-0 rounded-[5px] px-3 py-0 text-xs font-semibold cursor-pointer transition-all ${
                                isActive
                                    ? "bg-primary hover:bg-primary/90 text-white border-primary"
                                    : "bg-white text-gray-700 hover:text-primary hover:border-primary border-border"
                            }`}
                        >
                            {btn.label}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
}
