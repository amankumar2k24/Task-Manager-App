import type { ReactNode } from "react";
import MobileShell from "./MobileShell";
import ErrorBanner from "../Component/ErrorBanner";
import Loader from "../Component/Loader";

interface AppLayoutProps {
    children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    return (
        <MobileShell>
            <main className="relative h-full">{children}</main>
            <ErrorBanner />
            <Loader />
        </MobileShell>
    );
}
