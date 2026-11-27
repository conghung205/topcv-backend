import { forwardRef } from "react";

const AuthField = forwardRef(function AuthField(
    { label, error, icon: Icon, rightAction, ...props },
    ref,
) {
    return (
        <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-800">{label}</label>
            <div className="relative">
                {Icon && <Icon className="absolute left-3.5 top-3.5 size-4 text-gray-400" />}
                <input
                    ref={ref}
                    {...props}
                    className={`h-11 w-full rounded-lg border bg-gray-50 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:bg-white focus:ring-2 ${Icon ? "pl-10" : "px-3.5"} ${rightAction ? "pr-11" : "pr-3.5"} ${error ? "border-red-300 focus:border-red-500 focus:ring-red-500/15" : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/15"}`}
                />
                {rightAction}
            </div>
            {error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
        </div>
    );
});

export default AuthField;
