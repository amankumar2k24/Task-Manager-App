import type { ReactNode } from "react";

interface MobileShellProps {
    children: ReactNode;
}

export default function MobileShell({ children }: MobileShellProps) {
    return (
        <div className="relative mx-auto h-[100dvh] w-full overflow-hidden bg-homeBg sm:h-[844px] sm:max-w-[390px] sm:shadow-[0_0_50px_rgba(16,24,40,0.10)]">
            {children}
        </div>
    );
}
