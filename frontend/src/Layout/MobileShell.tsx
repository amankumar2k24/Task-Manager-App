import type { ReactNode } from "react";

interface MobileShellProps {
    children: ReactNode;
}

// On phones the shell fills the whole screen (100dvh); from the `sm` breakpoint up it becomes
// a centered 390x844 phone frame. overflow-hidden keeps the frame itself from scrolling;
// each page scrolls inside its own container instead.
export default function MobileShell({ children }: MobileShellProps) {
    return (
        <div className="relative mx-auto h-[100dvh] w-full overflow-hidden bg-homeBg sm:h-[844px] sm:max-w-[390px] sm:shadow-[0_0_50px_rgba(16,24,40,0.10)]">
            {children}
        </div>
    );
}
