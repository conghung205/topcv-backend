import { Edit3 } from "lucide-react";

/**
 * Component hiển thị nội dung Rich HTML (sinh ra từ CKEditor 5) trên bản xem trước A4 của CV.
 * Hỗ trợ click để mở nhanh trình soạn thảo CKEditor.
 */
export default function CVHtmlContent({
    html = "",
    placeholder = "Nhập nội dung chi tiết...",
    onEdit,
    className = "",
}) {
    // Nếu chưa có nội dung hoặc chỉ có thẻ rỗng
    const isEmpty =
        !html ||
        html.trim() === "" ||
        html === "<p>&nbsp;</p>" ||
        html === "<p></p>";

    return (
        <div
            onClick={onEdit}
            title={onEdit ? "Click để chỉnh sửa bằng CKEditor 5" : undefined}
            className={`group/html relative transition-all rounded p-1 -m-1 cursor-pointer hover:bg-emerald-50/50 hover:outline-dashed hover:outline-1 hover:outline-[#00b14f] ${className}`}
        >
            {isEmpty ? (
                <p className="text-gray-400 italic text-xs font-normal">
                    {placeholder}
                </p>
            ) : (
                <div
                    className="cv-rich-content"
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            )}

            {onEdit && (
                <span className="opacity-0 group-hover/html:opacity-100 absolute -top-2.5 -right-2 bg-primary text-white p-0.5 rounded-full shadow-xs transition-opacity print:hidden pointer-events-none">
                    <Edit3 className="size-2.5" />
                </span>
            )}
        </div>
    );
}
