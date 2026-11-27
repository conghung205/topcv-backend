/**
 * Format currency VND / USD
 */
export function formatCurrency(amount, currency = "VND") {
    if (amount === null || amount === undefined || isNaN(amount)) return "";
    if (currency === "VND") {
        if (amount >= 1000000) {
            const millions = amount / 1000000;
            return Number.isInteger(millions) ? `${millions} triệu` : `${millions.toFixed(1)} triệu`;
        }
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
    }
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

/**
 * Format salary display string from salary object
 */
export function formatSalary(salary) {
    if (!salary) return "Thoả thuận";
    if (salary.type === "AGREEMENT" || salary.is_negotiable && !salary.min && !salary.max) {
        return "Thoả thuận";
    }
    if (salary.type === "RANGE" || (salary.min && salary.max)) {
        return `${formatCurrency(salary.min, salary.currency)} - ${formatCurrency(salary.max, salary.currency)}`;
    }
    if (salary.type === "UP_TO" || (!salary.min && salary.max)) {
        return `Lên đến ${formatCurrency(salary.max, salary.currency)}`;
    }
    if (salary.type === "MINIMUM" || (salary.min && !salary.max)) {
        return `Từ ${formatCurrency(salary.min, salary.currency)}`;
    }
    return "Thoả thuận";
}

/**
 * Format date string DD/MM/YYYY
 */
export function formatDate(dateStr) {
    if (!dateStr) return "";
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    } catch {
        return dateStr;
    }
}
