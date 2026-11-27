import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default function CKEditorField({
    value = "",
    onChange,
    placeholder = "Nhập nội dung chi tiết...",
    minHeight = "160px",
    className = ""
}) {
    const editorConfiguration = {
        toolbar: [
            "heading",
            "|",
            "bold",
            "italic",
            "link",
            "bulletedList",
            "numberedList",
            "|",
            "blockQuote",
            "insertTable",
            "|",
            "undo",
            "redo"
        ],
        placeholder: placeholder,
        heading: {
            options: [
                { model: "paragraph", title: "Văn bản thường", class: "ck-heading_paragraph" },
                { model: "heading2", view: "h2", title: "Tiêu đề lớn (H2)", class: "ck-heading_heading2" },
                { model: "heading3", view: "h3", title: "Tiêu đề phụ (H3)", class: "ck-heading_heading3" }
            ]
        }
    };

    return (
        <div className={`ckeditor-container ${className}`} style={{ "--ck-min-height": minHeight }}>
            <CKEditor
                editor={ClassicEditor}
                data={value || ""}
                config={editorConfiguration}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    if (onChange) {
                        onChange(data);
                    }
                }}
            />
        </div>
    );
}
