import { useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useAttendanceReport } from "@/queries/attendance.query";
import Animated from "@/components/common/Animated";
import dayjs from "dayjs";
import DatePicker from "react-multi-date-picker";
import { useServices } from "@/queries/service.query";
import { getMatchingServiceId } from "@/utils/helper";
import ComponentCard from "@/components/common/ComponentCard";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { AdminIcon } from "@/icons";
import {
    Users,
    CheckCircle2,
    XCircle,
    BarChart3,
    Calendar,
    Clock,
    Mail,
    Phone,
    MessageSquare,
    X,
    Search,
    AlertCircle,
    FileText,
    Share2,
    Check,
    ChevronLeft,
    ChevronRight,
    Trash2,
    Users2,
    User2Icon,
    User2,
    History,
    User
} from "lucide-react";
import Button from "@/components/ui/Button";

// ==================== SKELETON LOADERS ====================
const StatCardSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-3"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
    </div>
);

const TableSkeleton = ({ rows = 5 }) => (
    <div className="animate-pulse">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded mb-2"></div>
        ))}
    </div>
);

// ==================== STATISTICS CARD ====================
const StatCard = ({ title, value, subtitle, icon: Icon, color = "blue" }) => {
    const colorClasses = {
        blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
        green: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800",
        red: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800",
        purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800",
        amber: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    };

    return (
        <Animated animation="fade-up" className="h-full">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 h-full">
                <div className="flex items-start justify-between mb-3">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
                    {Icon && (
                        <div className={`p-2 rounded-lg border ${colorClasses[color]}`}>
                            <Icon className="w-5 h-5" />
                        </div>
                    )}
                </div>
                <div className="flex flex-col">
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{value}</h3>
                    {subtitle && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
                    )}
                </div>
            </div>
        </Animated>
    );
};

