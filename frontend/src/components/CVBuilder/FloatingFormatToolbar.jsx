import {
    Bold,
    Italic,
    Underline,
    List,
    ListOrdered,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
} from "lucide-react";

/**
 * Thanh công cụ định dạng nổi (Floating Toolbar) giống 100% trong ảnh chụp TopCV
 */
export default function FloatingFormatToolbar({
    fontSize = "13px",
    setFontSize,
    fontFamily = "Roboto",
    setFontFamily,
    textColor = "#000000",
    setTextColor,
    onFormat,
    className = "",
}) {
    const handleCommand = (cmd, val = null) => {
        document.execCommand(cmd, false, val);
        if (onFormat) onFormat();
    };

    return (
        <div
            className={`flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl shadow-xl border border-gray-200 text-gray-700 text-xs z-30 select-none print:hidden animate-in fade-in zoom-in-95 duration-150 ${className}`}
        >
            {/* Font Size Dropdown */}
            <select
                value={fontSize}
                onChange={(e) => {
                    setFontSize?.(e.target.value);
                    handleCommand("fontSize", "3");
                }}
                className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md px-1.5 py-1 text-xs font-semibold focus:outline-none cursor-pointer"
            >
                <option value="11px">11px</option>
                <option value="12px">12px</option>
                <option value="13px">13px</option>
                <option value="14px">14px</option>
                <option value="15px">15px</option>
                <option value="16px">16px</option>
            </select>

            {/* Font Family Dropdown */}
            <select
                value={fontFamily}
                onChange={(e) => {
                    setFontFamily?.(e.target.value);
                    handleCommand("fontName", e.target.value);
                }}
                className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md px-1.5 py-1 text-xs font-semibold focus:outline-none cursor-pointer"
            >
                <option value="Roboto">Roboto</option>
                <option value="Inter">Inter</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Arial">Arial</option>
            </select>

            <span className="w-px h-4 bg-gray-200 mx-0.5" />

            {/* Color Swatch Picker */}
            <label
                className="size-5 rounded-full border border-gray-300 cursor-pointer flex items-center justify-center overflow-hidden hover:scale-110 transition shrink-0"
                title="Đổi màu chữ"
            >
                <input
                    type="color"
                    value={textColor}
                    onChange={(e) => {
                        setTextColor?.(e.target.value);
                        handleCommand("foreColor", e.target.value);
                    }}
                    className="opacity-0 absolute size-0"
                />
                <span
                    className="size-3.5 rounded-full"
                    style={{ backgroundColor: textColor }}
                />
            </label>

            <span className="w-px h-4 bg-gray-200 mx-0.5" />

            {/* Bold */}
            <button
                type="button"
                onMouseDown={(e) => {
                    e.preventDefault();
                    handleCommand("bold");
                }}
                className="p-1 hover:bg-gray-100 rounded text-gray-700 hover:text-black transition cursor-pointer"
                title="In đậm (Ctrl+B)"
            >
                <Bold className="size-3.5 stroke-[2.5]" />
            </button>

            {/* Italic */}
            <button
                type="button"
                onMouseDown={(e) => {
                    e.preventDefault();
                    handleCommand("italic");
                }}
                className="p-1 hover:bg-gray-100 rounded text-gray-700 hover:text-black transition cursor-pointer"
                title="In nghiêng (Ctrl+I)"
            >
                <Italic className="size-3.5" />
            </button>

            {/* Underline */}
            <button
                type="button"
                onMouseDown={(e) => {
                    e.preventDefault();
                    handleCommand("underline");
                }}
                className="p-1 hover:bg-gray-100 rounded text-gray-700 hover:text-black transition cursor-pointer"
                title="Gạch chân (Ctrl+U)"
            >
                <Underline className="size-3.5" />
            </button>

            <span className="w-px h-4 bg-gray-200 mx-0.5" />

            {/* Bulleted List */}
            <button
                type="button"
                onMouseDown={(e) => {
                    e.preventDefault();
                    handleCommand("insertUnorderedList");
                }}
                className="p-1 hover:bg-gray-100 rounded text-gray-700 hover:text-black transition cursor-pointer"
                title="Gạch đầu dòng (List)"
            >
                <List className="size-3.5" />
            </button>

            {/* Numbered List */}
            <button
                type="button"
                onMouseDown={(e) => {
                    e.preventDefault();
                    handleCommand("insertOrderedList");
                }}
                className="p-1 hover:bg-gray-100 rounded text-gray-700 hover:text-black transition cursor-pointer"
                title="Đánh số thứ tự"
            >
                <ListOrdered className="size-3.5" />
            </button>

            <span className="w-px h-4 bg-gray-200 mx-0.5" />

            {/* Align Left */}
            <button
                type="button"
                onMouseDown={(e) => {
                    e.preventDefault();
                    handleCommand("justifyLeft");
                }}
                className="p-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-800 transition cursor-pointer"
                title="Căn trái"
            >
                <AlignLeft className="size-3.5" />
            </button>

            {/* Align Center */}
            <button
                type="button"
                onMouseDown={(e) => {
                    e.preventDefault();
                    handleCommand("justifyCenter");
                }}
                className="p-1 hover:bg-gray-100 rounded text-gray-600 transition cursor-pointer"
                title="Căn giữa"
            >
                <AlignCenter className="size-3.5" />
            </button>

            {/* Align Right */}
            <button
                type="button"
                onMouseDown={(e) => {
                    e.preventDefault();
                    handleCommand("justifyRight");
                }}
                className="p-1 hover:bg-gray-100 rounded text-gray-600 transition cursor-pointer"
                title="Căn phải"
            >
                <AlignRight className="size-3.5" />
            </button>

            {/* Align Justify */}
            <button
                type="button"
                onMouseDown={(e) => {
                    e.preventDefault();
                    handleCommand("justifyFull");
                }}
                className="p-1 hover:bg-gray-100 rounded text-gray-600 transition cursor-pointer"
                title="Căn đều 2 bên"
            >
                <AlignJustify className="size-3.5" />
            </button>
        </div>
    );
}
