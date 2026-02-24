import { AgGridReact } from 'ag-grid-react';
import { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Button from '@/components/ui/Button';
import Message from '@/components/common/Message';
import { TableSkeletonLoader } from '@/components/skeleton';
import { ExpandFullScreenIcon, TrashIcon, EditIcon } from '@/icons';
import {
  useAttendanceRecords,
  useDeleteAttendanceRecords,
} from '@/queries/attendancerecord.query';
import CreateAttendanceRecord from './CreateAttendanceRecord';
import EditAttendanceRecord from './EditAttendanceRecord';
import { useModal } from '@/hooks/useModal';
import DeleteConfirmationModal from '@/components/ui/modal/DeleteConfirmationModal';
import { usePermission } from '@/hooks/usePermission';
import { PERMISSIONS } from '@/utils/permissions';

ModuleRegistry.registerModules([AllCommunityModule]);

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGINATION_PAGE_SIZES = [25, 50, 100, 200];
const DEFAULT_PAGE_SIZE = 100;
const MIN_TABLE_HEIGHT = 400;
const MAX_TABLE_HEIGHT = 800;
const ROW_HEIGHT = 42;
const HEADER_HEIGHT = 56;
const PAGINATION_HEIGHT = 60;

/** Deterministic colour palette for up to 10 service days */
const SERVICE_DAY_COLORS = {
  sunday: '#4f86c6',
  tuesday: '#e07b4a',
  friday: '#5cb87a',
  saturday: '#a67cc5',
  monday: '#e6b840',
  wednesday: '#e05a7a',
  thursday: '#3bbfbf',
};

const DEFAULT_COLOR = '#94a3b8';

function getColor(serviceDay) {
  return SERVICE_DAY_COLORS[(serviceDay ?? '').toLowerCase()] ?? DEFAULT_COLOR;
}

// ─── Chart Tooltip ───────────────────────────────────────────────────────────

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-3 min-w-[160px]">
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
        {label}
      </p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center justify-between gap-4 py-0.5">
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block w-2.5 h-2.5 rounded-sm flex-shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-gray-600 dark:text-gray-300 capitalize">
              {entry.name}
            </span>
          </div>
          <span className="text-xs font-bold text-gray-900 dark:text-white">
            {entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Attendance Chart ─────────────────────────────────────────────────────────

const AttendanceChart = ({ chartData }) => {
  const currentYear = new Date().getFullYear();

  // derive available years from data shape (chart only returns one year; extend if you pass multi-year)
  const availableYears = useMemo(() => {
    const y = chartData?.year ?? currentYear;
    // show current year and 2 previous so users can switch via ?year param in future
    return [y - 2, y - 1, y].filter((yr) => yr > 2000);
  }, [chartData, currentYear]);

  const [selectedYear, setSelectedYear] = useState(chartData?.year ?? currentYear);
  const [metric, setMetric] = useState('total'); // 'total' | 'average'
  const [activeDays, setActiveDays] = useState(null); // null = all enabled

  // series from API
  const series = useMemo(() => chartData?.series ?? [], [chartData]);

  // unique service days from series
  const serviceDays = useMemo(
    () => series.map((s) => ({ key: s.service_day, label: s.service_day, desc: s.service_day_desc })),
    [series]
  );

  // initialise activeDays once series loads
  useEffect(() => {
    if (series.length && activeDays === null) {
      setActiveDays(new Set(series.map((s) => s.service_day)));
    }
  }, [series, activeDays]);

  const toggleDay = useCallback((day) => {
    setActiveDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) {
        if (next.size === 1) return prev; // keep at least one
        next.delete(day);
      } else {
        next.add(day);
      }
      return next;
    });
  }, []);

  // transform series → recharts-friendly [{month, Sunday, Tuesday, Friday, …}]
  const chartRows = useMemo(() => {
    if (!series.length) return [];
    const months = series[0].monthly_data;
    return months.map((m) => {
      const row = { month: m.month, month_number: m.month_number };
      series.forEach((s) => {
        const monthEntry = s.monthly_data.find((md) => md.month_number === m.month_number);
        if (monthEntry) {
          row[s.service_day] =
            metric === 'total'
              ? monthEntry.total_attendance
              : Math.round(monthEntry.average_attendance);
        }
      });
      return row;
    });
  }, [series, metric]);

  // summary stats
  const stats = useMemo(() => {
    if (!series.length) return [];
    return series
      .filter((s) => !activeDays || activeDays.has(s.service_day))
      .map((s) => {
        const total = s.monthly_data.reduce((acc, m) => acc + m.total_attendance, 0);
        const sessions = s.monthly_data.reduce((acc, m) => acc + m.services_count, 0);
        const avg = sessions > 0 ? Math.round(total / sessions) : 0;
        return { day: s.service_day, desc: s.service_day_desc, total, sessions, avg };
      });
  }, [series, activeDays]);

  if (!series.length) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 dark:text-gray-500 text-sm">
        No chart data available for {selectedYear}.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ── Header row ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            Service Attendance Trends
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Monthly breakdown by service day — {selectedYear}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Metric toggle */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5 text-xs font-medium">
            <button
              onClick={() => setMetric('total')}
              className={`px-3 py-1.5 rounded-md transition-all ${metric === 'total'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
            >
              Total
            </button>
            <button
              onClick={() => setMetric('average')}
              className={`px-3 py-1.5 rounded-md transition-all ${metric === 'average'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
            >
              Average
            </button>
          </div>

          {/* Year selector */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="text-xs border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {availableYears.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Service day filter pills ── */}
      <div className="flex flex-wrap gap-2">
        {serviceDays.map(({ key, label }) => {
          const isActive = !activeDays || activeDays.has(key);
          const color = getColor(key);
          return (
            <button
              key={key}
              onClick={() => toggleDay(key)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all ${isActive
                ? 'text-white border-transparent shadow-sm'
                : 'bg-transparent text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700'
                }`}
              style={isActive ? { backgroundColor: color, borderColor: color } : {}}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: isActive ? '#fff' : color }}
              />
              {label}
            </button>
          );
        })}
      </div>

      {/* ── Summary stat cards ── */}
      {stats.length > 0 && (
        <div className={`grid gap-3 ${stats.length <= 2 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'}`}>
          {stats.map(({ day, desc, total, sessions, avg }) => (
            <div
              key={day}
              className="relative overflow-hidden rounded-xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800/60 p-4"
            >
              {/* left accent bar */}
              <span
                className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
                style={{ backgroundColor: getColor(day) }}
              />
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1 pl-1">
                {day}
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white pl-1">
                {total.toLocaleString()}
              </p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 pl-1 mt-0.5">
                {sessions} service{sessions !== 1 ? 's' : ''} · avg {avg}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ── Bar chart ── */}
      <div className="rounded-xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800/60 p-4">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={chartRows}
            margin={{ top: 4, right: 4, left: -8, bottom: 0 }}
            barCategoryGap="25%"
            barGap={3}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(148,163,184,0.15)"
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: 'currentColor' }}
              axisLine={false}
              tickLine={false}
              className="text-gray-500 dark:text-gray-400"
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'currentColor' }}
              axisLine={false}
              tickLine={false}
              className="text-gray-500 dark:text-gray-400"
              tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v)}
            />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ fill: 'rgba(148,163,184,0.08)' }}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 16 }}
              iconType="square"
              iconSize={10}
              formatter={(value) => (
                <span className="capitalize text-gray-600 dark:text-gray-300">{value}</span>
              )}
            />
            {series
              .filter((s) => !activeDays || activeDays.has(s.service_day))
              .map((s) => (
                <Bar
                  key={s.service_day}
                  dataKey={s.service_day}
                  name={s.service_day}
                  fill={getColor(s.service_day)}
                  radius={[3, 3, 0, 0]}
                  maxBarSize={32}
                />
              ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const ServiceAttendance = () => {
  const { data, isLoading, refetch, isError, error, isFetching } = useAttendanceRecords();
  const { can } = usePermission();

  const {
    isOpen: isOpenDeleteModal,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();

  const [recordToDelete, setRecordToDelete] = useState(null);
  const [isSuccessDelete, setIsSuccessDelete] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [activeTab, setActiveTab] = useState('table'); // 'table' | 'chart'

  const gridRef = useRef(null);
  const [isGridReady, setIsGridReady] = useState(false);

  const deleteRecords = useDeleteAttendanceRecords({
    onSuccess: () => {
      setIsSuccessDelete(true);
      setTimeout(() => {
        setIsSuccessDelete(false);
        closeDeleteModal();
        refetch();
      }, 2000);
    },
  });

  // ── Derived data ───────────────────────────────────────────────────────────

  const attendanceData = useMemo(() => {
    if (!data) return [];
    const raw = data?.attendances ?? data;
    return Array.isArray(raw) ? raw : [];
  }, [data]);

  const chartData = useMemo(() => data?.chart ?? null, [data]);

  const tableHeight = useMemo(() => {
    if (attendanceData.length === 0) return MIN_TABLE_HEIGHT;
    const contentHeight =
      attendanceData.length * ROW_HEIGHT + HEADER_HEIGHT + PAGINATION_HEIGHT;
    return Math.min(Math.max(contentHeight, MIN_TABLE_HEIGHT), MAX_TABLE_HEIGHT);
  }, [attendanceData.length]);

  // ── Grid config ────────────────────────────────────────────────────────────

  const defaultColDef = useMemo(
    () => ({
      filter: true,
      sortable: true,
      resizable: true,
      floatingFilter: true,
      editable: false,
      minWidth: 100,
    }),
    []
  );

  const dateFormatter = useCallback((params) => {
    if (!params.value) return '';
    const date = new Date(params.value);
    if (isNaN(date)) return params.value;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }, []);

  const handleOpenDelete = useCallback(
    (id) => {
      setRecordToDelete(id);
      openDeleteModal();
    },
    [openDeleteModal]
  );

  const handleDelete = async () => {
    if (recordToDelete) deleteRecords.mutate(recordToDelete);
  };

  const columnDefs = useMemo(
    () => [
      { field: 'id', headerName: 'ID', pinned: 'left', cellClass: 'font-medium' },
      { field: 'service_day_desc', headerName: 'Service Day', pinned: 'left' },
      { field: 'service_date', headerName: 'Service Date', valueFormatter: dateFormatter },
      { field: 'male', headerName: 'Male' },
      { field: 'female', headerName: 'Female' },
      { field: 'children', headerName: 'Children' },
      {
        field: 'total_attendance',
        headerName: 'Total Attendance',
        cellClass: 'font-semibold text-blue-600',
      },
      { field: 'created_at', headerName: 'Created At', valueFormatter: dateFormatter },
      {
        headerName: 'Actions',
        field: 'id',
        pinned: 'right',
        width: 150,
        cellRenderer: (params) => {
          const rowData = params.data;
          return (
            <div className="flex items-center justify-center w-full h-full gap-3 py-2">
              {can(PERMISSIONS.ATTENDANCE_EDIT) && (
                <button
                  onClick={(e) => { e.stopPropagation(); setEditingRecord(rowData); }}
                  className="p-1 text-blue-500 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30"
                  title="Edit record"
                >
                  <EditIcon className="w-4 h-4" />
                </button>
              )}
              {can(PERMISSIONS.ATTENDANCE_DELETE) && (
                <button
                  onClick={(e) => { e.stopPropagation(); handleOpenDelete(rowData.id); }}
                  className="p-1 text-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30"
                  title="Delete record"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        },
      },
    ],
    [dateFormatter, handleOpenDelete, can]
  );

  const gridOptions = useMemo(
    () => ({
      pagination: true,
      paginationPageSize: DEFAULT_PAGE_SIZE,
      paginationPageSizeSelector: PAGINATION_PAGE_SIZES,
      animateRows: true,
      rowSelection: 'multiple',
      suppressRowDeselection: false,
      rowMultiSelectWithClick: true,
      enableCellTextSelection: true,
      ensureDomOrder: true,
    }),
    []
  );

  // ── Grid handlers ──────────────────────────────────────────────────────────

  const autoSizeColumns = useCallback(() => {
    if (!gridRef.current) return;
    const allColumns =
      gridRef.current.getColumns?.() || gridRef.current.getAllDisplayedColumns?.();
    if (!allColumns) return;
    const ids = allColumns.map((c) => c.getColId());
    gridRef.current.autoSizeColumns(ids, false);
  }, []);

  const onGridReady = useCallback(
    (params) => {
      gridRef.current = params.api;
      setIsGridReady(true);
      setTimeout(autoSizeColumns, 100);
    },
    [autoSizeColumns]
  );

  const onSelectionChanged = useCallback(() => {
    if (!gridRef.current) return;
    setSelectedRows(gridRef.current.getSelectedRows());
  }, []);

  useEffect(() => {
    if (isGridReady && attendanceData.length > 0) {
      setTimeout(autoSizeColumns, 150);
    }
  }, [attendanceData, isGridReady, autoSizeColumns]);

  const handleExportCSV = useCallback(() => {
    if (!gridRef.current) return;
    const timestamp = new Date().toISOString().split('T')[0];
    gridRef.current.exportDataAsCsv({ fileName: `attendance-report-${timestamp}.csv` });
  }, []);

  const handleRefresh = useCallback(() => refetch(), [refetch]);

  // ── Error state ────────────────────────────────────────────────────────────

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

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5">
      {/* Create form */}
      {can(PERMISSIONS.ATTENDANCE_EDIT) && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <CreateAttendanceRecord onSuccess={refetch} />
        </div>
      )}

      {/* Tab switcher */}
      <div className="flex items-center gap-1 border-b border-gray-200 dark:border-gray-700">
        {[
          { key: 'table', label: 'Records' },
          { key: 'chart', label: 'Chart' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${activeTab === key
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Chart tab ── */}
      {activeTab === 'chart' && (
        <div className="rounded-2xl border border-gray-100 dark:border-gray-700/60 bg-gray-50 dark:bg-gray-900/40 p-5">
          {isLoading ? (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
              Loading chart data…
            </div>
          ) : (
            <AttendanceChart chartData={chartData} />
          )}
        </div>
      )}

      {/* ── Table tab ── */}
      {activeTab === 'table' && (
        <div className="space-y-3">
          {/* Record count + selection */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-green-600 dark:text-green-400">
              <span className="font-semibold text-green-500">{attendanceData.length}</span>{' '}
              record{attendanceData.length !== 1 ? 's' : ''} found
            </p>
            {selectedRows.length > 0 && (
              <p className="text-sm text-blue-600 dark:text-blue-400">
                <span className="font-semibold">{selectedRows.length}</span>{' '}
                selected
              </p>
            )}
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap justify-between w-full gap-3">
            <div className="flex flex-wrap gap-3">
              <Button
                variant="primary"
                onClick={handleExportCSV}
                disabled={!attendanceData.length || isLoading}
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
            <Button
              variant="light"
              onClick={autoSizeColumns}
              disabled={!attendanceData.length || isLoading}
            >
              <ExpandFullScreenIcon className="w-4 h-4 md:h-5 md:w-5" />
            </Button>
          </div>

          {/* AG Grid */}
          {isLoading && !attendanceData.length ? (
            <TableSkeletonLoader />
          ) : (
            <div
              className="overflow-hidden border border-gray-200 rounded-lg shadow-sm ag-theme-alpine dark:border-gray-700"
              style={{ width: '100%', height: `${tableHeight}px` }}
            >
              <AgGridReact
                ref={gridRef}
                defaultColDef={defaultColDef}
                columnDefs={columnDefs}
                rowData={attendanceData}
                gridOptions={gridOptions}
                onGridReady={onGridReady}
                onSelectionChanged={onSelectionChanged}
              />
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <DeleteConfirmationModal
        title="Delete Attendance Record"
        description="Are you sure you want to delete this attendance record? This action cannot be undone."
        isOpen={isOpenDeleteModal}
        isLoading={deleteRecords.isLoading}
        isSuccess={isSuccessDelete}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
      />

      {editingRecord && (
        <EditAttendanceRecord
          key={editingRecord?.id}
          isOpen={!!editingRecord}
          onClose={() => setEditingRecord(null)}
          record={editingRecord}
          onSuccess={(updatedRecord) => {
            if (updatedRecord) setEditingRecord(updatedRecord);
            refetch();
          }}
        />
      )}
    </div>
  );
};

export default ServiceAttendance;