// ==================== MEMBERS FEEDBACK MODAL ====================
const MembersFeedbackModal = ({ isOpen, onClose, serviceFeedbacks = [], allFeedbacks = [], memberName }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    // Determine which feedbacks to display
    const feedbacksToDisplay = serviceFeedbacks.length > 0 ? serviceFeedbacks : allFeedbacks;
    const feedbackTitle = serviceFeedbacks.length > 0 ? "Service Feedbacks" : "All Feedbacks";

    return (
        <div className="fixed inset-0 z-[9999] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div
                    className="fixed inset-0 bg-gray-900/75 dark:bg-gray-950/90 backdrop-blur-sm transition-opacity z-[9998]"
                    aria-hidden="true"
                    onClick={onClose}
                ></div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full z-[9999] relative">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 px-6 py-5">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-white" id="modal-title">
                                    {feedbackTitle}
                                </h3>
                                <p className="text-sm text-blue-100 dark:text-blue-200 mt-1 flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    {memberName}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="ml-4 rounded-lg p-1.5 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 px-6 py-6 max-h-[60vh] overflow-y-auto">
                        {feedbacksToDisplay.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MessageSquare className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                                </div>
                                <p className="text-gray-500 dark:text-gray-400 font-medium">No feedback recorded yet</p>
                                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Follow-up activities will appear here</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {feedbacksToDisplay.map((feedback) => (
                                    <div
                                        key={feedback.id}
                                        className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 sm:p-5 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                                            {/* User info section */}
                                            <div className="flex items-start gap-3">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-white font-semibold text-sm">
                                                        {feedback.created_by.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <Link
                                                        to={`/dashboard/members/${feedback.created_by.id}`}
                                                        className="text-sm font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                                    >
                                                        {feedback.created_by.name}
                                                    </Link>
                                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                                                            <span className="whitespace-nowrap">{dayjs(feedback.created_at).format('MMM DD, YYYY')}</span>
                                                        </div>
                                                        <span className="hidden xs:inline text-gray-400 dark:text-gray-600">•</span>
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                                                            <span className="whitespace-nowrap">{dayjs(feedback.created_at).format('hh:mm A')}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Badges section */}
                                            <div className="flex flex-row sm:flex-col items-start sm:items-end gap-2 sm:gap-1.5 flex-shrink-0">
                                                <span className="inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800 whitespace-nowrap">
                                                    {feedback.type}
                                                </span>
                                                {feedback.service_date && (
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 whitespace-nowrap">
                                                        <Calendar className="w-3 h-3 flex-shrink-0" />
                                                        <span className="hidden xs:inline">Service: </span>
                                                        {dayjs(feedback.service_date).format('MMM DD')}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Feedback content */}
                                        <div className="mt-3 bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-700">
                                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap break-words">
                                                {feedback.note}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {feedbacksToDisplay.length} {feedbacksToDisplay.length === 1 ? 'feedback' : 'feedbacks'} recorded
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

// ==================== FIRST TIMER FEEDBACK MODAL ====================
const FirstTimerFeedbackModal = ({ isOpen, onClose, feedbacks = [], memberName }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div
                    className="fixed inset-0 bg-gray-900/75 dark:bg-gray-950/90 backdrop-blur-sm transition-opacity z-[9998]"
                    aria-hidden="true"
                    onClick={onClose}
                ></div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full z-[9999] relative">
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-700 dark:to-blue-700 px-6 py-5">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-white" id="modal-title">
                                    Follow-up Feedbacks
                                </h3>
                                <p className="text-sm text-purple-100 dark:text-purple-200 mt-1 flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    {memberName}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="ml-4 rounded-lg p-1.5 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 px-6 py-6 max-h-[60vh] overflow-y-auto">
                        {feedbacks.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MessageSquare className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                                </div>
                                <p className="text-gray-500 dark:text-gray-400 font-medium">No feedback recorded yet</p>
                                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Follow-up activities will appear here</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {feedbacks.map((feedback) => (
                                    <div
                                        key={feedback.id}
                                        className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-white font-semibold text-sm">
                                                        {feedback.created_by.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                        {feedback.created_by.name}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        <span>{dayjs(feedback.created_at).format('MMM DD, YYYY')}</span>
                                                        <span className="text-gray-400 dark:text-gray-600">•</span>
                                                        <Clock className="w-3.5 h-3.5" />
                                                        <span>{dayjs(feedback.created_at).format('hh:mm A')}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-1.5">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                                                    {feedback.type}
                                                </span>
                                                {feedback.service_date && (
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        Service: {dayjs(feedback.service_date).format('MMM DD')}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-3 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                                {feedback.note}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {feedbacks.length} {feedbacks.length === 1 ? 'feedback' : 'feedbacks'} recorded
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

// ==================== ATTENDANCE HISTORY MODAL ====================
const AttendanceHistoryModal = ({ isOpen, onClose, attendanceHistory = [], memberName }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div
                    className="fixed inset-0 bg-gray-900/75 dark:bg-gray-950/90 backdrop-blur-sm transition-opacity z-[9998]"
                    aria-hidden="true"
                    onClick={onClose}
                ></div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full z-[9999] relative">
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-700 dark:to-blue-700 px-6 py-5">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-white" id="modal-title">
                                    Attendance History
                                </h3>
                                <p className="text-sm text-purple-100 dark:text-purple-200 mt-1 flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    {memberName}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="ml-4 rounded-lg p-1.5 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 px-6 py-6 max-h-[60vh] overflow-y-auto">
                        {attendanceHistory.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <History className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                                </div>
                                <p className="text-gray-500 dark:text-gray-400 font-medium">No attendance history</p>
                                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">This is their first visit</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {attendanceHistory.map((record) => (
                                    <div
                                        key={record.attendance_id}
                                        className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${record.status === 'present'
                                                    ? 'bg-gradient-to-br from-green-500 to-green-600'
                                                    : 'bg-gradient-to-br from-red-500 to-red-600'
                                                    }`}>
                                                    {record.status === 'present' ? (
                                                        <CheckCircle2 className="w-5 h-5 text-white" />
                                                    ) : (
                                                        <XCircle className="w-5 h-5 text-white" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                        {record.service.name}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        <span>{dayjs(record.attendance_date).format('MMM DD, YYYY')}</span>
                                                        <span className="text-gray-400 dark:text-gray-600">•</span>
                                                        <Clock className="w-3.5 h-3.5" />
                                                        <span>{dayjs(record.marked_at).format('hh:mm A')}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-1.5">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${record.status === 'present'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800'
                                                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800'
                                                    }`}>
                                                    {record.status === 'present' ? 'Present' : 'Absent'}
                                                </span>
                                                {record.mode && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800 capitalize">
                                                        {record.mode}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {attendanceHistory.length} {attendanceHistory.length === 1 ? 'visit' : 'visits'} recorded
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

// ==================== MEMBERS ATTENDANCE TABLE ====================
const MembersAttendanceTable = ({ data = [], serviceDate }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredData = useMemo(() => {
        return data.filter(item => {
            const matchesSearch = item.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.user.phone.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === "all" || item.attendance_status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [data, searchQuery, statusFilter]);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredData, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter, itemsPerPage]);

    const handleOpenFeedbackModal = (serviceFeedbacks, allFeedbacks, memberName) => {
        setSelectedFeedback({ serviceFeedbacks, allFeedbacks, memberName });
        setIsModalOpen(true);
    };

    const handleCloseFeedbackModal = () => {
        setIsModalOpen(false);
        setSelectedFeedback(null);
    };

    return (
        <>
            <Animated animation="fade-up" className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Members Attendance</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {filteredData.length} of {data.length} members
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search members..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 w-full sm:w-64"
                                />
                            </div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                            >
                                <option value="all">All Status</option>
                                <option value="present">Present</option>
                                <option value="absent">Absent</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Member
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Contact
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Mode
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Service Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Assigned To
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Service Feedbacks
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    All Feedbacks
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {paginatedData.length > 0 ? (
                                paginatedData.map((item) => {
                                    const serviceFeedbacks = item?.service_feedbacks || [];
                                    const allFeedbacks = item?.all_feedbacks || [];

                                    return (
                                        <tr
                                            key={item.attendance_id}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        {item.user.avatar ? (
                                                            <img
                                                                className="h-10 w-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                                                                src={item.user.avatar}
                                                                alt={item.user.name}
                                                            />
                                                        ) : (
                                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm border-2 border-gray-200 dark:border-gray-700">
                                                                {item.user.name.charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <Link
                                                            to={`/dashboard/members/${item.user.id}`}
                                                            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
                                                        >
                                                            {item.user.name}
                                                        </Link>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                            {item.user.gender}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <a
                                                    href={`tel:${item.user.phone}`}
                                                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline flex items-center gap-1"
                                                >
                                                    <Phone className="w-3 h-3" />
                                                    {item.user.phone}
                                                </a>
                                                <a
                                                    href={`mailto:${item.user.email}`}
                                                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline flex items-center gap-1"
                                                >
                                                    <Mail className="w-3 h-3" />
                                                    {item.user.email}
                                                </a>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${item.attendance_status === 'present'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800'
                                                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800'
                                                    }`}>
                                                    {item.attendance_status === 'present' ? (
                                                        <CheckCircle2 className="w-3 h-3" />
                                                    ) : (
                                                        <XCircle className="w-3 h-3" />
                                                    )}
                                                    {item.attendance_status === 'present' ? 'Present' : 'Absent'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {item.attendance_mode ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800 capitalize">
                                                        {item.attendance_mode}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-gray-400 dark:text-gray-500">—</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                {dayjs(serviceDate).format('MMM DD, YYYY')}
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.absentee_assignment?.assigned_leader ? (
                                                    <div className="text-sm">
                                                        <Link
                                                            to={`/dashboard/members/${item.absentee_assignment.assigned_leader.id}`}
                                                            className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
                                                        >
                                                            {item.absentee_assignment.assigned_leader.name}
                                                        </Link>
                                                        <a
                                                            href={`tel:${item.absentee_assignment.assigned_leader.phone}`}
                                                            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline flex items-center gap-1"
                                                        >
                                                            <Phone className="w-3 h-3" />
                                                            {item.absentee_assignment.assigned_leader.phone}
                                                        </a>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-400 dark:text-gray-500">Not assigned</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {serviceFeedbacks.length > 0 ? (
                                                    <button
                                                        onClick={() => handleOpenFeedbackModal(serviceFeedbacks, [], item.user.name)}
                                                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors cursor-pointer"
                                                    >
                                                        <MessageSquare className="w-3 h-3" />
                                                        {serviceFeedbacks.length} feedback{serviceFeedbacks.length !== 1 ? 's' : ''}
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-gray-400 dark:text-gray-500">No feedbacks</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {allFeedbacks.length > 0 ? (
                                                    <button
                                                        onClick={() => handleOpenFeedbackModal([], allFeedbacks, item.user.name)}
                                                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors cursor-pointer"
                                                    >
                                                        <MessageSquare className="w-3 h-3" />
                                                        {allFeedbacks.length} feedback{allFeedbacks.length !== 1 ? 's' : ''}
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-gray-400 dark:text-gray-500">No feedbacks</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <AlertCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                                            <p className="text-gray-500 dark:text-gray-400 font-medium">No members found</p>
                                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                                                {searchQuery || statusFilter !== "all" ? "Try adjusting your filters" : "No attendance data available"}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 0 && (
                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} results
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-sm text-gray-500 dark:text-gray-400">Show:</label>
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                    className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                                >
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-1"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Previous
                            </button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${currentPage === pageNum
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-1"
                            >
                                Next
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </Animated>

            {isModalOpen && selectedFeedback && (
                <MembersFeedbackModal
                    isOpen={isModalOpen}
                    onClose={handleCloseFeedbackModal}
                    serviceFeedbacks={selectedFeedback.serviceFeedbacks}
                    allFeedbacks={selectedFeedback.allFeedbacks}
                    memberName={selectedFeedback.memberName}
                />
            )}
        </>
    );
};

// ==================== FIRST TIMERS TABLE ====================
const FirstTimersTable = ({ data = [] }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [selectedModal, setSelectedModal] = useState(null);

    const filteredData = useMemo(() => {
        return data.filter(item => {
            const matchesSearch = item.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.user.phone.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesSearch;
        });
    }, [data, searchQuery]);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredData, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, itemsPerPage]);

    const handleOpenModal = (type, data, memberName) => {
        setSelectedModal({ type, data, memberName });
    };

    const handleCloseModal = () => {
        setSelectedModal(null);
    };

    // Helper function to get status colors
    const getStatusColors = (color) => {
        const colorMap = {
            'error': { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' },
            'info': { bg: '#dbeafe', text: '#1e40af', border: '#bfdbfe' },
            'warning': { bg: '#fef3c7', text: '#92400e', border: '#fde68a' },
            'success': { bg: '#d1fae5', text: '#065f46', border: '#a7f3d0' },
            'primary': { bg: '#dbeafe', text: '#1e40af', border: '#bfdbfe' },
            'dark': { bg: '#e5e7eb', text: '#1f2937', border: '#d1d5db' },
        };
        return colorMap[color] || { bg: '#f3f4f6', text: '#374151', border: '#e5e7eb' };
    };

    return (
        <>
            <Animated animation="fade-up" className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">First Timers</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {filteredData.length} of {data.length} first timers
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search first timers..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 w-full sm:w-64"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    First Timer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Contact
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    First Visit
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Registered
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Follow-up Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Assigned To
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Attendance History
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Feedbacks
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {paginatedData.length > 0 ? (
                                paginatedData.map((item) => {
                                    const feedbacks = item.feedbacks || [];
                                    const attendanceHistory = item.attendance_history || [];
                                    const statusColors = item.user.follow_up_status ? getStatusColors(item.user.follow_up_status.color) : null;

                                    return (
                                        <tr key={item.user_id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        {item.user.avatar ? (
                                                            <img
                                                                className="h-10 w-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                                                                src={item.user.avatar}
                                                                alt={item.user.name}
                                                            />
                                                        ) : (
                                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold text-sm border-2 border-gray-200 dark:border-gray-700">
                                                                {item.user.name.charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <Link
                                                            to={`/dashboard/first-timers/${item.user.id}`}
                                                            className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 hover:underline"
                                                        >
                                                            {item.user.name}
                                                        </Link>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                            {item.user.gender}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <a
                                                    href={`tel:${item.user.phone}`}
                                                    className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 hover:underline flex items-center gap-1"
                                                >
                                                    <Phone className="w-3 h-3" />
                                                    {item.user.phone}
                                                </a>
                                                <a
                                                    href={`mailto:${item.user.email}`}
                                                    className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 hover:underline flex items-center gap-1 mt-1"
                                                >
                                                    <Mail className="w-3 h-3" />
                                                    {item.user.email}
                                                </a>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-white font-medium">
                                                    {dayjs(item.date_of_visit).format('MMM DD, YYYY')}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {dayjs(item.date_of_visit).format('dddd')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-700 dark:text-gray-300">
                                                    {dayjs(item.registered_at).format('MMM DD, YYYY')}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {dayjs(item.registered_at).format('hh:mm A')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {item.user.follow_up_status && statusColors ? (
                                                    <span
                                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                                                        style={{
                                                            backgroundColor: statusColors.bg,
                                                            color: statusColors.text,
                                                            borderColor: statusColors.border
                                                        }}
                                                    >
                                                        {item.user.follow_up_status.title}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-gray-400 dark:text-gray-500">No status</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.assigned_followup_person ? (
                                                    <div className="text-sm">
                                                        <Link
                                                            to={`/dashboard/members/${item.assigned_followup_person.id}`}
                                                            className="font-medium text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 hover:underline"
                                                        >
                                                            {item.assigned_followup_person.name}
                                                        </Link>
                                                        <a
                                                            href={`tel:${item.assigned_followup_person.phone}`}
                                                            className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 hover:underline flex items-center gap-1 mt-1"
                                                        >
                                                            <Phone className="w-3 h-3" />
                                                            {item.assigned_followup_person.phone}
                                                        </a>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-400 dark:text-gray-500">Not assigned</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {attendanceHistory.length > 0 ? (
                                                    <button
                                                        onClick={() => handleOpenModal('history', attendanceHistory, item.user.name)}
                                                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors cursor-pointer"
                                                    >
                                                        <History className="w-3 h-3" />
                                                        {attendanceHistory.length} visit{attendanceHistory.length !== 1 ? 's' : ''}
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                                                        <History className="w-3 h-3" />
                                                        First visit
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {feedbacks.length > 0 ? (
                                                    <button
                                                        onClick={() => handleOpenModal('feedback', feedbacks, item.user.name)}
                                                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors cursor-pointer"
                                                    >
                                                        <MessageSquare className="w-3 h-3" />
                                                        {feedbacks.length} feedback{feedbacks.length !== 1 ? 's' : ''}
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-gray-400 dark:text-gray-500">No feedbacks</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <AlertCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                                            <p className="text-gray-500 dark:text-gray-400 font-medium">No first timers found</p>
                                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                                                {searchQuery ? "Try adjusting your search" : "No first timer data available"}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 0 && (
                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} results
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-sm text-gray-500 dark:text-gray-400">Show:</label>
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                    className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
                                >
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-1"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Previous
                            </button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${currentPage === pageNum
                                                ? 'bg-purple-600 text-white'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-1"
                            >
                                Next
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </Animated>

            {/* Modals */}
            {selectedModal?.type === 'feedback' && (
                <FirstTimerFeedbackModal
                    isOpen={true}
                    onClose={handleCloseModal}
                    feedbacks={selectedModal.data}
                    memberName={selectedModal.memberName}
                />
            )}

            {selectedModal?.type === 'history' && (
                <AttendanceHistoryModal
                    isOpen={true}
                    onClose={handleCloseModal}
                    attendanceHistory={selectedModal.data}
                    memberName={selectedModal.memberName}
                />
            )}
        </>
    );
};

// ==================== SHARE BUTTON ====================
const ShareButton = ({ selectedDate, selectedServiceName }) => {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const url = window.location.href;
        const shareText = selectedDate && selectedServiceName
            ? `Attendance Report - ${selectedServiceName} (${dayjs(selectedDate).format('MMM DD, YYYY')})`
            : 'Attendance Report';

        if (navigator.share) {
            try {
                await navigator.share({
                    title: shareText,
                    url: url
                });
            } catch (err) {
                if (err.name !== 'AbortError') {
                    copyToClipboard();
                }
            }
        } else {
            copyToClipboard();
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
            {copied ? (
                <>
                    <Check className="w-4 h-4" />
                    Copied!
                </>
            ) : (
                <>
                    <Share2 className="w-4 h-4" />
                    Share Report
                </>
            )}
        </button>
    );
};

// ==================== MAIN COMPONENT ====================
const AdminAttendanceReportPage = () => {
    const { data: services = [], isLoading: servicesLoading } = useServices();
    const [searchParams, setSearchParams] = useSearchParams();

    const urlServiceId = searchParams.get('service_id');
    const urlAttendanceDate = searchParams.get('attendance_date');

    const [selectedDate, setSelectedDate] = useState(urlAttendanceDate || null);
    const [selectedServiceId, setSelectedServiceId] = useState(urlServiceId || null);

    const queryParams = useMemo(() => {
        const params = {};
        if (selectedServiceId) params.service_id = selectedServiceId;
        if (selectedDate) params.attendance_date = selectedDate;
        return params;
    }, [selectedServiceId, selectedDate]);

    const { data, isLoading, isError } = useAttendanceReport(queryParams, {
        enabled: !!(selectedServiceId && selectedDate)
    });

    const handleDateChange = useCallback((date) => {
        if (!date) {
            setSelectedDate(null);
            setSelectedServiceId(null);
            return;
        }

        const formattedDate = date.format("YYYY-MM-DD");
        setSelectedDate(formattedDate);

        const matchedServiceId = getMatchingServiceId(services, formattedDate);
        if (matchedServiceId) {
            setSelectedServiceId(matchedServiceId.toString());
        } else {
            setSelectedServiceId(null);
        }
    }, [services]);

    useEffect(() => {
        const params = new URLSearchParams();
        if (selectedServiceId) params.set('service_id', selectedServiceId);
        if (selectedDate) params.set('attendance_date', selectedDate);

        setSearchParams(params, { replace: true });
    }, [selectedServiceId, selectedDate, setSearchParams]);

    const handleClearFilters = useCallback(() => {
        setSelectedDate(null);
        setSelectedServiceId(null);
        setSearchParams({}, { replace: true });
    }, [setSearchParams]);

    const reportData = data || null;
    const hasData = reportData !== null;
    const hasFilters = !!(selectedDate && selectedServiceId);

    const selectedServiceName = useMemo(() => {
        if (!selectedServiceId || !services.length) return null;
        const service = services.find(s => s.id.toString() === selectedServiceId);
        return service?.name || null;
    }, [selectedServiceId, services]);

    const statistics = useMemo(() => {
        if (!reportData) return null;

        return {
            members: {
                total: reportData.members_statistics?.total_members || 0,
                total_marked_attendance: reportData.members_statistics?.total_marked_attendance || 0,
                present: reportData.members_statistics?.total_present || 0,
                absent: reportData.members_statistics?.total_absent || 0,
                rate: reportData.members_statistics?.attendance_rate || 0,
                onsite: reportData.members_statistics?.mode_breakdown?.onsite || 0,
                online: reportData.members_statistics?.mode_breakdown?.online || 0,
            },
            usher: {
                male: reportData.usher_count?.male || 0,
                female: reportData.usher_count?.female || 0,
                children: reportData.usher_count?.children || 0,
                total: reportData.usher_count?.total || 0,
            }
        };
    }, [reportData]);

    return (
        <>
            <PageMeta title="Admin: Attendance Report | GCCC Ibadan" />
            <PageBreadcrumb
                icon={AdminIcon}
                pageTitle="Attendance Report"
                description="View detailed attendance statistics, member information, and follow-up activities for your services"
            />

            <ComponentCard>
                <div className="w-full mx-auto">
                    {/* Header with Share Button */}
                    <Animated animation="fade-down">
                        <div className="mb-8 flex items-center gap-5">
                            {hasData && (
                                <ShareButton
                                    selectedDate={selectedDate}
                                    selectedServiceName={selectedServiceName}
                                />
                            )}
                            <Button variant="outline" href={'/dashboard/admin/attendance'}>Attendance</Button>
                        </div>
                    </Animated>

                    {/* Filter Section */}
                    <Animated animation="fade-up" className="mb-8">
                        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center">
                                            <FileText className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-semibold text-white">
                                                Select Report Date
                                            </h2>
                                            <p className="text-xs text-blue-100">
                                                Choose a date to generate attendance report
                                            </p>
                                        </div>
                                    </div>
                                    {hasFilters && (
                                        <button
                                            onClick={handleClearFilters}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Clear
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="max-w-md mx-auto">
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Service Date
                                        </label>
                                        <DatePicker
                                            containerStyle={{ width: "100%" }}
                                            format="YYYY-MM-DD"
                                            value={selectedDate || ""}
                                            onChange={handleDateChange}
                                            placeholder="Click to select a date"
                                            disabled={isLoading}
                                            className="w-full"
                                            inputClass="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium focus:outline-none  bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all"
                                        />

                                        {selectedDate && servicesLoading && (
                                            <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-700 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        Finding service for selected date...
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {selectedDate && !servicesLoading && selectedServiceName && (
                                            <div className="mt-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                                <div className="flex items-start gap-3">
                                                    <div className="flex-shrink-0">
                                                        <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                            {dayjs(selectedDate).format('dddd, MMMM DD, YYYY')}
                                                        </p>
                                                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                                                            Service: <span className="font-semibold">{selectedServiceName}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {selectedDate && !servicesLoading && !selectedServiceName && (
                                            <div className="mt-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                                                <div className="flex items-start gap-3">
                                                    <div className="flex-shrink-0">
                                                        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                                                            No service found for {dayjs(selectedDate).format('dddd, MMMM DD, YYYY')}
                                                        </p>
                                                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                                                            Please select a different date
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Animated>

                    {/* Content */}
                    {isLoading ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <StatCardSkeleton key={i} />
                                ))}
                            </div>
                            <TableSkeleton />
                            <TableSkeleton />
                        </div>
                    ) : isError ? (
                        <Animated animation="fade-up">
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
                                <XCircle className="w-12 h-12 text-red-400 dark:text-red-500 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
                                    Error Loading Report
                                </h3>
                                <p className="text-red-600 dark:text-red-400">
                                    Failed to load attendance data. Please try again.
                                </p>
                            </div>
                        </Animated>
                    ) : !hasData ? (
                        <Animated animation="fade-up">
                            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-12 text-center">
                                <div className="flex flex-col items-center justify-center">
                                    <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
                                        <FileText className="w-10 h-10 text-blue-500 dark:text-blue-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                        {!selectedDate || !selectedServiceId ? 'Select Date and Service' : 'No Report Data'}
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 max-w-md">
                                        {!selectedDate || !selectedServiceId
                                            ? 'Please select both a service date and service to view the attendance report.'
                                            : 'No attendance data found for the selected date and service.'}
                                    </p>
                                </div>
                            </div>
                        </Animated>
                    ) : (
                        <div className="space-y-8">
                            {/* Service Info Banner */}
                            <Animated animation="fade-up">
                                <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-lg p-6 text-white shadow-lg">
                                    <div className="flex items-center justify-between flex-wrap gap-4">
                                        <div>
                                            <h2 className="text-2xl font-bold mb-1">
                                                {reportData.service?.name}
                                            </h2>
                                            <p className="text-blue-100">
                                                {dayjs(reportData.attendance_date).format('dddd, MMMM DD, YYYY')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Animated>

                            {/* Attendance by Ushers */}
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                    Attendance by Ushers
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <StatCard
                                        title="Total Count"
                                        value={statistics.usher.total}
                                        subtitle="Total attendance count"
                                        color="blue"
                                        icon={Users}
                                    />
                                    <StatCard
                                        title="Male"
                                        value={statistics.usher.male}
                                        subtitle="Male attendees"
                                        color="blue"
                                        icon={Users2}
                                    />
                                    <StatCard
                                        title="Female"
                                        value={statistics.usher.female}
                                        subtitle="Female attendees"
                                        color="purple"
                                        icon={User2Icon}
                                    />
                                    <StatCard
                                        title="Children"
                                        value={statistics.usher.children}
                                        subtitle="Child attendees"
                                        color="amber"
                                        icon={User2}
                                    />
                                </div>
                            </div>

                            {/* Members Statistics */}
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                    Members Statistics
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <StatCard
                                        title="Total Members"
                                        value={statistics.members.total}
                                        subtitle={`Total marked attendance - (${statistics.members.total_marked_attendance})`}
                                        color="blue"
                                        icon={Users}
                                    />
                                    <StatCard
                                        title="Present"
                                        value={statistics.members.present}
                                        subtitle={`${statistics.members.rate.toFixed(1)}% attendance rate`}
                                        color="green"
                                        icon={CheckCircle2}
                                    />
                                    <StatCard
                                        title="Absent"
                                        value={statistics.members.absent}
                                        subtitle="Members not present"
                                        color="red"
                                        icon={XCircle}
                                    />
                                    <StatCard
                                        title="Attendance Mode"
                                        value={`${statistics.members.onsite}/${statistics.members.online}`}
                                        subtitle="Onsite / Online"
                                        color="purple"
                                        icon={BarChart3}
                                    />
                                </div>
                            </div>

                            {/* Members Attendance Table */}
                            <div>
                                <MembersAttendanceTable
                                    data={reportData.members_attendance || []}
                                    serviceDate={reportData.attendance_date}
                                />
                            </div>

                            {/* First Timers Attendance Table */}
                            <div>
                                <FirstTimersTable
                                    data={reportData.first_timers || []}
                                />
                            </div>

                        </div>
                    )}
                </div>
            </ComponentCard>
        </>
    );
};

export default AdminAttendanceReportPage;