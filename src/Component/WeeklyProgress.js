import labels from "../labels/labels";

export default function WeeklyProgress({ open, completed }) {
    const total = open + completed;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    return (
        <section>
            <h2 className="mb-3 text-[20px] font-semibold text-ink">{labels.weeklyProgress}</h2>
            <div className="h-[24px] w-full overflow-hidden rounded-full bg-track">
                <div className="h-full rounded-full bg-progressFill transition-all duration-300" style={{ width: `${percent}%` }} />
            </div>
        </section>
    );
}
