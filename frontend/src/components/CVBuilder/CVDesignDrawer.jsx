import { X, Type, MoveVertical } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

export default function CVDesignDrawer({
    isOpen,
    onClose,
    fontFamily = "Roboto",
    setFontFamily,
    fontSize = "13px",
    setFontSize,
    lineHeight = 1.5,
    setLineHeight,
    themeColor = "#000000",
    setThemeColor,
}) {
    if (!isOpen) return null;

    const presetColors = [
        { id: "black", color: "#000000", name: "Đen tiêu chuẩn" },
        { id: "topcv", color: "#00b14f", name: "Xanh TopCV" },
        { id: "navy", color: "#1e3a8a", name: "Xanh Navy" },
        { id: "burgundy", color: "#881337", name: "Đỏ Rượu" },
        { id: "slate", color: "#334155", name: "Xám Than" },
        { id: "orange", color: "#ea580c", name: "Cam Năng Động" },
    ];

    const fontOptions = [
        { id: "Roboto", name: "Roboto (TopCV Khuyên dùng)" },
        { id: "Inter", name: "Inter (Hiện đại, Sắc nét)" },
        { id: "Open Sans", name: "Open Sans (Dễ đọc)" },
        { id: "Montserrat", name: "Montserrat (Trẻ trung)" },
        { id: "Arial", name: "Arial (Cổ điển)" },
    ];

    const fontSizeValue = parseInt(fontSize, 10) || 13;
    const fontSizeProgress = ((fontSizeValue - 11) / (16 - 11)) * 100;
    const lineHeightProgress = ((lineHeight - 1.1) / (2.0 - 1.1)) * 100;

    return (
        <div className="w-80 bg-white border-r border-gray-200 h-full p-5 overflow-y-auto shrink-0 select-none z-20 shadow-sm animate-in slide-in-from-left duration-200 print:hidden">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h3 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                    <Type className="size-4 text-primary" /> Thiết kế & Font
                </h3>
                <button
                    type="button"
                    onClick={onClose}
                    className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                    title="Đóng bảng cài đặt"
                >
                    <X className="size-4" />
                </button>
            </div>

            <div className="space-y-6 pt-5 text-xs">
                {/* 1. Font chữ */}
                <div className="space-y-2">
                    <label className="block font-bold text-[11px] text-gray-600 uppercase tracking-wider flex items-center justify-between">
                        <span>FONT CHỮ TOÀN CV</span>
                        <span className="text-primary font-semibold">
                            {fontFamily}
                        </span>
                    </label>
                    <Select value={fontFamily} onValueChange={(value) => setFontFamily?.(value)}>
                        <SelectTrigger className="h-10 w-full rounded-xl border-gray-200 bg-white px-3 text-xs font-semibold text-gray-800 shadow-2xs">
                            <SelectValue placeholder="Chọn font chữ" />
                        </SelectTrigger>
                        <SelectContent>
                            {fontOptions.map((f) => (
                                <SelectItem key={f.id} value={f.id}>
                                    {f.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* 2. Cỡ chữ */}
                <div className="space-y-2.5 p-3 rounded-xl border border-gray-100">
                    <div className="flex justify-between items-center">
                        <label className="font-bold text-[11px] text-gray-700 uppercase tracking-wider flex items-center gap-1">
                            <Type className="size-3.5 text-primary" /> CỠ CHỮ
                            (FONT SIZE)
                        </label>
                        <span className="text-xs font-bold text-primary bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                            {fontSize}
                        </span>
                    </div>
                    <input
                        type="range"
                        min="11"
                        max="16"
                        step="1"
                        value={fontSizeValue}
                        onChange={(e) => setFontSize?.(`${e.target.value}px`)}
                        style={{
                            background: `linear-gradient(to right, var(--primary) ${fontSizeProgress}%, var(--background) ${fontSizeProgress}%)`,
                        }}
                        className="cv-range w-full accent-primary cursor-pointer h-2 rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 font-medium">
                        <span>11px (Nhỏ)</span>
                        <span>13px (Tiêu chuẩn)</span>
                        <span>16px (Lớn)</span>
                    </div>
                </div>

                {/* 3. Khoảng cách dòng */}
                <div className="space-y-2.5 p-3 rounded-xl border border-gray-100">
                    <div className="flex justify-between items-center">
                        <label className="font-bold text-[11px] text-gray-700 uppercase tracking-wider flex items-center gap-1">
                            <MoveVertical className="size-3.5 text-primary" />{" "}
                            KHOẢNG CÁCH DÒNG (LINE HEIGHT)
                        </label>
                        <span className="text-xs font-bold text-primary bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                            {lineHeight}
                        </span>
                    </div>
                    <input
                        type="range"
                        min="1.1"
                        max="2.0"
                        step="0.1"
                        value={lineHeight}
                        onChange={(e) =>
                            setLineHeight?.(parseFloat(e.target.value))
                        }
                        style={{
                            background: `linear-gradient(to right, var(--primary) ${lineHeightProgress}%, var(--background) ${lineHeightProgress}%)`,
                        }}
                        className="cv-range w-full accent-primary cursor-pointer h-2 rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 font-medium">
                        <span>1.1 (Khít)</span>
                        <span>1.5 (Chuẩn)</span>
                        <span>2.0 (Thoáng)</span>
                    </div>
                </div>

                {/* 4. Màu chủ đề */}
                <div className="space-y-3">
                    <label className="block font-bold text-[11px] text-gray-600 uppercase tracking-wider flex items-center justify-between">
                        <span>MÀU CHỦ ĐỀ</span>
                    </label>
                    <div className="flex items-center gap-2 flex-wrap">
                        {presetColors.map((col) => (
                            <button
                                key={col.id}
                                type="button"
                                title={col.name}
                                onClick={() => setThemeColor?.(col.color)}
                                style={{ backgroundColor: col.color }}
                                className={`size-7 rounded-full transition-transform cursor-pointer flex items-center justify-center ${
                                    themeColor.toLowerCase() ===
                                    col.color.toLowerCase()
                                        ? "ring-2 ring-offset-2 ring-emerald-500 scale-110 shadow-xs"
                                        : "hover:scale-105 border border-gray-200"
                                }`}
                            />
                        ))}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                        <input
                            type="color"
                            value={themeColor}
                            onChange={(e) => setThemeColor?.(e.target.value)}
                            className="w-9 h-8 rounded-lg cursor-pointer border border-gray-200 p-0.5"
                        />
                        <span className="text-xs text-gray-600 font-mono font-medium">
                            {themeColor}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
