import { useState, useRef } from "react";
import FloatingFormatToolbar from "./FloatingFormatToolbar";
import { Camera } from "lucide-react";

export default function TopCVStandardTemplate({
    cvData,
    setCvData,
    fontFamily = "Roboto",
    fontSize = "13px",
    lineHeight = 1.5,
    themeColor = "#000000",
    onAvatarUpload,
}) {
    const containerRef = useRef(null);
    const blurTimerRef = useRef(null);

    // Vị trí thanh công cụ định dạng nổi (hiện trên bất kỳ khối nào đang focus)
    const [toolbarPos, setToolbarPos] = useState(null);

    // Kích hoạt thanh công cụ nổi phía trên phần tử đang focus
    const handleFieldFocus = (e) => {
        if (!containerRef.current) return;
        if (blurTimerRef.current) clearTimeout(blurTimerRef.current);

        const rootRect = containerRef.current.getBoundingClientRect();
        const elRect = e.currentTarget.getBoundingClientRect();

        // Đặt thanh công cụ cách phần tử 46px phía trên (luôn giữ trong khung A4)
        const top = Math.max(45, elRect.top - rootRect.top - 44);
        const left = Math.max(
            16,
            Math.min(elRect.left - rootRect.left, rootRect.width - 430),
        );

        setToolbarPos({ top, left });
    };

    const handleFieldBlur = (e, callback) => {
        if (e?.currentTarget && !e.currentTarget.textContent.trim()) {
            e.currentTarget.innerHTML = "";
        }
        if (callback) callback(e);
        blurTimerRef.current = setTimeout(() => {
            setToolbarPos(null);
        }, 250);
    };

    const updateField = (field, value) => {
        setCvData((prev) => ({ ...prev, [field]: value }));
    };

    const getContentBlocks = (field, blocksField) => {
        if (Array.isArray(cvData[blocksField])) return cvData[blocksField];
        if (Array.isArray(cvData[field])) {
            return [
                cvData[field]
                    .filter(Boolean)
                    .map((item) => `• ${item}`)
                    .join("<br/>")
            ];
        }
        return cvData[field] ? [cvData[field]] : [""];
    };

    const updateContentBlock = (field, blocksField, index, value) => {
        setCvData((prev) => {
            const blocks = Array.isArray(prev[blocksField])
                ? [...prev[blocksField]]
                : [prev[field] || ""];
            blocks[index] = value;
            return {
                ...prev,
                [blocksField]: blocks,
                [field]: blocks.filter(Boolean).join("<br/><br/>")
            };
        });
    };

    const addContentBlock = (field, blocksField) => {
        setCvData((prev) => {
            const blocks = Array.isArray(prev[blocksField])
                ? [...prev[blocksField]]
                : [prev[field] || ""];
            const updatedBlocks = [...blocks, ""];
            return {
                ...prev,
                [blocksField]: updatedBlocks,
                [field]: updatedBlocks.filter(Boolean).join("<br/><br/>")
            };
        });
    };

    const removeContentBlock = (field, blocksField, index) => {
        setCvData((prev) => {
            const blocks = Array.isArray(prev[blocksField])
                ? [...prev[blocksField]]
                : [prev[field] || ""];
            const updatedBlocks = blocks.filter((_, blockIndex) => blockIndex !== index);
            const safeBlocks = updatedBlocks.length ? updatedBlocks : [""];
            return {
                ...prev,
                [blocksField]: safeBlocks,
                [field]: safeBlocks.filter(Boolean).join("<br/><br/>")
            };
        });
    };

    const updateSectionTitle = (section, title) => {
        setCvData((prev) => ({
            ...prev,
            section_titles: {
                ...(prev.section_titles || {}),
                [section]: title,
            },
        }));
    };

    const updateFieldLabel = (field, label) => {
        setCvData((prev) => ({
            ...prev,
            field_labels: {
                ...(prev.field_labels || {}),
                [field]: label,
            },
        }));
    };

    const updateExperience = (index, field, value) => {
        const updated = [...cvData.experience];
        updated[index] = { ...updated[index], [field]: value };
        setCvData((prev) => ({ ...prev, experience: updated }));
    };

    const addExperience = (afterIndex) => {
        setCvData((prev) => {
            const newItem = {
                company: "",
                position: "",
                duration: "",
                description: "",
            };
            const currentList = prev.experience || [];
            if (typeof afterIndex === "number" && afterIndex >= 0) {
                const updated = [...currentList];
                updated.splice(afterIndex + 1, 0, newItem);
                return { ...prev, experience: updated };
            }
            return { ...prev, experience: [...currentList, newItem] };
        });
    };

    const removeExperience = (index) => {
        setCvData((prev) => ({
            ...prev,
            experience: prev.experience.filter((_, i) => i !== index),
        }));
    };

    const updateEducation = (index, field, value) => {
        const updated = [...cvData.education];
        updated[index] = { ...updated[index], [field]: value };
        setCvData((prev) => ({ ...prev, education: updated }));
    };

    const addEducation = (afterIndex) => {
        setCvData((prev) => {
            const newItem = {
                school: "",
                major: "",
                start_date: "",
                end_date: "",
                grade: "",
            };
            const currentList = prev.education || [];
            if (typeof afterIndex === "number" && afterIndex >= 0) {
                const updated = [...currentList];
                updated.splice(afterIndex + 1, 0, newItem);
                return { ...prev, education: updated };
            }
            return { ...prev, education: [...currentList, newItem] };
        });
    };

    const removeEducation = (index) => {
        setCvData((prev) => ({
            ...prev,
            education: prev.education.filter((_, i) => i !== index),
        }));
    };

    const activitiesList = cvData.activities || [
        {
            duration: "",
            organization: "",
            role: "",
        },
    ];

    const addActivity = (afterIndex) => {
        setCvData((prev) => {
            const newItem = {
                duration: "",
                organization: "",
                role: "",
            };
            const currentList = prev.activities || activitiesList;
            if (typeof afterIndex === "number" && afterIndex >= 0) {
                const updated = [...currentList];
                updated.splice(afterIndex + 1, 0, newItem);
                return { ...prev, activities: updated };
            }
            return { ...prev, activities: [...currentList, newItem] };
        });
    };

    const removeActivity = (index) => {
        setCvData((prev) => {
            const list = prev.activities || activitiesList;
            return {
                ...prev,
                activities: list.filter((_, i) => i !== index),
            };
        });
    };

    const updateActivity = (index, field, value) => {
        const list = [...(cvData.activities || activitiesList)];
        list[index] = { ...list[index], [field]: value };
        setCvData((prev) => ({ ...prev, activities: list }));
    };

    // Class chuẩn giúp hover và focus đứng im 100%, không bao giờ bị nhảy chữ hay xô lệch
    const baseFieldClass =
        "cv-scalable-field border border-transparent hover:border-dashed hover:border-gray-300 focus:border-solid focus:border-primary focus:bg-emerald-50/30 rounded px-1.5 py-0.5 outline-none transition-colors duration-100 cursor-text";

    return (
        <div
            ref={containerRef}
            style={{
                fontFamily: `${fontFamily}, sans-serif`,
                fontSize: fontSize,
                lineHeight: lineHeight,
                "--cv-font-size": fontSize,
                "--cv-line-height": lineHeight,
            }}
            className="cv-document w-[210mm] min-h-[297mm] bg-white shadow-xs mx-auto text-gray-900 select-text relative transition-all print:shadow-none print:w-full print:m-0"
        >
            <style>{`
                .cv-document .cv-scalable-field {
                    font-size: var(--cv-font-size) !important;
                    line-height: var(--cv-line-height) !important;
                }
            `}</style>
            {/* Thanh công cụ định dạng nổi (CKEditor Style) - Nổi trên BẤT KỲ vị trí nào đang gõ text */}
            {toolbarPos && (
                <div
                    style={{
                        top: `${toolbarPos.top}px`,
                        left: `${toolbarPos.left}px`,
                    }}
                    className="absolute z-40 transition-all duration-100"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        if (blurTimerRef.current)
                            clearTimeout(blurTimerRef.current);
                    }}
                >
                    <FloatingFormatToolbar />
                </div>
            )}

            {/* Top Tip Banner */}
            <div className="bg-[#e6f7ec] text-primary text-xs font-semibold py-2 px-6 text-center border-b border-[#b7ebc7] select-none print:hidden flex items-center justify-center gap-2">
                <span>
                    💡 Gợi ý: Bôi đen hoặc click vào bất kỳ vị trí nào để định
                    dạng và chỉnh sửa!
                </span>
            </div>

            <div className="p-10 space-y-7">
                {/* 1. Header Profile Block */}
                <div className="flex items-start gap-8">
                    {/* Left: Avatar Box */}
                    <div className="flex flex-col items-center shrink-0">
                        <div
                            onClick={onAvatarUpload}
                            className="w-36 h-44 bg-gray-100 rounded-sm border border-gray-300 relative group/avatar cursor-pointer overflow-hidden flex items-center justify-center"
                            title="Click để tải ảnh đại diện từ máy tính"
                        >
                            {cvData.avatar ? (
                                <img
                                    src={cvData.avatar}
                                    alt={cvData.full_name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex flex-col items-center text-gray-400">
                                    <div className="size-16 rounded-full bg-gray-200 flex items-center justify-center">
                                        <Camera className="size-8 text-gray-500" />
                                    </div>
                                    <span className="text-[11px] mt-2 font-medium">
                                        Tải ảnh lên
                                    </span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition print:hidden">
                                <Camera className="size-6" />
                                <span className="text-[10px] font-bold mt-1">
                                    Đổi ảnh
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Personal Information (Đứng im 100% khi hover) */}
                    <div className="flex-1 space-y-1">
                        {/* Name */}
                        <div>
                            <div
                                contentEditable
                                suppressContentEditableWarning
                                data-placeholder="Họ và tên"
                                onFocus={handleFieldFocus}
                                onBlur={(e) =>
                                    handleFieldBlur(e, () =>
                                        updateField(
                                            "full_name",
                                            e.currentTarget.textContent.trim(),
                                        ),
                                    )
                                }
                                className={`text-2xl sm:text-3xl font-bold text-gray-900 block ${baseFieldClass}`}
                            >{cvData.full_name || ""}</div>
                        </div>

                        {/* Title */}
                        <div>
                            <div
                                contentEditable
                                suppressContentEditableWarning
                                data-placeholder="Vị trí ứng tuyển"
                                onFocus={handleFieldFocus}
                                onBlur={(e) =>
                                    handleFieldBlur(e, () =>
                                        updateField(
                                            "title",
                                            e.currentTarget.textContent.trim(),
                                        ),
                                    )
                                }
                                className={`text-sm text-gray-600 block ${baseFieldClass}`}
                            >{cvData.title || ""}</div>
                        </div>

                        {/* Detail list rows */}
                        <div className="space-y-1 text-xs text-gray-800 pt-1.5">
                            <div className="flex items-center gap-2">
                                <span
                                    contentEditable
                                    suppressContentEditableWarning
                                    data-placeholder="Ngày sinh:"
                                    onFocus={handleFieldFocus}
                                    onBlur={(e) =>
                                        handleFieldBlur(e, () =>
                                            updateFieldLabel(
                                                "dob",
                                                e.currentTarget.textContent.trim(),
                                            ),
                                        )
                                    }
                                    className="font-bold w-24 shrink-0 outline-none cursor-text"
                                >
                                    {cvData.field_labels?.dob || "Ngày sinh:"}
                                </span>
                                <span
                                    contentEditable
                                    suppressContentEditableWarning
                                    data-placeholder="DD/MM/YYYY"
                                    onFocus={handleFieldFocus}
                                    onBlur={(e) =>
                                        handleFieldBlur(e, () =>
                                            updateField(
                                                "dob",
                                                e.currentTarget.textContent.trim(),
                                            ),
                                        )
                                    }
                                    className={baseFieldClass}
                                >{cvData.dob || ""}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span
                                    contentEditable
                                    suppressContentEditableWarning
                                    data-placeholder="Giới tính:"
                                    onFocus={handleFieldFocus}
                                    onBlur={(e) =>
                                        handleFieldBlur(e, () =>
                                            updateFieldLabel(
                                                "gender",
                                                e.currentTarget.textContent.trim(),
                                            ),
                                        )
                                    }
                                    className="font-bold w-24 shrink-0 outline-none cursor-text"
                                >
                                    {cvData.field_labels?.gender || "Giới tính:"}
                                </span>
                                <span
                                    contentEditable
                                    suppressContentEditableWarning
                                    data-placeholder="Nam/Nữ"
                                    onFocus={handleFieldFocus}
                                    onBlur={(e) =>
                                        handleFieldBlur(e, () =>
                                            updateField(
                                                "gender",
                                                e.currentTarget.textContent.trim(),
                                            ),
                                        )
                                    }
                                    className={baseFieldClass}
                                >{cvData.gender || ""}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span
                                    contentEditable
                                    suppressContentEditableWarning
                                    data-placeholder="Số điện thoại:"
                                    onFocus={handleFieldFocus}
                                    onBlur={(e) =>
                                        handleFieldBlur(e, () =>
                                            updateFieldLabel(
                                                "phone",
                                                e.currentTarget.textContent.trim(),
                                            ),
                                        )
                                    }
                                    className="font-bold w-24 shrink-0 outline-none cursor-text"
                                >
                                    {cvData.field_labels?.phone || "Số điện thoại:"}
                                </span>
                                <span
                                    contentEditable
                                    suppressContentEditableWarning
                                    data-placeholder="0123 456 789"
                                    onFocus={handleFieldFocus}
                                    onBlur={(e) =>
                                        handleFieldBlur(e, () =>
                                            updateField(
                                                "phone",
                                                e.currentTarget.textContent.trim(),
                                            ),
                                        )
                                    }
                                    className={`flex-1 font-mono text-gray-700 ${baseFieldClass}`}
                                >{cvData.phone || ""}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span
                                    contentEditable
                                    suppressContentEditableWarning
                                    data-placeholder="Email:"
                                    onFocus={handleFieldFocus}
                                    onBlur={(e) =>
                                        handleFieldBlur(e, () =>
                                            updateFieldLabel(
                                                "email",
                                                e.currentTarget.textContent.trim(),
                                            ),
                                        )
                                    }
                                    className="font-bold w-24 shrink-0 outline-none cursor-text"
                                >
                                    {cvData.field_labels?.email || "Email:"}
                                </span>
                                <span
                                    contentEditable
                                    suppressContentEditableWarning
                                    data-placeholder="example@gmail.com"
                                    onFocus={handleFieldFocus}
                                    onBlur={(e) =>
                                        handleFieldBlur(e, () =>
                                            updateField(
                                                "email",
                                                e.currentTarget.textContent.trim(),
                                            ),
                                        )
                                    }
                                    className={baseFieldClass}
                                >{cvData.email || ""}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span
                                    contentEditable
                                    suppressContentEditableWarning
                                    data-placeholder="Website:"
                                    onFocus={handleFieldFocus}
                                    onBlur={(e) =>
                                        handleFieldBlur(e, () =>
                                            updateFieldLabel(
                                                "website",
                                                e.currentTarget.textContent.trim(),
                                            ),
                                        )
                                    }
                                    className="font-bold w-24 shrink-0 outline-none cursor-text"
                                >
                                    {cvData.field_labels?.website || "Website:"}
                                </span>
                                <span
                                    contentEditable
                                    suppressContentEditableWarning
                                    data-placeholder="facebook.com/..."
                                    onFocus={handleFieldFocus}
                                    onBlur={(e) =>
                                        handleFieldBlur(e, () =>
                                            updateField(
                                                "website",
                                                e.currentTarget.textContent.trim(),
                                            ),
                                        )
                                    }
                                    className={`text-gray-600 ${baseFieldClass}`}
                                >{cvData.website || ""}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span
                                    contentEditable
                                    suppressContentEditableWarning
                                    data-placeholder="Địa chỉ:"
                                    onFocus={handleFieldFocus}
                                    onBlur={(e) =>
                                        handleFieldBlur(e, () =>
                                            updateFieldLabel(
                                                "address",
                                                e.currentTarget.textContent.trim(),
                                            ),
                                        )
                                    }
                                    className="font-bold w-24 shrink-0 outline-none cursor-text"
                                >
                                    {cvData.field_labels?.address || "Địa chỉ:"}
                                </span>
                                <span
                                    contentEditable
                                    suppressContentEditableWarning
                                    data-placeholder="Quận/Huyện, Tỉnh/Thành phố"
                                    onFocus={handleFieldFocus}
                                    onBlur={(e) =>
                                        handleFieldBlur(e, () =>
                                            updateField(
                                                "address",
                                                e.currentTarget.textContent.trim(),
                                            ),
                                        )
                                    }
                                    className={`flex-1 text-gray-700 ${baseFieldClass}`}
                                >{cvData.address || ""}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. MỤC TIÊU NGHỀ NGHIỆP */}
                <div className="space-y-2 group/section relative">
                    <div
                        className="pb-1 border-b-2 border-black flex items-center justify-between"
                        style={{ borderColor: themeColor }}
                    >
                        <h2
                            contentEditable
                            suppressContentEditableWarning
                            data-placeholder="MỤC TIÊU NGHỀ NGHIỆP"
                            onFocus={handleFieldFocus}
                            onBlur={(e) =>
                                handleFieldBlur(e, () =>
                                    updateSectionTitle(
                                        "career_goal",
                                        e.currentTarget.textContent.trim(),
                                    ),
                                )
                            }
                            className="font-bold text-sm tracking-wider uppercase text-black outline-none px-1 cursor-text"
                        >
                            {cvData.section_titles?.career_goal ||
                                "MỤC TIÊU NGHỀ NGHIỆP"}
                        </h2>
                    </div>

                    {getContentBlocks("summary", "summary_blocks").map((block, index) => (
                        <div className="group/item relative" key={`summary-${index}`}>
                            <div className="opacity-0 group-hover/item:opacity-100 group-focus-within/item:opacity-100 transition-opacity duration-150 bg-[#e4e6eb] p-1 rounded-md flex items-center gap-1.5 print:hidden select-none shadow-2xs absolute -top-3 right-0 z-10">
                                <button
                                    type="button"
                                    onClick={() => removeContentBlock("summary", "summary_blocks", index)}
                                    className="bg-[#ea4335] hover:bg-[#d93025] text-white text-xs font-bold px-2.5 py-1 rounded cursor-pointer transition shadow-2xs leading-none"
                                    title="Xóa nội dung mục tiêu"
                                >
                                    Xóa
                                </button>
                                <button
                                    type="button"
                                    onClick={() => addContentBlock("summary", "summary_blocks")}
                                    className="bg-primary hover:bg-primary/90 text-white text-xs font-bold px-2.5 py-1 rounded cursor-pointer transition shadow-2xs flex items-center gap-0.5 leading-none"
                                    title="Thêm một ô mục tiêu mới"
                                >
                                    + Thêm
                                </button>
                            </div>

                            <div
                                contentEditable
                                suppressContentEditableWarning
                                data-placeholder="Mục tiêu nghề nghiệp của bạn, bao gồm mục tiêu ngắn hạn và dài hạn..."
                                onFocus={handleFieldFocus}
                                onBlur={(e) =>
                                    handleFieldBlur(e, () =>
                                        updateContentBlock(
                                            "summary",
                                            "summary_blocks",
                                            index,
                                            e.currentTarget.innerHTML,
                                        ),
                                    )
                                }
                                dangerouslySetInnerHTML={{ __html: block || "" }}
                                className={`min-h-[44px] block w-full text-xs leading-relaxed ${baseFieldClass}`}
                            />
                        </div>
                    ))}
                </div>

                {/* 3. HỌC VẤN */}
                <div className="space-y-3 group/section relative">
                    <div
                        className="pb-1 border-b-2 border-black flex items-center justify-between"
                        style={{ borderColor: themeColor }}
                    >
                        <h2
                            contentEditable
                            suppressContentEditableWarning
                            data-placeholder="HỌC VẤN"
                            onFocus={handleFieldFocus}
                            onBlur={(e) =>
                                handleFieldBlur(e, () =>
                                    updateSectionTitle(
                                        "education",
                                        e.currentTarget.textContent.trim(),
                                    ),
                                )
                            }
                            className="font-bold text-sm tracking-wider uppercase text-black outline-none px-1 cursor-text"
                        >
                            {cvData.section_titles?.education || "HỌC VẤN"}
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {cvData.education.map((edu, idx) => (
                            <div
                                key={idx}
                                className="grid grid-cols-12 gap-6 relative group/item text-xs pt-1.5"
                            >
                                {/* TopCV Item Action Toolbar: Xóa & + Thêm khi hover hoặc focus-within item này */}
                                <div className="opacity-0 group-hover/item:opacity-100 group-focus-within/item:opacity-100 transition-opacity duration-150 bg-[#e4e6eb] p-1 rounded-md flex items-center gap-1.5 print:hidden select-none shadow-2xs absolute -top-3 right-0 z-10">
                                    <button
                                        type="button"
                                        onClick={() => removeEducation(idx)}
                                        className="bg-[#ea4335] hover:bg-[#d93025] text-white text-xs font-bold px-2.5 py-1 rounded cursor-pointer transition shadow-2xs leading-none"
                                        title="Xóa mục học vấn này"
                                    >
                                        Xóa
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => addEducation(idx)}
                                        className="bg-primary hover:bg-primary/90 text-white text-xs font-bold px-2.5 py-1 rounded cursor-pointer transition shadow-2xs flex items-center gap-0.5 leading-none"
                                        title="Thêm mục học vấn mới"
                                    >
                                        + Thêm
                                    </button>
                                </div>

                                {/* Left: Duration */}
                                <div className="col-span-3 text-gray-600 font-medium">
                                    <div
                                        contentEditable
                                        suppressContentEditableWarning
                                        data-placeholder="Bắt đầu - Kết thúc"
                                        onFocus={handleFieldFocus}
                                        onBlur={(e) =>
                                            handleFieldBlur(e, () => {
                                                const parts =
                                                    e.currentTarget.textContent.split(
                                                        "-",
                                                    );
                                                updateEducation(
                                                    idx,
                                                    "start_date",
                                                    parts[0]?.trim() || "",
                                                );
                                                updateEducation(
                                                    idx,
                                                    "end_date",
                                                    parts[1]?.trim() || "",
                                                );
                                            })
                                        }
                                        className={baseFieldClass}
                                    >{(edu.start_date || edu.end_date) ? `${edu.start_date || ""} - ${edu.end_date || ""}` : ""}</div>
                                </div>

                                {/* Right: Details */}
                                <div className="col-span-9 space-y-0.5">
                                    <div
                                        contentEditable
                                        suppressContentEditableWarning
                                        data-placeholder="Tên trường học"
                                        onFocus={handleFieldFocus}
                                        onBlur={(e) =>
                                            handleFieldBlur(e, () =>
                                                updateEducation(
                                                    idx,
                                                    "school",
                                                    e.currentTarget.textContent.trim(),
                                                ),
                                            )
                                        }
                                        className={`font-bold text-gray-900 block ${baseFieldClass}`}
                                    >{edu.school || ""}</div>
                                    <div
                                        contentEditable
                                        suppressContentEditableWarning
                                        data-placeholder="Ngành học / Môn học"
                                        onFocus={handleFieldFocus}
                                        onBlur={(e) =>
                                            handleFieldBlur(e, () =>
                                                updateEducation(
                                                    idx,
                                                    "major",
                                                    e.currentTarget.textContent.trim(),
                                                ),
                                            )
                                        }
                                        className={`text-gray-700 block ${baseFieldClass}`}
                                    >{edu.major || ""}</div>
                                    <div
                                        contentEditable
                                        suppressContentEditableWarning
                                        data-placeholder="Mô tả quá trình học tập hoặc thành tích của bạn"
                                        onFocus={handleFieldFocus}
                                        onBlur={(e) =>
                                            handleFieldBlur(e, () =>
                                                updateEducation(
                                                    idx,
                                                    "grade",
                                                    e.currentTarget.textContent.trim(),
                                                ),
                                            )
                                        }
                                        className={`text-gray-500 italic block ${baseFieldClass}`}
                                    >{edu.grade || ""}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. KINH NGHIỆM LÀM VIỆC */}
                <div className="space-y-3 group/section relative">
                    <div
                        className="pb-1 border-b-2 border-black flex items-center justify-between"
                        style={{ borderColor: themeColor }}
                    >
                        <h2
                            contentEditable
                            suppressContentEditableWarning
                            data-placeholder="KINH NGHIỆM LÀM VIỆC"
                            onFocus={handleFieldFocus}
                            onBlur={(e) =>
                                handleFieldBlur(e, () =>
                                    updateSectionTitle(
                                        "experience",
                                        e.currentTarget.textContent.trim(),
                                    ),
                                )
                            }
                            className="font-bold text-sm tracking-wider uppercase text-black outline-none px-1 cursor-text"
                        >
                            {cvData.section_titles?.experience ||
                                "KINH NGHIỆM LÀM VIỆC"}
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {cvData.experience.map((exp, idx) => (
                            <div
                                key={idx}
                                className="grid grid-cols-12 gap-6 relative group/item text-xs pt-1.5"
                            >
                                {/* TopCV Item Action Toolbar: Xóa & + Thêm khi hover hoặc focus-within item này */}
                                <div className="opacity-0 group-hover/item:opacity-100 group-focus-within/item:opacity-100 transition-opacity duration-150 bg-[#e4e6eb] p-1 rounded-md flex items-center gap-1.5 print:hidden select-none shadow-2xs absolute -top-3 right-0 z-10">
                                    <button
                                        type="button"
                                        onClick={() => removeExperience(idx)}
                                        className="bg-[#ea4335] hover:bg-[#d93025] text-white text-xs font-bold px-2.5 py-1 rounded cursor-pointer transition shadow-2xs leading-none"
                                        title="Xóa kinh nghiệm này"
                                    >
                                        Xóa
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => addExperience(idx)}
                                        className="bg-primary hover:bg-primary/90 text-white text-xs font-bold px-2.5 py-1 rounded cursor-pointer transition shadow-2xs flex items-center gap-0.5 leading-none"
                                        title="Thêm kinh nghiệm mới"
                                    >
                                        + Thêm
                                    </button>
                                </div>

                                {/* Left: Duration */}
                                <div className="col-span-3 text-gray-600 font-medium">
                                    <div
                                        contentEditable
                                        suppressContentEditableWarning
                                        data-placeholder="Bắt đầu - Kết thúc"
                                        onFocus={handleFieldFocus}
                                        onBlur={(e) =>
                                            handleFieldBlur(e, () =>
                                                updateExperience(
                                                    idx,
                                                    "duration",
                                                    e.currentTarget.textContent.trim(),
                                                ),
                                            )
                                        }
                                        className={baseFieldClass}
                                    >{exp.duration || ""}</div>
                                </div>

                                {/* Right: Company, Position, Description */}
                                <div className="col-span-9 space-y-1">
                                    <div
                                        contentEditable
                                        suppressContentEditableWarning
                                        data-placeholder="Tên công ty"
                                        onFocus={handleFieldFocus}
                                        onBlur={(e) =>
                                            handleFieldBlur(e, () =>
                                                updateExperience(
                                                    idx,
                                                    "company",
                                                    e.currentTarget.textContent.trim(),
                                                ),
                                            )
                                        }
                                        className={`font-bold text-gray-900 block uppercase ${baseFieldClass}`}
                                    >{exp.company || ""}</div>
                                    <div
                                        contentEditable
                                        suppressContentEditableWarning
                                        data-placeholder="Vị trí công việc"
                                        onFocus={handleFieldFocus}
                                        onBlur={(e) =>
                                            handleFieldBlur(e, () =>
                                                updateExperience(
                                                    idx,
                                                    "position",
                                                    e.currentTarget.textContent.trim(),
                                                ),
                                            )
                                        }
                                        className={`text-gray-700 italic block ${baseFieldClass}`}
                                    >{exp.position || ""}</div>

                                    <div
                                        contentEditable
                                        suppressContentEditableWarning
                                        data-placeholder="Mô tả công việc, trách nhiệm và thành tích đạt được..."
                                        onFocus={handleFieldFocus}
                                        onBlur={(e) =>
                                            handleFieldBlur(e, () =>
                                                updateExperience(
                                                    idx,
                                                    "description",
                                                    e.currentTarget.innerHTML,
                                                ),
                                            )
                                        }
                                        dangerouslySetInnerHTML={{
                                            __html: exp.description || "",
                                        }}
                                        className={`cv-rich-content block w-full min-h-[30px] ${baseFieldClass}`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 5. HOẠT ĐỘNG */}
                <div className="space-y-3 group/section relative">
                    <div
                        className="pb-1 border-b-2 border-black flex items-center justify-between"
                        style={{ borderColor: themeColor }}
                    >
                        <h2
                            contentEditable
                            suppressContentEditableWarning
                            data-placeholder="HOẠT ĐỘNG"
                            onFocus={handleFieldFocus}
                            onBlur={(e) =>
                                handleFieldBlur(e, () =>
                                    updateSectionTitle(
                                        "activities",
                                        e.currentTarget.textContent.trim(),
                                    ),
                                )
                            }
                            className="font-bold text-sm tracking-wider uppercase text-black outline-none px-1 cursor-text"
                        >
                            {cvData.section_titles?.activities || "HOẠT ĐỘNG"}
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {activitiesList.map((act, idx) => (
                            <div
                                key={idx}
                                className="grid grid-cols-12 gap-6 relative group/item text-xs pt-1.5"
                            >
                                {/* TopCV Item Action Toolbar: Xóa & + Thêm khi hover hoặc focus-within item này */}
                                <div className="opacity-0 group-hover/item:opacity-100 group-focus-within/item:opacity-100 transition-opacity duration-150 bg-[#e4e6eb] p-1 rounded-md flex items-center gap-1.5 print:hidden select-none shadow-2xs absolute -top-3 right-0 z-10">
                                    <button
                                        type="button"
                                        onClick={() => removeActivity(idx)}
                                        className="bg-[#ea4335] hover:bg-[#d93025] text-white text-xs font-bold px-2.5 py-1 rounded cursor-pointer transition shadow-2xs leading-none"
                                        title="Xóa hoạt động này"
                                    >
                                        Xóa
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => addActivity(idx)}
                                        className="bg-primary hover:bg-primary/90 text-white text-xs font-bold px-2.5 py-1 rounded cursor-pointer transition shadow-2xs flex items-center gap-0.5 leading-none"
                                        title="Thêm hoạt động mới"
                                    >
                                        + Thêm
                                    </button>
                                </div>

                                <div className="col-span-3 text-gray-600 font-medium">
                                    <div
                                        contentEditable
                                        suppressContentEditableWarning
                                        data-placeholder="Bắt đầu - Kết thúc"
                                        onFocus={handleFieldFocus}
                                        onBlur={(e) =>
                                            handleFieldBlur(e, () =>
                                                updateActivity(
                                                    idx,
                                                    "duration",
                                                    e.currentTarget.textContent.trim(),
                                                ),
                                            )
                                        }
                                        className={baseFieldClass}
                                    >{act.duration || ""}</div>
                                </div>
                                <div className="col-span-9 space-y-0.5">
                                    <div
                                        contentEditable
                                        suppressContentEditableWarning
                                        data-placeholder="Tên tổ chức / Tình nguyện"
                                        onFocus={handleFieldFocus}
                                        onBlur={(e) =>
                                            handleFieldBlur(e, () =>
                                                updateActivity(
                                                    idx,
                                                    "organization",
                                                    e.currentTarget.textContent.trim(),
                                                ),
                                            )
                                        }
                                        className={`font-bold text-gray-900 block ${baseFieldClass}`}
                                    >{act.organization || ""}</div>
                                    <div
                                        contentEditable
                                        suppressContentEditableWarning
                                        data-placeholder="Vị trí tham gia và mô tả đóng góp..."
                                        onFocus={handleFieldFocus}
                                        onBlur={(e) =>
                                            handleFieldBlur(e, () =>
                                                updateActivity(
                                                    idx,
                                                    "role",
                                                    e.currentTarget.textContent.trim(),
                                                ),
                                            )
                                        }
                                        className={`text-gray-600 block ${baseFieldClass}`}
                                    >{act.role || ""}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 6. KỸ NĂNG */}
                <div className="space-y-2 group/section relative">
                    <div
                        className="pb-1 border-b-2 border-black flex items-center justify-between"
                        style={{ borderColor: themeColor }}
                    >
                        <h2
                            contentEditable
                            suppressContentEditableWarning
                            data-placeholder="KỸ NĂNG"
                            onFocus={handleFieldFocus}
                            onBlur={(e) =>
                                handleFieldBlur(e, () =>
                                    updateSectionTitle(
                                        "skills",
                                        e.currentTarget.textContent.trim(),
                                    ),
                                )
                            }
                            className="font-bold text-sm tracking-wider uppercase text-black outline-none px-1 cursor-text"
                        >
                            {cvData.section_titles?.skills || "KỸ NĂNG"}
                        </h2>
                    </div>

                    {getContentBlocks("skills", "skills_blocks").map((block, index) => (
                        <div className="group/item relative" key={`skills-${index}`}>
                            <div className="opacity-0 group-hover/item:opacity-100 group-focus-within/item:opacity-100 transition-opacity duration-150 bg-[#e4e6eb] p-1 rounded-md flex items-center gap-1.5 print:hidden select-none shadow-2xs absolute -top-3 right-0 z-10">
                                <button
                                    type="button"
                                    onClick={() => removeContentBlock("skills", "skills_blocks", index)}
                                    className="bg-[#ea4335] hover:bg-[#d93025] text-white text-xs font-bold px-2.5 py-1 rounded cursor-pointer transition shadow-2xs leading-none"
                                    title="Xóa nội dung kỹ năng"
                                >
                                    Xóa
                                </button>
                                <button
                                    type="button"
                                    onClick={() => addContentBlock("skills", "skills_blocks")}
                                    className="bg-primary hover:bg-primary/90 text-white text-xs font-bold px-2.5 py-1 rounded cursor-pointer transition shadow-2xs flex items-center gap-0.5 leading-none"
                                    title="Thêm một ô kỹ năng mới"
                                >
                                    + Thêm
                                </button>
                            </div>

                            <div
                                contentEditable
                                suppressContentEditableWarning
                                data-placeholder="Liệt kê các kỹ năng chuyên môn, kỹ năng mềm, ngoại ngữ hoặc chứng chỉ của bạn..."
                                onFocus={handleFieldFocus}
                                onBlur={(e) =>
                                    handleFieldBlur(e, () =>
                                        updateContentBlock(
                                            "skills",
                                            "skills_blocks",
                                            index,
                                            e.currentTarget.innerHTML,
                                        ),
                                    )
                                }
                                dangerouslySetInnerHTML={{ __html: block || "" }}
                                className={`min-h-[50px] block w-full text-xs leading-relaxed cv-rich-content ${baseFieldClass}`}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
