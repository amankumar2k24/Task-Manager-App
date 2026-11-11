import MobileShell from "./MobileShell";

export default function AppLayout({ children }) {
    return (
        <MobileShell>
            <main>{children}</main>
        </MobileShell>
    );
}
