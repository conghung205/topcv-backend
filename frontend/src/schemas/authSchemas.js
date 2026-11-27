import { z } from "zod";

const email = z.string().trim().email("Email không hợp lệ.");
const password = z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự.");

export const loginSchema = z.object({
    email,
    password: z.string().min(1, "Vui lòng nhập mật khẩu."),
});

export const employerLoginSchema = z.object({
    email: z.string().trim().email("Email doanh nghiệp không hợp lệ."),
    password: z.string().min(1, "Vui lòng nhập mật khẩu."),
});

export const registerSchema = z.object({
    full_name: z.string().trim().min(2, "Vui lòng nhập họ và tên."),
    email,
    password,
    confirm_password: z.string().min(1, "Vui lòng xác nhận mật khẩu."),
    agree_terms: z.boolean().refine(Boolean, "Bạn cần đồng ý với điều khoản sử dụng."),
}).refine((values) => values.password === values.confirm_password, {
    path: ["confirm_password"],
    message: "Mật khẩu xác nhận không trùng khớp.",
});

const optionalText = z.string().trim().optional().or(z.literal(""));

export const employerRegisterSchema = z.object({
    email: z.string().trim().email("Email doanh nghiệp không hợp lệ."),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự."),
    confirm_password: z.string().min(1, "Vui lòng xác nhận mật khẩu."),
    full_name: z.string().trim().min(2, "Vui lòng nhập họ và tên người liên hệ."),
    director: optionalText,
    phone_number: z.string().trim().regex(/^(0|\+84)[0-9\s.-]{8,12}$/, "Số điện thoại không hợp lệ."),
    gender: z.string().min(1, "Vui lòng chọn giới tính."),
    company_name: z.string().trim().min(2, "Vui lòng nhập tên công ty."),
    international_name: optionalText,
    tax_code: z.string().trim().min(5, "Mã số thuế phải có ít nhất 5 ký tự."),
    short_name: optionalText,
    headquarters_address: z.string().trim().min(5, "Vui lòng nhập địa chỉ trụ sở."),
    city_name: z.string().min(1, "Vui lòng chọn tỉnh/thành phố."),
    company_size: z.string().min(1, "Vui lòng chọn quy mô công ty."),
    website: z.union([z.literal(""), z.string().trim().url("Website không hợp lệ.")]),
    consent_terms: z.boolean().refine(Boolean, "Bạn cần đồng ý với điều khoản và chính sách của TopCV."),
    consent_marketing: z.boolean(),
}).refine((values) => values.password === values.confirm_password, {
    path: ["confirm_password"],
    message: "Mật khẩu xác nhận không trùng khớp.",
});

// Local resolver keeps the schema boundary explicit and avoids duplicating validation in pages.
