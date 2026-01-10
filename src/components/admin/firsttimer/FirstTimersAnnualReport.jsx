import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
    TrendingUp,
    TrendingDown,
    Minus,
    Users,
    BarChart3,
    Calendar,
    UserCheck,
    UserX,
    UserPlus,
    ChevronLeft,
    ChevronRight,
    Phone,
    X,
    Clock,
    MessageSquare,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { useFirstTimerReport } from '@/queries/firstTimer.query';
import dayjs from 'dayjs';

// Skeleton Loading Components
const SkeletonCard = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-4" />
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-4" />
        <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between py-2">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12" />
                </div>
            ))}
        </div>
    </div>
);

const SkeletonSummary = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow mb-6 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                </div>
            ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2" />
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-12" />
                </div>
            ))}
        </div>
    </div>
);

// Year Selector Component with Dropdown
const YearSelector = ({ selectedYear, onChange, isLoading }) => {
    const [isOpen, setIsOpen] = useState(false);
    const years = useMemo(() => {
        return Array.from({ length: 2050 - 2022 + 1 }, (_, i) => 2022 + i);
    }, []);

    const currentIndex = years.indexOf(selectedYear);
    const canGoPrevious = currentIndex > 0;
    const canGoNext = currentIndex < years.length - 1;

    const handlePrevious = () => {
        if (canGoPrevious && !isLoading) {
            onChange(years[currentIndex - 1]);
        }
    };

    const handleNext = () => {
        if (canGoNext && !isLoading) {
            onChange(years[currentIndex + 1]);
        }
    };

    const handleYearSelect = (year) => {
        onChange(year);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && !event.target.closest('.year-selector-container')) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
        <div className="relative year-selector-container">
            <div className="flex items-center gap-1 bg-white dark:bg-gray-800 rounded-lg shadow px-3 py-2">
                <button
                    onClick={handlePrevious}
                    disabled={!canGoPrevious || isLoading}
                    className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label="Previous year"
                >
                    <ChevronLeft className="text-gray-600 dark:text-gray-400" size={20} />
                </button>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 min-w-[140px] justify-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 px-4 py-1.5 rounded-lg transition-all border border-blue-200 dark:border-blue-800"
                >
                    <Calendar className="text-blue-600 dark:text-blue-400" size={18} />
                    <span className="text-base font-semibold text-gray-900 dark:text-white">
                        {selectedYear}
                    </span>
                    <ChevronDown className={`text-blue-600 dark:text-blue-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} size={18} />
                </button>

                <button
                    onClick={handleNext}
                    disabled={!canGoNext || isLoading}
                    className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label="Next year"
                >
                    <ChevronRight className="text-gray-600 dark:text-gray-400" size={20} />
                </button>
            </div>

            {isOpen && (
                <div className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50 min-w-[150px]">
                    <div className="max-h-[300px] overflow-y-auto">
                        {years.map((year) => (
                            <button
                                key={year}
                                onClick={() => handleYearSelect(year)}
                                className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${year === selectedYear
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold'
                                    : 'text-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                {year}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// Status Badge Component
const StatusBadge = ({ status, count, percentage, colors }) => {
    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case 'integrated':
                return <UserCheck size={14} />;
            case 'opt-out':
                return <UserX size={14} />;
            default:
                return <UserPlus size={14} />;
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <div className="flex items-center gap-2 mb-2">
                <span className={colors.text}>
                    {getStatusIcon(status)}
                </span>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    {status}
                </p>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {count}
            </p>
            <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                        className={`${colors.bg} h-1.5 rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium min-w-[40px] text-right">
                    {percentage}%
                </p>
            </div>
        </div>
    );
};

