import type { ReactNode } from "react";

interface MobileShellProps {
    children: ReactNode;
}

export default function MobileShell({ children }: MobileShellProps) {
    return (
        <div className="relative mx-auto min-h-[100dvh] w-full max-w-[390px] bg-white shadow-[0_0_50px_rgba(16,24,40,0.10)]">
            {children}
        </div>
    );
}
