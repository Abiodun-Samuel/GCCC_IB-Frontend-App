import { AgGridReact } from 'ag-grid-react';
import { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { Link } from "react-router-dom";
import { useFirstTimers } from '@/queries/firstTimer.query';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Message from '@/components/common/Message';
import { TableSkeletonLoader } from '@/components/skeleton';
import { ExpandFullScreenIcon, FilterIcon } from '@/icons';
import ButtonSwitch from '@/components/ui/ButtonSwitch';
import FirstTimerFilterPanel from '@/components/admin/firsttimer/FirstTimerFilterPanel';
import Avatar from '@/components/ui/Avatar';
import { Calendar, CheckCircle2, Clock, History, User, X, XCircle } from 'lucide-react';
import dayjs from 'dayjs';

ModuleRegistry.registerModules([AllCommunityModule]);

// ============================================================================
// CONSTANTS
// ============================================================================
const PAGINATION_PAGE_SIZES = [25, 50, 100, 200];
const DEFAULT_PAGE_SIZE = 200;
const MIN_TABLE_HEIGHT = 400;
const MAX_TABLE_HEIGHT = 1000;
const ROW_HEIGHT = 52;
const HEADER_HEIGHT = 56;
const PAGINATION_HEIGHT = 60;

const DEFAULT_FILTERS = {
    week_ending: null,
    date_of_visit: null,
    date_month_of_visit: null,
    assigned_to_member: null,
    follow_up_status: null
};

// ============================================================================
// CELL RENDERERS
// ============================================================================

/**
 * Avatar and Name combined cell renderer
 */
const AvatarNameRenderer = ({ data }) => {
    if (!data) return null;

    const avatarUrl = data.avatar || data.secondary_avatar;
    const initials = data.initials ||
        data.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

    return (
        <Link
            to={`/dashboard/first-timers/${data.id}`}
            target="_blank"
            className="flex items-center gap-3 group hover:bg-gray-50 dark:hover:bg-gray-700/50 px-2 rounded-md transition-all"
            rel="noopener noreferrer"
        >
            <div className="shrink-0 flex items-center">
                <Avatar
                    size="xs"
                    src={avatarUrl}
                    name={initials}
                    alt={data.full_name}
                />
            </div>
            <div className="flex flex-col min-w-0">
                <span className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                    {data.full_name}
                </span>
            </div>
        </Link>
    );
};

/**
 * Email cell renderer with mailto link
 */
const EmailRenderer = ({ value }) => {
    if (!value) return null;
    return (
        <a
            href={`mailto:${value}`}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors truncate"
            onClick={(e) => e.stopPropagation()}
        >
            {value}
        </a>
    );
};

/**
 * Generic badge renderer for status fields
 */
const BadgeRenderer = ({ value }) => {
    if (!value || typeof value !== 'object') return null;
    return <Badge color={value?.color}>{value?.title}</Badge>;
};

/**
 * Gender badge renderer with color coding
 */
const GenderRenderer = ({ value }) => {
    if (!value) return null;

    const color = value.toLowerCase() === 'male'
        ? 'blue'
        : value.toLowerCase() === 'female'
            ? 'pink'
            : 'gray';

    const colorClasses = {
        blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
        pink: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
        gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[color]}`}>
            {value}
        </span>
    );
};

/**
 * Born Again status renderer
 */
const BornAgainRenderer = ({ value }) => {
    if (!value) return null;

    const getBadgeStyle = (val) => {
        const lowerVal = val.toLowerCase();
        if (lowerVal === 'yes') return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
        if (lowerVal === 'no') return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeStyle(value)}`}>
            {value}
        </span>
    );
};

/**
 * Phone number renderer with tel link
 */
const ContactRenderer = ({ value }) => {
    if (!value) return null;
    return (
        <a
            href={`tel:${value}`}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            onClick={(e) => e.stopPropagation()}
        >
            {value}
        </a>
    );
};

/**
 * Member name link renderer
 */
const MemberNameRenderer = ({ value }) => {
    console.log({ value })
    if (!value || typeof value !== 'object' || !value.id) {
        return <span className="text-gray-400">Unassigned</span>;
    }

    return (
        <Link
            to={`/dashboard/members/${value.id}`}
            target="_blank"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline transition-colors"
            rel="noopener noreferrer"
        >
            {value.full_name || 'N/A'}
        </Link>
    );
};

