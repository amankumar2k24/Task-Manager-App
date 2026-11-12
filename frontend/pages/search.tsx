import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ArrowLeft } from "lucide-react";
import AppLayout from "../src/Layout/AppLayout";
import SearchBar from "../src/Component/SearchBar";
import TaskRow from "../src/Component/TaskRow";
import EmptyState from "../src/Component/EmptyState";
import { useTasks } from "../src/hooks/useTasks";
import { useTaskSheets } from "../src/hooks/useTaskSheets";
import labels from "../src/labels/labels";

export default function Search() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const { searchResults, searchStatus, search, clearSearch } = useTasks();
    const { rowActions, sheets } = useTaskSheets();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.trim()) search(query);
            else clearSearch();
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    const hasQuery = query.trim().length > 0;

    const emptyState = (() => {
        if (!hasQuery) return <EmptyState title={labels.searchHint} subtitle="Search by title or description" />;
        if (searchStatus === "loading") return <EmptyState title="Searching…" />;
        return <EmptyState title={labels.noResults} subtitle="Try a different keyword" />;
    })();

    return (
        <AppLayout>
            <div className="no-scrollbar h-full overflow-y-auto overflow-x-hidden bg-white px-6 max-[375px]:px-4 pb-10 pt-[31px]">
                <button onClick={() => router.back()} aria-label="Back" className="block">
                    <ArrowLeft size={24} strokeWidth={1.5} color="#090E23" />
                </button>
                <div className="mt-[29px]">
                    <SearchBar value={query} onChange={setQuery} autoFocus placeholder={labels.searchPlaceholder} />
                </div>
                <div className="mt-[22px]">
                    {hasQuery && searchResults.length > 0
                        ? searchResults.map((task) => <TaskRow key={task.id} task={task} {...rowActions(task)} />)
                        : emptyState}
                </div>
            </div>

            {sheets}
        </AppLayout>
    );
}
