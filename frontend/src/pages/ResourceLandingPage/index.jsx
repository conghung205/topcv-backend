import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, BookOpen, Briefcase, CheckCircle2, Clock3, MessageCircle, Search, Target } from "lucide-react";

const CONTENT = {
    interview: {
        title: "Bộ câu hỏi phỏng vấn xin việc",
        description: "Tổng hợp các câu hỏi thường gặp và cách trả lời ấn tượng giúp bạn tự tin hơn trước nhà tuyển dụng.",
        heroClass: "bg-[linear-gradient(180deg,#002b33,rgba(0,43,51,.25)),linear-gradient(90deg,#008060_21.86%,#2bab60_78.13%)]",
        icon: MessageCircle,
        searchPlaceholder: "Tìm theo tên vị trí, việc làm",
        popular: ["Nhân viên kế toán", "Frontend Developer", "Nhân viên Hành chính nhân sự", "Tester"],
        sections: [
            { id: "question-bank", title: "Các câu hỏi phỏng vấn thường gặp", icon: MessageCircle, text: "Những câu hỏi nền tảng về bản thân, kinh nghiệm, điểm mạnh và mục tiêu nghề nghiệp.", points: ["Hãy giới thiệu về bản thân bạn?", "Mục tiêu nghề nghiệp của bạn là gì?", "Điểm mạnh và điểm cần cải thiện của bạn là gì?", "Vì sao bạn phù hợp với vị trí này?"] },
            { id: "experience", title: "Câu hỏi về kinh nghiệm làm việc", icon: Briefcase, text: "Cách trình bày kinh nghiệm theo hướng tập trung vào vai trò, hành động và kết quả.", points: ["Chia sẻ về một thành tích nổi bật.", "Bạn từng xử lý một vấn đề khó như thế nào?", "Bạn đã phối hợp với đội nhóm ra sao?"] },
            { id: "situational", title: "Câu hỏi tình huống", icon: Target, text: "Luyện cách trả lời các tình huống thực tế bằng cấu trúc rõ ràng, ngắn gọn và có dẫn chứng.", points: ["Mô tả bối cảnh và vấn đề.", "Nêu hành động cụ thể bạn đã thực hiện.", "Kết thúc bằng kết quả và bài học."] },
            { id: "questions-for-hr", title: "Câu hỏi nên hỏi nhà tuyển dụng", icon: BookOpen, text: "Một số câu hỏi ngược giúp bạn hiểu rõ công việc và thể hiện sự chủ động.", points: ["Mục tiêu của vị trí trong 3 tháng đầu là gì?", "Đội nhóm đang làm việc theo cách nào?", "Tiêu chí đánh giá hiệu quả công việc ra sao?"] },
            { id: "interview-checklist", title: "Checklist trước buổi phỏng vấn", icon: CheckCircle2, text: "Chuẩn bị đầy đủ giúp bạn giảm áp lực và thể hiện tác phong chuyên nghiệp.", points: ["Đọc kỹ JD và tìm hiểu doanh nghiệp.", "Chuẩn bị CV, portfolio và câu hỏi ngược.", "Kiểm tra địa điểm hoặc thiết bị phỏng vấn online."] },
        ],
        sidebar: ["Mẫu email xác nhận phỏng vấn", "Thư cảm ơn sau phỏng vấn", "Câu hỏi phỏng vấn thực tập sinh", "Kỹ năng phỏng vấn online", "Câu hỏi phỏng vấn tiếng Anh"],
    },
    jobSearch: {
        title: "Bí kíp tìm việc",
        description: "Nơi cập nhật thông tin giúp bạn trang bị kỹ năng và kinh nghiệm cần thiết để tìm được công việc phù hợp.",
        heroClass: "bg-[linear-gradient(180deg,#002b33,rgba(0,43,51,.25)),linear-gradient(90deg,#008060_21.86%,#2bab60_78.13%)]",
        icon: Search,
        searchPlaceholder: "Tìm kiếm chủ đề, kỹ năng, vị trí",
        popular: ["Định hướng nghề nghiệp", "Chế độ lương thưởng", "Kiến thức chuyên ngành", "Hành trang nghề nghiệp", "Thị trường tuyển dụng"],
        sections: [
            { id: "job-search", title: "Tìm việc đúng cách", icon: Search, text: "Xác định mục tiêu, chọn từ khóa phù hợp và dùng bộ lọc để không bỏ lỡ cơ hội tốt.", points: ["Xác định vị trí và địa điểm mong muốn.", "Tìm kiếm bằng từ khóa cụ thể.", "Lưu lại những công việc phù hợp để theo dõi."] },
            { id: "career-preparation", title: "Chuẩn bị hành trang nghề nghiệp", icon: Briefcase, text: "Một hồ sơ rõ ràng và thông tin nhất quán giúp nhà tuyển dụng hiểu nhanh giá trị của bạn.", points: ["Cập nhật CV theo từng nhóm công việc.", "Chuẩn bị portfolio hoặc dự án tiêu biểu.", "Kiểm tra thông tin liên hệ trước khi gửi."] },
            { id: "application", title: "Tối ưu quá trình ứng tuyển", icon: Target, text: "Chủ động theo dõi từng hồ sơ, chuẩn bị phỏng vấn và phản hồi đúng thời điểm.", points: ["Đọc kỹ yêu cầu trước khi ứng tuyển.", "Ghi chú ngày nộp và trạng thái hồ sơ.", "Chuẩn bị câu chuyện thành tích ngắn gọn."] },
            { id: "workplace", title: "Kiến thức nơi làm việc", icon: BookOpen, text: "Hiểu về lương thưởng, văn hóa doanh nghiệp và quyền lợi giúp bạn đưa ra lựa chọn phù hợp.", points: ["Tìm hiểu cách tính lương và phúc lợi.", "Đặt câu hỏi về môi trường làm việc.", "Đánh giá cơ hội học hỏi và phát triển."] },
            { id: "job-tracking", title: "Theo dõi và cải thiện", icon: CheckCircle2, text: "Mỗi lần ứng tuyển là một lần học hỏi để hồ sơ và cách phỏng vấn tốt hơn.", points: ["Ghi lại phản hồi sau mỗi lần phỏng vấn.", "Cập nhật CV khi có thêm kỹ năng.", "Đặt mục tiêu tìm việc theo tuần."] },
        ],
        sidebar: ["Cách viết CV theo từng vị trí", "Mẫu email xin việc", "Kỹ năng tìm việc online", "Cách deal lương khi nhận offer", "Những lỗi thường gặp khi ứng tuyển"],
    },
};

