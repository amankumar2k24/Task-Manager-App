const styles = {
    Low: { bg: "#ECFDF3", text: "#027A48", dot: "#12B76A" },
    Medium: { bg: "#FFFAEB", text: "#B54708", dot: "#F79009" },
    High: { bg: "#FEF3F2", text: "#B42318", dot: "#F04438" },
};

export default function PriorityBadge({ priority }) {
    const style = styles[priority] || styles.Medium;
    return (
        <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-[3px] text-[11px] font-medium"
            style={{ backgroundColor: style.bg, color: style.text }}
        >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: style.dot }} />
            {priority}
        </span>
    );
}