/**
 * Yes/No boolean renderer
 */
const YesNoRenderer = ({ value }) => {
    return <span className="text-sm">{value ? 'Yes' : 'No'}</span>;
};

/**
 * WhatsApp Interest renderer with color coding
 */
const WhatsAppInterestRenderer = ({ value }) => {
    const isInterested = value === true || value === 'true';
    const colorClasses = isInterested
        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    const text = isInterested ? 'Interested' : 'Not Interested';

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses}`}>
            {text}
        </span>
    );
};

/**
 * Attendance count renderer with modal trigger
 */
const AttendanceCountRenderer = ({ data, onOpenModal }) => {
    if (!data || !data.attendances) return <span className="text-gray-400">0</span>;

    const count = data.attendances.length;

    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                onOpenModal(data);
            }}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors cursor-pointer"
        >
            {count} {count === 1 ? 'Visit' : 'Visits'}
        </button>
    );
};

// ============================================================================
// ATTENDANCE MODAL COMPONENT
// ============================================================================

/**
 * Modal component for displaying attendance history
 */
const AttendanceModal = ({ open, data, onClose }) => {
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [open]);

    if (!open || !data) return null;

    const attendances = data.attendances || [];

    return (
        <div
            className="fixed inset-0 z-[9999] overflow-y-auto"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
        >
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div
                    className="fixed inset-0 bg-gray-900/75 dark:bg-gray-950/90 backdrop-blur-sm transition-opacity z-[9998]"
                    aria-hidden="true"
                    onClick={onClose}
                />

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                    &#8203;
                </span>

                <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full z-[9999] relative">
                    {/* Modal Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-700 dark:to-blue-700 px-6 py-5">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-white" id="modal-title">
                                    Attendance History
                                </h3>
                                <p className="text-sm text-purple-100 dark:text-purple-200 mt-1 flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    {data.full_name} - {attendances.length} {attendances.length === 1 ? 'record' : 'records'}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="ml-4 rounded-lg p-1.5 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                                aria-label="Close modal"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Modal Body */}
                    <div className="bg-white dark:bg-gray-800 px-6 py-6 max-h-[60vh] overflow-y-auto">
                        {attendances.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <History className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                                </div>
                                <p className="text-gray-500 dark:text-gray-400 font-medium">No attendance history</p>
                                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">This is their first visit</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {attendances.map((record) => (
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

                    {/* Modal Footer */}
                    <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {attendances.length} {attendances.length === 1 ? 'visit' : 'visits'} recorded
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

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const AdminFirstTimersTable = () => {
    // ========================================================================
    // STATE & REFS
    // ========================================================================
    const gridRef = useRef(null);
    const [isGridReady, setIsGridReady] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [activeFilters, setActiveFilters] = useState(DEFAULT_FILTERS);
    const [attendanceModal, setAttendanceModal] = useState({ open: false, data: null });

    // ========================================================================
    // DATA FETCHING
    // ========================================================================
    const {
        data: firstTimers,
        isLoading,
        refetch,
        isError,
        error,
        isFetching
    } = useFirstTimers(activeFilters);

    // ========================================================================
    // MEMOIZED DATA
    // ========================================================================
    const firstTimersData = useMemo(() => {
        if (!firstTimers) return [];
        return Array.isArray(firstTimers) ? firstTimers : [];
    }, [firstTimers]);

    const tableHeight = useMemo(() => {
        if (firstTimersData.length === 0) return MIN_TABLE_HEIGHT;
        const contentHeight = (firstTimersData.length * ROW_HEIGHT) + HEADER_HEIGHT + PAGINATION_HEIGHT;
        return Math.min(Math.max(contentHeight, MIN_TABLE_HEIGHT), MAX_TABLE_HEIGHT);
    }, [firstTimersData.length]);

    const hasActiveFilters = useMemo(() =>
        Object.values(activeFilters).some(value => value !== null),
        [activeFilters]);

    // ========================================================================
    // DATE FORMATTERS
    // ========================================================================
    const birthDateFormatter = useCallback((params) => {
        if (!params.value) return '';
        const date = new Date(params.value);
        if (isNaN(date.getTime())) return params.value;
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    }, []);

    const dateValueFormatter = useCallback((params) => {
        if (!params.value) return '';
        const date = new Date(params.value);
        if (isNaN(date.getTime())) return params.value;
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }, []);

    // ========================================================================
    // COLUMN DEFINITIONS
    // ========================================================================
    const defaultColDef = useMemo(() => ({
        sortable: true,
        resizable: true,
        suppressPaste: false,
        floatingFilter: true,
        editable: false,
        minWidth: 100,
        autoHeaderHeight: true,
        wrapHeaderText: true,
    }), []);

    const columnDefs = useMemo(() => [
        {
            field: "id",
            headerName: "S/N",
            cellClass: 'font-medium',
            width: 80,
            maxWidth: 100,
            filter: false, // Removed filter
            floatingFilter: false,
        },
        {
            pinned: 'left',
            field: "full_name",
            headerName: "Full Name",
            cellRenderer: AvatarNameRenderer,
            cellClass: 'font-medium',
            width: 280,
            minWidth: 250,
            filter: 'agTextColumnFilter',
            filterParams: {
                filterOptions: ['contains', 'notContains', 'equals', 'notEqual', 'startsWith', 'endsWith'],
                defaultOption: 'contains',
                suppressAndOrCondition: true,
            },
        },
        {
            field: "follow_up_status",
            headerName: "Follow-up Status",
            cellRenderer: BadgeRenderer,
            filter: false,
            width: 180,
            filterParams: {
                valueGetter: (params) => params.data?.follow_up_status?.title || 'Unassigned',
                comparator: (a, b) => {
                    if (a === b) return 0;
                    if (a === null || a === undefined) return -1;
                    if (b === null || b === undefined) return 1;
                    return a.localeCompare(b);
                },
            },
        },
        {
            field: "email",
            headerName: "Email",
            cellRenderer: EmailRenderer,
            width: 220,
            filter: 'agTextColumnFilter',
            filterParams: {
                filterOptions: ['contains', 'notContains', 'equals', 'notEqual'],
                defaultOption: 'contains',
            },
        },
        {
            field: "phone_number",
            headerName: "Phone",
            cellRenderer: ContactRenderer,
            width: 180,
            filter: 'agTextColumnFilter',
            filterParams: {
                filterOptions: ['contains', 'equals'],
                defaultOption: 'contains',
            },
        },
        {
            field: "gender",
            headerName: "Gender",
            cellRenderer: GenderRenderer,
            width: 110,
            filter: false,
            floatingFilter: false,
        },
        {
            field: "date_of_visit",
            headerName: "Visit Date",
            valueFormatter: dateValueFormatter,
            width: 130,
            filter: 'agDateColumnFilter',
            filterParams: {
                comparator: (filterDate, cellValue) => {
                    if (!cellValue) return -1;
                    const cellDate = new Date(cellValue);
                    if (cellDate < filterDate) return -1;
                    if (cellDate > filterDate) return 1;
                    return 0;
                },
            },
        },
        {
            field: "date_of_birth",
            headerName: "Birth Date",
            valueFormatter: birthDateFormatter,
            width: 120,
            filter: 'agDateColumnFilter',
        },
        {
            field: "whatsapp_interest",
            headerName: "WhatsApp Interest",
            cellRenderer: WhatsAppInterestRenderer,
            width: 160,
            filter: false,
            floatingFilter: false,
        },
        {
            field: "located_in_ibadan",
            headerName: "Resides in Ibadan",
            cellRenderer: YesNoRenderer,
            width: 160,
            filter: false,
            floatingFilter: false,
        },
        {
            field: "is_student",
            headerName: "Is Student",
            cellRenderer: YesNoRenderer,
            width: 120,
        },
        {
            field: "attendances",
            headerName: "Attendance",
            cellRenderer: (params) => (
                <AttendanceCountRenderer
                    {...params}
                    onOpenModal={(data) => setAttendanceModal({ open: true, data })}
                />
            ),
            width: 130,
            sortable: true,
            filter: false,
            floatingFilter: false,
            comparator: (valueA, valueB) => {
                const countA = valueA?.length || 0;
                const countB = valueB?.length || 0;
                return countA - countB;
            },
        },
        {
            field: "invited_by",
            headerName: "Invited By",
            width: 150,
            filter: 'agTextColumnFilter',
            filterParams: {
                filterOptions: ['contains', 'equals'],
                defaultOption: 'contains',
            },
        },
        {
            field: "how_did_you_learn",
            headerName: "How They Heard",
            width: 170,
            filter: 'agTextColumnFilter',
            filterParams: {
                filterOptions: ['contains', 'equals'],
                defaultOption: 'contains',
            },
        },
        {
            field: "born_again",
            headerName: "Born Again",
            cellRenderer: BornAgainRenderer,
            width: 140,
        },
        {
            field: "assigned_to_member",
            headerName: "Assigned To",
            cellRenderer: MemberNameRenderer,
            width: 180,
            valueGetter: (params) => {
                const member = params.data?.assigned_to_member;
                return member;
            },
        },
        {
            field: "membership_interest",
            headerName: "Membership Interest",
            width: 180,
            filter: 'agTextColumnFilter',
            filterParams: {
                values: ['Yes', 'No', 'Maybe'],
                suppressMiniFilter: true,
            },
        },
        {
            field: "occupation",
            headerName: "Occupation",
            width: 180,
            filter: false, // Removed filter
            floatingFilter: false,
        },
        {
            field: "address",
            headerName: "Address",
            width: 250,
            filter: false, // Removed filter
            floatingFilter: false,
            cellClass: 'text-wrap',
            autoHeight: true,
        },
        {
            field: "week_ending",
            headerName: "Week Ending",
            valueFormatter: dateValueFormatter,
            width: 130,
            filter: 'agDateColumnFilter',
        },
        {
            field: "created_at",
            headerName: "Created",
            valueFormatter: dateValueFormatter,
            width: 130,
            filter: false, // Removed filter
            floatingFilter: false,
        },
    ], [dateValueFormatter, birthDateFormatter]);

    // ========================================================================
    // GRID OPTIONS
    // ========================================================================
    const gridOptions = useMemo(() => ({
        pagination: true,
        paginationPageSize: DEFAULT_PAGE_SIZE,
        paginationPageSizeSelector: PAGINATION_PAGE_SIZES,
        suppressDragLeaveHidesColumns: true,
        animateRows: true,
        suppressCellFocus: false,
        suppressColumnVirtualisation: false,
        suppressRowVirtualisation: false,
        suppressHorizontalScroll: false,
        alwaysShowHorizontalScroll: false,
        rowSelection: 'multiple',
        suppressRowDeselection: false,
        rowMultiSelectWithClick: true,
        enableFillHandle: true,
        enableCellTextSelection: true,
        ensureDomOrder: true,
        stopEditingWhenCellsLoseFocus: true,
        getRowId: (params) => params.data.id,
    }), []);

    // ========================================================================
    // EVENT HANDLERS
    // ========================================================================
    const autoSizeColumns = useCallback(() => {
        if (!gridRef.current) return;

        const allColumns = gridRef.current.getColumns?.() || gridRef.current.getAllDisplayedColumns?.();
        if (!allColumns || allColumns.length === 0) return;

        const allColumnIds = allColumns.map(col => col.getColId());
        gridRef.current.autoSizeColumns(allColumnIds, false);
    }, []);

    const onGridReady = useCallback((params) => {
        gridRef.current = params.api;
        setIsGridReady(true);
        setTimeout(() => autoSizeColumns(), 100);
    }, [autoSizeColumns]);

    const handleExportCSV = useCallback(() => {
        if (!gridRef.current) return;
        const timestamp = new Date().toISOString().split('T')[0];
        gridRef.current.exportDataAsCsv({
            fileName: `first-timers-report-${timestamp}.csv`,
        });
    }, []);

    const handleRefresh = useCallback(() => {
        refetch();
    }, [refetch]);

    const handleApplyFilters = useCallback((filters) => {
        setActiveFilters(filters);
    }, []);

    const handleResetFilters = useCallback((filters) => {
        setActiveFilters(filters);
    }, []);

    const handleToggleFilter = useCallback(() => {
        if (showFilter) {
            setActiveFilters(DEFAULT_FILTERS);
        }
        setShowFilter(!showFilter);
    }, [showFilter]);

    // ========================================================================
    // EFFECTS
    // ========================================================================
    useEffect(() => {
        if (isGridReady && firstTimersData.length > 0) {
            setTimeout(() => autoSizeColumns(), 150);
        }
    }, [firstTimersData, isGridReady, autoSizeColumns]);

    // ========================================================================
    // ERROR STATE
    // ========================================================================
    if (isError) {
        return (
            <Message
                className="max-w-md"
                variant="error"
                data={error?.data}
                actionButton={
                    <Button
                        variant="outline-danger"
                        onClick={handleRefresh}
                        className="mt-2"
                        loading={isFetching}
                    >
                        Retry
                    </Button>
                }
            />
        );
    }

    // ========================================================================
    // RENDER
    // ========================================================================
    return (
        <div className="w-full space-y-10 bg-gray-50 dark:bg-gray-900">
            {/* Filter Toggle */}
            <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
                <ButtonSwitch
                    onChange={handleToggleFilter}
                    checked={showFilter}
                    color="pink"
                    type="button"
                    icon={<FilterIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
                    description="Filter first timer's data"
                >
                    Filter
                </ButtonSwitch>
            </div>

            {/* Filter Panel */}
            {showFilter && (
                <div className="w-full max-w-3xl p-4 dark:bg-gray-800 bg-white shadow rounded-lg">
                    <FirstTimerFilterPanel
                        initialFilters={activeFilters}
                        onApply={handleApplyFilters}
                        onReset={handleResetFilters}
                        loading={isFetching}
                    />
                </div>
            )}

            {/* Table Section */}
            <div className="space-y-3">
                {/* Header Info */}
                <div className="flex items-center gap-5 flex-wrap">
                    <p className="text-sm text-green-600 dark:text-green-400">
                        <span className="font-semibold text-green-500 dark:text-green-500">
                            {firstTimersData.length}
                        </span>
                        {' '}Record{firstTimersData.length !== 1 ? 's' : ''} found
                    </p>

                    {hasActiveFilters && (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
                            Filtered
                        </span>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 justify-between w-full">
                    <div className="flex flex-wrap gap-3">
                        <Button
                            variant="primary"
                            onClick={handleExportCSV}
                            disabled={!firstTimersData.length || isLoading}
                        >
                            Export CSV
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={handleRefresh}
                            loading={isFetching}
                            disabled={isLoading}
                        >
                            Refresh
                        </Button>
                    </div>
                    <div>
                        <Button
                            variant="light"
                            onClick={autoSizeColumns}
                            disabled={!firstTimersData.length || isLoading}
                        >
                            <ExpandFullScreenIcon className="h-4 w-4 md:h-5 md:w-5" />
                        </Button>
                    </div>
                </div>

                {/* Table or Loading State */}
                {isLoading && !firstTimersData.length ? (
                    <TableSkeletonLoader />
                ) : (
                    <>
                        {/* AG Grid Table */}
                        <div
                            className="ag-theme-alpine border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden transition-colors"
                            style={{ width: "100%", height: `${tableHeight}px` }}
                        >
                            <AgGridReact
                                ref={gridRef}
                                defaultColDef={defaultColDef}
                                columnDefs={columnDefs}
                                rowData={firstTimersData}
                                gridOptions={gridOptions}
                                onGridReady={onGridReady}
                                suppressLoadingOverlay={false}
                                suppressNoRowsOverlay={false}
                                overlayLoadingTemplate={`
                                    <div class="flex items-center justify-center h-full">
                                        <div class="text-center">
                                            <div class="relative inline-block">
                                                <div class="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
                                                <div class="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
                                            </div>
                                            <p class="text-gray-700 mt-4 font-medium">Loading first timers...</p>
                                        </div>
                                    </div>
                                `}
                                overlayNoRowsTemplate={`
                                    <div class="flex items-center justify-center h-full bg-white">
                                        <div class="text-center py-8">
                                            <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            <p class="text-gray-500 text-lg font-medium mb-2">
                                                No first timers found
                                            </p>
                                            <p class="text-gray-400 text-sm">
                                                First timers will appear here once available
                                            </p>
                                        </div>
                                    </div>
                                `}
                            />
                        </div>

                        {/* Footer */}
                        {firstTimersData.length > 0 && (
                            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 flex justify-between items-center">
                                <span>Last updated: {new Date().toLocaleString()}</span>
                                <div className="flex items-center gap-2">
                                    <span className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse" />
                                        <span className="text-green-600 dark:text-green-400 font-medium">Live data</span>
                                    </span>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Attendance Modal */}
            <AttendanceModal
                open={attendanceModal.open}
                data={attendanceModal.data}
                onClose={() => setAttendanceModal({ open: false, data: null })}
            />
        </div>
    );
};

export default AdminFirstTimersTable;