// Feedback Timeline Component
const FeedbackTimeline = ({ feedbacks }) => {
    if (!feedbacks || feedbacks.length === 0) {
        return (
            <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-400 dark:text-gray-500">No feedback recorded</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {feedbacks.map((feedback, index) => (
                <div key={feedback.id} className="relative">
                    {index !== feedbacks.length - 1 && (
                        <div className="absolute left-6 top-14 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />
                    )}

                    <div className="">

                        <div className="flex-1 min-w-0">
                            <div className="bg-white dark:bg-gray-800">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                                    <div className="min-w-0">
                                        <Link
                                            to={`/dashboard/members/${feedback.created_by.id}`}
                                            className="text-sm font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                        >
                                            {feedback.created_by.full_name}
                                        </Link>
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {dayjs(feedback.created_at).format('MMM DD, YYYY')}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3.5 h-3.5" />
                                                {dayjs(feedback.created_at).format('hh:mm A')}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-start sm:items-end gap-1.5 flex-shrink-0">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                                            {feedback.type}
                                        </span>
                                        {feedback.service_date && (
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                Service: {dayjs(feedback.service_date).format('MMM DD')}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                    {feedback.note}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// Person Card with Collapsible Feedback (Closed by Default)
const PersonCard = ({ person }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasFeedback = person.followup_feedbacks && person.followup_feedbacks.length > 0;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden">
            <button
                onClick={() => hasFeedback && setIsExpanded(!isExpanded)}
                className={`w-full flex items-start gap-3 p-4 text-left ${hasFeedback ? 'hover:bg-gray-50 dark:hover:bg-gray-700/50' : ''} transition-colors`}
            >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow">
                    {person.first_name[0]}{person.last_name[0]}
                </div>
                <div className="flex-1 min-w-0">
                    <Link
                        to={`/dashboard/first-timers/${person.id}`}
                        className="text-sm font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline truncate"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {person.full_name}
                    </Link>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <Phone size={12} />
                        <span className="truncate">{person.phone_number}</span>
                    </div>
                </div>
                {hasFeedback && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2.5 py-1 rounded-full font-medium">
                            {person.feedbacks_count}
                        </span>
                        {isExpanded ? (
                            <ChevronUp size={18} className="text-gray-400" />
                        ) : (
                            <ChevronDown size={18} className="text-gray-400" />
                        )}
                    </div>
                )}
            </button>

            {isExpanded && hasFeedback && (
                <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700 pt-4">
                    <div className="flex items-center gap-2 mb-3">
                        <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                            Feedback History
                        </h5>
                    </div>
                    <FeedbackTimeline feedbacks={person.followup_feedbacks} />
                </div>
            )}
        </div>
    );
};

// Month Details Modal (Redesigned with Fixed Width)
const MonthDetailsModal = ({ isOpen, onClose, month, statusColors }) => {
    const [expandedStatuses, setExpandedStatuses] = useState({});

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // All statuses closed by default
            setExpandedStatuses({});
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, month]);

    const toggleStatus = (status) => {
        setExpandedStatuses(prev => ({
            ...prev,
            [status]: !prev[status]
        }));
    };

    if (!isOpen || !month) return null;

    const statusesWithData = month.allStatuses.filter(s => s.count > 0);

    return (
        <div className="fixed inset-0 z-[9999] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block">
                <div
                    className="fixed inset-0 bg-gray-900/75 dark:bg-gray-950/90 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                ></div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                {/* Fixed width container to prevent expansion */}
                <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle w-full max-w-4xl relative">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 px-6 py-5">
                        <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0 pr-4">
                                <h3 className="text-xl font-bold text-white truncate" id="modal-title">
                                    {month.month} - Detailed Report
                                </h3>
                                <p className="text-sm text-blue-100 mt-1 flex items-center gap-2">
                                    <Users className="w-4 h-4 flex-shrink-0" />
                                    <span>{month.total} Total First-Timers</span>
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="flex-shrink-0 rounded-lg p-1.5 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Content - Fixed height with scroll */}
                    <div className="bg-gray-50 dark:bg-gray-900 px-6 py-6 max-h-[70vh] overflow-y-auto">
                        {statusesWithData.length === 0 ? (
                            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                                </div>
                                <p className="text-gray-500 dark:text-gray-400 font-medium">No first-timers this month</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {statusesWithData.map(({ status, count, percentage, people }) => {
                                    const isExpanded = expandedStatuses[status];
                                    return (
                                        <div key={status} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm">
                                            {/* Status Header */}
                                            <button
                                                onClick={() => toggleStatus(status)}
                                                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                                            >
                                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                                    <div className={`w-3 h-3 rounded-full ${statusColors[status]?.bg || 'bg-gray-400'} flex-shrink-0`} />
                                                    <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide truncate">
                                                        {status}
                                                    </h4>
                                                </div>
                                                <div className="flex items-center gap-3 flex-shrink-0">
                                                    <div className="text-right">
                                                        <span className="text-lg font-bold text-gray-900 dark:text-white">{count}</span>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                                                            ({percentage}%)
                                                        </span>
                                                    </div>
                                                    <div className="w-5 flex items-center justify-center">
                                                        {isExpanded ? (
                                                            <ChevronUp size={20} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                                                        ) : (
                                                            <ChevronDown size={20} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                                                        )}
                                                    </div>
                                                </div>
                                            </button>

                                            {/* Collapsible Content */}
                                            {isExpanded && people && people.length > 0 && (
                                                <div className="px-5 pb-5 pt-2 bg-gray-50 dark:bg-gray-900/50 space-y-2">
                                                    {people.map((person) => (
                                                        <PersonCard key={person.id} person={person} />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="bg-white dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {month.total} total first-timer{month.total !== 1 ? 's' : ''} • {statusesWithData.length} status {statusesWithData.length !== 1 ? 'categories' : 'category'}
                            </p>
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:focus:ring-white transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Month Card Component
const MonthCard = ({ month, index, statusColors }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getTrendIcon = () => {
        if (month.trend === 'up') {
            return (
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <TrendingUp size={14} />
                    <span className="text-xs font-semibold">+{month.trendPercent}%</span>
                </div>
            );
        }
        if (month.trend === 'down') {
            return (
                <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                    <TrendingDown size={14} />
                    <span className="text-xs font-semibold">-{Math.abs(month.trendPercent)}%</span>
                </div>
            );
        }
        return (
            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                <Minus size={14} />
                <span className="text-xs font-semibold">0%</span>
            </div>
        );
    };

    const hasFirstTimers = month.total > 0;
    const statusesWithData = month.allStatuses.filter(s => s.count > 0);

    return (
        <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow">
                {/* Month Header */}
                <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {month.month}
                        </h3>
                        {getTrendIcon()}
                    </div>
                    <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            {month.total}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            first-timers
                        </p>
                    </div>
                </div>

                {/* Status Breakdown */}
                <div className="p-4">
                    {hasFirstTimers ? (
                        <>
                            <div className="space-y-2 mb-3">
                                {statusesWithData.slice(0, 4).map(({ status, count, percentage }) => (
                                    <div
                                        key={status}
                                        className="flex items-center justify-between py-2 text-sm"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${statusColors[status]?.bg || 'bg-gray-400'}`} />
                                            <span className="text-gray-700 dark:text-gray-300 font-medium">
                                                {status}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-semibold text-gray-900 dark:text-white">{count}</span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1.5">
                                                ({percentage}%)
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="w-full py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 rounded-lg transition-colors shadow-sm"
                            >
                                View All Details
                            </button>
                        </>
                    ) : (
                        <div className="py-4 text-center">
                            <p className="text-sm text-gray-400 dark:text-gray-500">
                                No first-timers this month
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <MonthDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                month={month}
                statusColors={statusColors}
            />
        </>
    );
};

// Main Component
const FirstTimersAnnualReport = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentYear = new Date().getFullYear();
    const selectedYear = Number(searchParams.get('year')) || currentYear;

    const { data, isLoading, isError, error } = useFirstTimerReport(
        { year: selectedYear },
        {
            enabled: selectedYear >= 2022 && selectedYear <= 2050,
            refetchOnWindowFocus: false
        }
    );

    const statusColors = {
        'Integrated': { text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-600 dark:bg-emerald-400' },
        'Contacted': { text: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-600 dark:bg-blue-400' },
        'Visiting': { text: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-600 dark:bg-cyan-400' },
        'Invited Again': { text: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-600 dark:bg-purple-400' },
        'Second Timer': { text: 'text-pink-600 dark:text-pink-400', bg: 'bg-pink-600 dark:bg-pink-400' },
        'Third Timer': { text: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-600 dark:bg-violet-400' },
        'Fourth Timer': { text: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-600 dark:bg-indigo-400' },
        'Not Contacted': { text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-600 dark:bg-amber-400' },
        'Away': { text: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-600 dark:bg-gray-400' },
        'Opt-out': { text: 'text-red-600 dark:text-red-400', bg: 'bg-red-600 dark:bg-red-400' },
        'Unknown': { text: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-600 dark:bg-slate-400' }
    };

    const handleYearChange = (year) => {
        setSearchParams({ year: year.toString() });
    };

    const metrics = useMemo(() => {
        if (!data?.monthly_breakdown) return null;

        const monthlyData = data.monthly_breakdown.map((month, index) => {
            const total = month.total_count;
            const statusCounts = month.statuses;

            const allStatuses = Object.entries(statusCounts)
                .map(([status, data]) => ({
                    status,
                    count: data.count,
                    percentage: total > 0 ? ((data.count / total) * 100).toFixed(1) : '0.0',
                    people: data.first_timers || []
                }))
                .sort((a, b) => b.count - a.count);

            const prevMonth = index > 0 ? data.monthly_breakdown[index - 1] : null;
            const prevTotal = prevMonth?.total_count || total;

            const trend = total > prevTotal ? 'up' : total < prevTotal ? 'down' : 'stable';
            const trendPercent = prevTotal > 0 ? Math.abs(((total - prevTotal) / prevTotal) * 100).toFixed(1) : '0.0';

            return {
                month: month.month,
                total,
                allStatuses,
                trend,
                trendPercent
            };
        });

        const yearTotal = data.summary.total_first_timers;
        const yearStatusTotals = data.status_summary
            .map(status => ({
                status: status.status,
                count: status.count,
                percentage: status.percentage.toFixed(1)
            }))
            .sort((a, b) => b.count - a.count);

        return {
            monthlyData,
            yearTotal,
            yearStatusTotals,
            integrationRate: data.summary.integration_rate,
            averagePerMonth: data.summary.average_per_month,
            peakMonth: data.summary.peak_month
        };
    }, [data]);

    if (isError) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8 flex items-center justify-center">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow max-w-md w-full text-center">
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <UserX className="text-red-600 dark:text-red-400" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Error Loading Report
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {error?.message || 'Failed to load the annual report. Please try again.'}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="w-full mx-auto">
                {/* Header */}
                <div className="flex mb-8 flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <YearSelector
                        selectedYear={selectedYear}
                        onChange={handleYearChange}
                        isLoading={isLoading}
                    />
                </div>

                {isLoading ? (
                    <>
                        <SkeletonSummary />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[...Array(12)].map((_, i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </div>
                    </>
                ) : metrics ? (
                    <>
                        {/* Annual Summary */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow mb-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                                    <BarChart3 className="text-blue-600 dark:text-blue-400" size={20} />
                                </div>
                                Annual Overview
                            </h2>

                            {/* Key Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
                                <div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                                            <Users className="text-blue-600 dark:text-blue-400" size={20} />
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                                            Total First-Timers
                                        </p>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white ml-[52px]">
                                        {metrics.yearTotal}
                                    </p>
                                </div>

                                <div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                                            <BarChart3 className="text-blue-600 dark:text-blue-400" size={20} />
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                                            Average Per Month
                                        </p>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white ml-[52px]">
                                        {metrics.averagePerMonth.toFixed(1)}
                                    </p>
                                </div>

                                <div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                                            <UserCheck className="text-blue-600 dark:text-blue-400" size={20} />
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                                            Integration Rate
                                        </p>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white ml-[52px]">
                                        {metrics.integrationRate.toFixed(1)}%
                                    </p>
                                </div>

                                <div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                                            <TrendingUp className="text-blue-600 dark:text-blue-400" size={20} />
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                                            Peak Month
                                        </p>
                                    </div>
                                    <div className="ml-[52px]">
                                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                                            {metrics.peakMonth.month}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {metrics.peakMonth.count} first-timers
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Status Summary */}
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                                        <Users className="text-blue-600 dark:text-blue-400" size={16} />
                                    </div>
                                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                                        Status Distribution
                                    </h3>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                    {metrics.yearStatusTotals.map(({ status, count, percentage }) => (
                                        <StatusBadge
                                            key={status}
                                            status={status}
                                            count={count}
                                            percentage={percentage}
                                            colors={statusColors[status] || statusColors['Unknown']}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Monthly Breakdown */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                Monthly Breakdown
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {metrics.monthlyData.map((month, index) => (
                                    <MonthCard
                                        key={month.month}
                                        month={month}
                                        index={index}
                                        statusColors={statusColors}
                                    />
                                ))}
                            </div>
                        </div>
                    </>
                ) : null}
            </div>
        </div>
    );
};

export default FirstTimersAnnualReport;