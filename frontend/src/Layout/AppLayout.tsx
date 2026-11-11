import type { ReactNode } from "react";
import MobileShell from "./MobileShell";

interface AppLayoutProps {
    children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    return (
        <MobileShell>
            <main>{children}</main>
        </MobileShell>
    );
}
