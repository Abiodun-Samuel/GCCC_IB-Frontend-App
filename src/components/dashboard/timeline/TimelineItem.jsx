import { ChevronDownIcon } from "@/icons";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import { formatDateFull, formatFullDateTime, getTypeConfig } from "@/utils/helper";
import { CalendarIcon, ClockIcon, MailIcon } from "@/icons";
import TimelineNoteSection from "@/components/dashboard/timeline/TimelineNoteSection";
import { useState } from "react";
import Button from "@/components/ui/Button";

const TimelineItem = ({ item }) => {
    const typeConfig = getTypeConfig(item.type);
    const [isExpanded, setIsExpanded] = useState(false)

    return (
        <div className="relative">

            <div className="group bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow dark:shadow-gray-900/50 border border-gray-200/80 dark:border-gray-700/80 overflow-hidden transition-all duration-300">
                {/* Header */}
                <div className="p-3 sm:p-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                            <Avatar name={item.created_by.initials} src={item.created_by.avatar} />
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                                        {item.created_by.full_name}
                                    </h3>
                                    <Badge color={typeConfig.color} size="sm">
                                        {item.type}
                                    </Badge>
                                    {item.service_date && (
                                        <Badge color="warning" size="sm">
                                            {formatFullDateTime(item.service_date)}
                                        </Badge>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 mb-3">
                                    <MailIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                        {item.created_by.email}
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-xs sm:text-sm text-gray-500 dark:text-gray-500">
                                    <div className="flex items-center gap-1.5">
                                        <ClockIcon className="w-4 h-4" />
                                        <span className="font-medium">{item.created_at_human}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <CalendarIcon className="w-4 h-4" />
                                        <span className="hidden sm:inline">
                                            {formatDateFull(item.created_at)}
                                        </span>
                                        <span className="sm:hidden">
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Button variant="neutral" size='sm'
                            className="px-2 py-1 rounded shadow-2xl shrink-0 hover:shadow-3xl transition-all duration-200"
                            aria-label={isExpanded ? "Collapse details" : "Expand details"}
                            aria-expanded={isExpanded}
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            <ChevronDownIcon
                                className={`w-5 h-5 text-gray-500 dark:text-gray-400 transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'
                                    }`}
                            />
                        </Button>
                    </div>
                </div>

                <TimelineNoteSection item={item} isExpanded={isExpanded} />
            </div>
        </div>
    );
};

export default TimelineItem;
