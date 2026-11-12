import { useEffect } from "react";
import { useRouter } from "next/router";
import { ArrowLeft } from "lucide-react";
import AppLayout from "../src/Layout/AppLayout";
import WeekCard from "../src/Component/WeekCard";
import EmptyState from "../src/Component/EmptyState";
import { useTasks } from "../src/hooks/useTasks";
import { useTaskSheets } from "../src/hooks/useTaskSheets";
import { groupTasksByWeek, startOfWeek } from "../src/lib/week";
import labels from "../src/labels/labels";

export default function Weeks() {
    const router = useRouter();
    const { items, status, loadTasks } = useTasks();
    const { rowActions, sheets } = useTaskSheets();

    useEffect(() => {
        loadTasks({});
    }, []);

    const groups = groupTasksByWeek(items);
    const currentWeekStart = startOfWeek(new Date()).getTime();

    return (
        <AppLayout>
            <div className="no-scrollbar h-full overflow-y-auto overflow-x-hidden bg-homeBg px-6 max-[375px]:px-4 pb-10 pt-[31px]">
                <div className="mb-[30px] flex items-center gap-3">
                    <button onClick={() => router.back()} aria-label="Back">
                        <ArrowLeft size={24} strokeWidth={1.5} color="#090E23" />
                    </button>
                    <h1 className="text-[18px] font-semibold leading-[27px] text-ink">{labels.allWeeks}</h1>
                </div>
                {status === "loading" && groups.length === 0 ? (
                    <EmptyState title={labels.loading} />
                ) : groups.length === 0 ? (
                    <EmptyState title={labels.noWeeks} />
                ) : (
                    <div className="flex flex-col gap-3">
                        {groups.map((group) => (
                            <WeekCard
                                key={group.weekStart.toISOString()}
                                weekStart={group.weekStart}
                                tasks={group.tasks}
                                defaultExpanded={group.weekStart.getTime() === currentWeekStart}
                                rowActions={rowActions}
                            />
                        ))}
                    </div>
                )}
            </div>

            {sheets}
        </AppLayout>
    );
}
