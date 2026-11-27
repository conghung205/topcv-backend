# TopCV Frontend

Ứng dụng frontend cho nền tảng tuyển dụng TopCV, được xây dựng với React và Vite. Dự án mô phỏng một hệ sinh thái tuyển dụng hiện đại, phục vụ hai nhóm người dùng chính: ứng viên tìm việc và nhà tuyển dụng đăng tin.

## Tổng quan dự án

TopCV Frontend cung cấp giao diện responsive cho toàn bộ hành trình tìm việc và tuyển dụng:

- Khám phá việc làm theo từ khóa, địa điểm, ngành nghề và các tiêu chí lọc.
- Xem danh sách việc làm, chi tiết công việc và thông tin công ty.
- Đăng nhập, đăng ký và quản lý phiên đăng nhập cho ứng viên.
- Lưu việc làm, ứng tuyển và quản lý CV cá nhân.
- Tạo và chỉnh sửa CV trực tiếp trên giao diện kéo thả nội dung.
- Đăng ký, đăng nhập và quản lý hoạt động tuyển dụng cho nhà tuyển dụng.
- Tạo, xem trước và đăng tin tuyển dụng.
- Hiển thị các trang nội dung hỗ trợ như bí quyết tìm việc và bộ câu hỏi phỏng vấn.

## Điểm nổi bật

### Trải nghiệm tìm việc

- Trang chủ có banner carousel, nhóm ngành nghề phổ biến và thương hiệu tuyển dụng nổi bật.
- Tìm kiếm việc làm với URL thân thiện và hỗ trợ các slug tiếng Việt.
- Bộ lọc việc làm theo nhiều tiêu chí với trạng thái được đồng bộ trên giao diện.
- Hiển thị loading state, empty state và thông báo thao tác bằng toast.
- Job card tái sử dụng cho nhiều màn hình danh sách việc làm.

### Xác thực và phân quyền giao diện

- Tách riêng luồng xác thực ứng viên và nhà tuyển dụng.
- Form đăng nhập/đăng ký có validation theo schema.
- Quản lý trạng thái đăng nhập bằng Zustand.
- Tự động gắn bearer token vào request thông qua Axios interceptor.
- Điều hướng người dùng theo trạng thái xác thực và vai trò.

### CV Builder

- Giao diện xây dựng CV trực tiếp với template chuẩn TopCV.
- Chỉnh sửa nội dung CV theo từng khu vực.
- Toolbar định dạng văn bản và bảng điều khiển tùy chỉnh thiết kế.
- Hỗ trợ thay đổi màu sắc, kiểu chữ và khoảng cách hiển thị.
- Tách các thành phần CV thành các component độc lập để dễ mở rộng template.

### Cổng nhà tuyển dụng

- Landing page giới thiệu giải pháp tuyển dụng.
- Dashboard cho hoạt động quản lý tin tuyển dụng.
- Form đăng tin có các trường dữ liệu chuyên biệt và trình soạn thảo CKEditor.
- Job preview modal giúp kiểm tra nội dung trước khi đăng.
- Các section riêng cho tính năng, bảng giá, số liệu và testimonial.

## Công nghệ sử dụng

| Nhóm             | Công nghệ                            |
| ---------------- | ------------------------------------ |
| UI framework     | React 19, Vite                       |
| Routing          | React Router                         |
| Styling          | Tailwind CSS 4, custom design tokens |
| Server state     | TanStack React Query                 |
| Client state     | Zustand                              |
| Form             | React Hook Form, Zod                 |
| HTTP client      | Axios                                |
| Rich text editor | CKEditor 5                           |
| UI primitives    | Base UI, shadcn-style components     |
| Icons            | Lucide React                         |
| Carousel         | Swiper                               |
| Code quality     | ESLint                               |

## Kiến trúc thư mục

```text
src/
├── assets/         # Hình ảnh, banner và tài nguyên frontend
├── components/     # Component dùng chung và component theo feature
│   ├── Auth/       # Layout và field cho xác thực
│   ├── CVBuilder/  # Các thành phần xây dựng CV
│   ├── Employer/   # Giao diện dành cho nhà tuyển dụng
│   ├── Header/     # Header desktop/mobile
│   ├── Home/       # Các section của trang chủ
│   └── ui/         # Button, modal, select, toast và UI primitive
├── constants/      # Menu, filter, label và dữ liệu tĩnh
├── hooks/          # Custom hooks và React Query hooks
├── lib/            # Helper dùng chung như cn()
├── pages/          # Thành phần cấp route/page
├── providers/      # Context và provider cấp ứng dụng
├── schemas/        # Schema validation bằng Zod
├── services/       # API service theo từng domain
├── stores/         # Global state bằng Zustand
└── utils/          # Axios client và các hàm format dữ liệu
```

## Nguyên tắc tổ chức frontend

- Tách page-level component khỏi component tái sử dụng.
- Gom logic gọi dữ liệu vào `services` và `hooks`, hạn chế gọi API trực tiếp trong UI primitive.
- Sử dụng React Query cho cache, loading state, mutation và invalidation.
- Sử dụng Zustand cho trạng thái phiên đăng nhập và thông tin người dùng.
- Tách validation schema khỏi component form để dễ kiểm thử và tái sử dụng.
- Chuẩn hóa UI primitive trong `components/ui`.
- Sử dụng alias `@` trỏ tới thư mục `src` để giảm import tương đối sâu.
- Quản lý hình ảnh bằng ES module import từ `src/assets` để Vite xử lý hash và tối ưu asset khi build.

## Thiết kế giao diện

- Responsive cho desktop, tablet và mobile.
- Thiết kế dựa trên hệ màu semantic và design token trong `src/index.css`.
- Tái sử dụng button, modal, select, badge, sheet và toast trên nhiều màn hình.
- Hỗ trợ trạng thái hover, focus, loading, validation error và empty state.
- Sử dụng carousel cho banner và khu vực thương hiệu tuyển dụng.

## Cài đặt và chạy dự án

Yêu cầu Node.js 20 trở lên.

```bash
npm install
npm run dev
```

Frontend mặc định chạy tại:

```text
http://localhost:5173
```

## Biến môi trường

Tạo file `.env` từ `.env.example` và cấu hình URL API:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

Chỉ sử dụng các biến có tiền tố `VITE_` cho giá trị cần thiết ở phía frontend. Không lưu secret, password hoặc private key trong frontend environment.

## Scripts

```bash
npm run dev       # Chạy môi trường phát triển
```

## Định hướng mở rộng

- Bổ sung unit test cho authentication, tìm kiếm việc làm và CV Builder.
- Tách thêm các page lớn thành feature module độc lập.
- Bổ sung error boundary và cơ chế xử lý lỗi tập trung.
- Bổ sung lazy loading cho các page nặng như CV Builder và CKEditor.
- Bổ sung accessibility audit và tối ưu Core Web Vitals.
