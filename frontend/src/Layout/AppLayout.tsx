import type { ReactNode } from "react";
import MobileShell from "./MobileShell";
import ErrorBanner from "../Component/ErrorBanner";

interface AppLayoutProps {
    children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    return (
        <MobileShell>
            <main className="relative h-full">{children}</main>
            <ErrorBanner />
        </MobileShell>
    );
}
