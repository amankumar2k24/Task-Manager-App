import labels from "../labels/labels";

interface WeeklyProgressProps {
    open: number;
    completed: number;
}

export default function WeeklyProgress({ open, completed }: WeeklyProgressProps) {
    const total = open + completed;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    return (
        <section>
            <h2 className="text-[18px] font-semibold leading-[27px] text-black">{labels.weeklyProgress}</h2>
            <div
                className="mt-[14px] h-6 w-full overflow-hidden bg-track"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percent}
                aria-label={labels.weeklyProgress}
            >
                <div className="h-full bg-progressFill transition-all duration-300" style={{ width: `${percent}%` }} />
            </div>
        </section>
    );
}