const ANSWERS = {
    "Hãy giới thiệu về bản thân bạn?": "Hãy trả lời trong 60–90 giây theo trình tự hiện tại, kinh nghiệm nổi bật và lý do bạn quan tâm vị trí. Tập trung vào thông tin liên quan đến công việc.",
    "Mục tiêu nghề nghiệp của bạn là gì?": "Nêu mục tiêu trong 1–3 năm, gắn với kỹ năng muốn phát triển và giá trị bạn có thể tạo ra cho đội nhóm.",
    "Điểm mạnh và điểm cần cải thiện của bạn là gì?": "Chọn một điểm mạnh có ví dụ cụ thể và một điểm cần cải thiện kèm kế hoạch đang thực hiện.",
    "Vì sao bạn phù hợp với vị trí này?": "Đối chiếu 2–3 yêu cầu trong JD với kinh nghiệm, kỹ năng và kết quả cụ thể của bạn.",
    "Chia sẻ về một thành tích nổi bật.": "Chọn thành tích gần với vị trí ứng tuyển, nói rõ bạn đã làm gì và kết quả đo được. Có thể dùng công thức STAR.",
    "Bạn từng xử lý một vấn đề khó như thế nào?": "Mô tả vấn đề, hành động bạn trực tiếp thực hiện, kết quả và bài học sau cùng.",
    "Bạn đã phối hợp với đội nhóm ra sao?": "Nêu vai trò, cách trao đổi thông tin và cách xử lý khác biệt quan điểm qua một tình huống thật.",
    "Mô tả bối cảnh và vấn đề.": "Nói ngắn gọn ai, việc gì, trong hoàn cảnh nào và vấn đề cần giải quyết; không kể lan man.",
    "Nêu hành động cụ thể bạn đã thực hiện.": "Tập trung vào phần việc bạn trực tiếp làm, cách bạn ưu tiên và phối hợp với những người liên quan.",
    "Kết thúc bằng kết quả và bài học.": "Nêu kết quả bằng số liệu hoặc thay đổi rõ ràng, sau đó chia sẻ cách áp dụng bài học cho lần sau.",
    "Mục tiêu của vị trí trong 3 tháng đầu là gì?": "Câu hỏi này giúp bạn hiểu kỳ vọng ban đầu, ưu tiên cần làm và cách chuẩn bị nếu được nhận.",
    "Đội nhóm đang làm việc theo cách nào?": "Bạn sẽ hiểu thêm về người quản lý, cách giao việc, công cụ phối hợp và nhịp làm việc thực tế.",
    "Tiêu chí đánh giá hiệu quả công việc ra sao?": "Biết trước tiêu chí đánh giá giúp bạn xác định kết quả cần tạo ra và chủ động hơn khi bắt đầu.",
    "Đọc kỹ JD và tìm hiểu doanh nghiệp.": "Ghi lại các yêu cầu chính, sản phẩm, khách hàng và câu hỏi cho thấy bạn đã tìm hiểu công ty.",
    "Chuẩn bị CV, portfolio và câu hỏi ngược.": "Chọn 2–3 ví dụ có số liệu hoặc kết quả để minh họa cho kỹ năng phù hợp với vị trí.",
    "Kiểm tra địa điểm hoặc thiết bị phỏng vấn online.": "Đến sớm 10–15 phút; phỏng vấn online thì kiểm tra camera, micro, đường truyền và không gian phía sau.",
};

