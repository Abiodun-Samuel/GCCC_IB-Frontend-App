import { TabButton } from "@/components/ui/tab/TabButton";

export const Tabs = ({ tabs, activeTab, onTabChange, className = "" }) => (
    <div
        className={`flex flex-wrap gap-2 pb-4 border-b
            border-slate-200 dark:border-slate-700/60
            ${className}`}
    >
        {tabs.map((tab) => (
            <TabButton
                key={tab.key}
                active={activeTab === tab.key}
                onClick={() => onTabChange(tab.key)}
                icon={tab.icon}
                label={tab.label}
                count={tab.count}
            />
        ))}
    </div>
);