export default function ResourceLandingPage({ topic = "interview" }) {
    const location = useLocation();
    const isInitialRender = useRef(true);
    const content = CONTENT[topic] || CONTENT.interview;
    const Icon = content.icon;
    const isInterview = topic === "interview";

    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false;
            window.scrollTo({ top: 0, behavior: "auto" });
            return;
        }

        const hash = location.hash.replace("#", "");
        if (hash) requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" }));
        else window.scrollTo({ top: 0, behavior: "auto" });
    }, [location.pathname, location.hash]);

    return (
        <main className="min-h-screen bg-[#f4f7f8] text-[#203b55]">
            <section className={`${content.heroClass} relative overflow-hidden text-white`}>
                <div className="pointer-events-none absolute -right-24 top-0 size-72 rounded-full bg-emerald-300/15 blur-3xl" />
                <div className="pointer-events-none absolute -left-20 bottom-0 size-64 rounded-full bg-teal-300/10 blur-3xl" />
                <div className="relative mx-auto max-w-[1200px] px-6 py-9 md:py-12">
                    <div className="relative z-10 max-w-[1000px]">
                        <div className="mb-5 text-sm font-medium text-white/90"><Link to="/" className="hover:underline">Trang chủ</Link><span className="mx-2">›</span>{content.title}</div>
                        <h1 className="max-w-[920px] text-3xl font-black leading-tight md:text-[42px]">{content.title}</h1>
                        <p className="mt-3 max-w-[900px] text-sm leading-6 text-emerald-50 md:text-base">{content.description}</p>
                        <div className="mt-5 flex max-w-[700px] items-center overflow-hidden rounded-xl bg-white p-1 shadow-lg"><Search className="ml-3 size-5 shrink-0 text-gray-400" /><input className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-gray-800 outline-none" placeholder={content.searchPlaceholder} /><button type="button" className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition hover:bg-primary/90">Tra cứu</button></div>
                        <p className="mt-5 text-sm font-bold">{isInterview ? "Vị trí phổ biến" : "Chủ đề phổ biến"}</p>
                        <div className="mt-2 flex flex-wrap gap-2">{content.popular.map((item) => <a key={item} href="#guide" className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-[#203b55] transition hover:bg-white">{item}</a>)}</div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-[1200px] px-6 py-6">
                <div className="mb-5 flex flex-wrap gap-1.5 rounded-lg border border-border bg-white p-1.5 shadow-xs"><a href="#overview" className="rounded-md px-2.5 py-1.5 text-sm font-semibold text-primary hover:bg-emerald-50">Tổng quan</a>{content.sections.map((section) => <a key={section.id} href={`#${section.id}`} className="rounded-md px-2.5 py-1.5 text-sm font-medium text-gray-600 hover:bg-emerald-50 hover:text-primary">{section.title}</a>)}</div>
                <div id="guide" className="grid scroll-mt-24 gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
                    <div className="space-y-4">
                        <div id="overview" className="rounded-lg border border-border bg-white p-5 shadow-xs"><div className="mb-2 flex items-center gap-2 text-primary"><Icon className="size-5" /><span className="text-xs font-bold uppercase tracking-wider">Nội dung hướng dẫn</span></div><h2 className="text-2xl font-black text-[#203b55]">{isInterview ? "Các câu hỏi phỏng vấn thường gặp và cách trả lời ấn tượng" : "Bí kíp tìm việc giúp bạn chủ động hơn mỗi ngày"}</h2><p className="mt-2 text-sm leading-6 text-gray-600">Các nội dung dưới đây được sắp xếp theo từng bước để bạn dễ đọc, dễ ghi chú và áp dụng ngay.</p></div>
                        {content.sections.map((section, index) => { const SectionIcon = section.icon; return <article id={section.id} key={section.id} className="scroll-mt-24 rounded-lg border border-border bg-white p-5 shadow-xs"><div className="flex items-start gap-3"><div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-primary"><SectionIcon className="size-5" /></div><div><p className="text-xs font-bold uppercase tracking-wider text-primary">Phần {index + 1}</p><h3 className="mt-0.5 text-xl font-bold text-[#203b55]">{section.title}</h3><p className="mt-1.5 text-sm leading-6 text-gray-600">{section.text}</p></div></div><div className="mt-4 divide-y divide-[#e1e1e1] border-t border-border">{section.points.map((point) => <div key={point} className="py-3"><h4 className="text-sm font-bold text-[#203b55]">{point}</h4><p className="mt-1 text-sm leading-6 text-gray-600"><span className="font-semibold text-primary">Gợi ý: </span>{ANSWERS[point] || "Hãy chuẩn bị một ví dụ cụ thể, trình bày ngắn gọn theo bối cảnh – hành động – kết quả và liên hệ với vị trí đang ứng tuyển."}</p></div>)}</div></article>; })}
                    </div>
                    <aside className="h-fit rounded-lg border border-border bg-white p-4 shadow-xs lg:sticky lg:top-24"><h2 className="text-lg font-bold text-[#203b55]">{isInterview ? "Hành trang phỏng vấn" : "Hành trang tìm việc"}</h2><div className="mt-3 space-y-2.5">{content.sidebar.map((item) => <a key={item} href="#guide" className="flex items-center gap-2 text-sm text-gray-700 transition hover:text-primary"><ArrowRight className="size-4 text-primary" />{item}</a>)}</div><div className="mt-5 border-t border-border pt-3 text-xs leading-5 text-gray-500"><Clock3 className="mb-1.5 size-4 text-primary" />Cập nhật nội dung thường xuyên để đồng hành cùng bạn.</div></aside>
                </div>
            </section>
        </main>
    );
}
