import { AgGridReact } from 'ag-grid-react';
import { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { Link } from "react-router-dom";
import { Briefcase } from 'lucide-react';

// Queries
import { useMembersByRole, useUpdateGloryTeamMembers } from '@/queries/member.query';

// Components
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import ButtonCard from '@/components/ui/ButtonCard';
import ButtonSwitch from '@/components/ui/ButtonSwitch';
import Message from '@/components/common/Message';
import { TableSkeletonLoader } from '@/components/skeleton';
import CreateMembers from '@/components/admin/members/CreateMembers';
import EditMembersPanel from '@/components/admin/members/MembersFilterPanel';
import AssignMembers from '@/components/admin/members/AssignMembers';
import RoleSelection from '@/components/admin/members/RoleSelection';

// Icons
import { ExpandFullScreenIcon, FilterIcon } from '@/icons';

ModuleRegistry.registerModules([AllCommunityModule]);

// ============================================================================
// CONSTANTS
// ============================================================================
const PAGINATION_PAGE_SIZES = [25, 50, 100, 200];
const DEFAULT_PAGE_SIZE = 200;
const MIN_TABLE_HEIGHT = 400;
const MAX_TABLE_HEIGHT = 800;
const ROW_HEIGHT = 42;
const HEADER_HEIGHT = 56;
const PAGINATION_HEIGHT = 60;

const DEFAULT_FILTERS = {
  date_of_birth: [],
  birth_month: null,
  community: null,
  role: 'member'
};

const STATUS_CONFIG = {
  active: { color: 'success', text: 'Active' },
  inactive: { color: 'error', text: 'Inactive' },
  suspended: { color: 'warning', text: 'Suspended' },
  pending: { color: 'info', text: 'Pending' }
};

// ============================================================================
// CELL RENDERERS
// ============================================================================

/**
 * Name with Avatar Cell Renderer
 * Displays avatar and clickable name together
 */
const NameWithAvatarRenderer = ({ data }) => {
  if (!data) return null;

  return (
    <div className="flex items-center gap-3 h-full">
      <Avatar
        src={data.avatar}
        alt={data.full_name || 'Member'}
        name={data.initials || data.full_name?.substring(0, 2).toUpperCase()}
        size="xs"
        shape="circle"
        showProfileStatus={true}
        isProfileCompleted={data.profile_completed}
      />
      <Link
        target="_blank"
        to={`/dashboard/members/${data.id}`}
        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors font-medium"
        rel="noopener noreferrer"
      >
        {data.full_name || 'N/A'}
      </Link>
    </div>
  );
};

/**
 * Phone Number Cell Renderer
 * Creates clickable tel: links
 */
const PhoneRenderer = ({ value }) => {
  if (!value) return null;

  return (
    <a
      href={`tel:${value}`}
      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors"
    >
      {value}
    </a>
  );
};

/**
 * Email Cell Renderer
 * Creates clickable mailto: links
 */
const EmailRenderer = ({ value }) => {
  if (!value) return null;

  return (
    <a
      href={`mailto:${value}`}
      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors"
    >
      {value}
    </a>
  );
};

/**
 * Boolean Cell Renderer
 * Displays Yes/No badges for boolean values
 */
const BooleanRenderer = ({ value }) => {
  const isTrue = value === true || value === 1 || value === 'true' || value === '1';

  return (
    <Badge size='sm' color={isTrue ? 'success' : 'error'}>
      {isTrue ? 'Yes' : 'No'}
    </Badge>
  );
};

/**
 * Status Cell Renderer
 * Displays colored status badges
 */
const StatusRenderer = ({ value }) => {
  const status = value?.toLowerCase() || 'inactive';
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.inactive;

  return (
    <Badge size='sm' color={config.color}>
      {value?.toLowerCase()}
    </Badge>
  );
};

/**
 * Profile Completion Cell Renderer
 * Shows completion status with percentage
 */
const ProfileCompletionRenderer = ({ data }) => {
  if (!data) return null;

  const isComplete = data.profile_completed === true || data.profile_completed === 1;
  const percentage = data.completion_percent || 0;

  return (
    <div>
      {isComplete ? (
        <Badge size='sm' color='success'>
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Complete
          </span>
        </Badge>
      ) : (
        <Badge size='sm' color='warning'>
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {percentage}%
          </span>
        </Badge>
      )}
    </div>
  );
};

/**
 * Units Cell Renderer
 * Displays member's units as badges
 */
const UnitsRenderer = ({ data }) => {
  if (!data || !data.units || data.units.length === 0) {
    return (
      <span className="text-gray-400 dark:text-gray-500 text-xs italic">
        No units
      </span>
    );
  }

  return (
    <div className="">
      {data.units.map((unit, index) => (
        <Badge
          key={unit.id || index}
          size='sm'
          color='info'
          className="text-xs"
        >
          {unit.name}
        </Badge>
      ))}
    </div>
  );
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format date for display
 */
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format units for CSV export
 * Converts array of unit objects to comma-separated string
 */
const formatUnitsForExport = (units) => {
  if (!units || !Array.isArray(units) || units.length === 0) {
    return 'No units';
  }
  return units.map(unit => unit.name).join(', ');
};

/**
 * Get unique unit names from all members for filter
 */
const getUniqueUnits = (members) => {
  if (!members || !Array.isArray(members)) return [];

  const unitSet = new Set();
  members.forEach(member => {
    if (member.units && Array.isArray(member.units)) {
      member.units.forEach(unit => {
        if (unit.name) unitSet.add(unit.name);
      });
    }
  });

  return Array.from(unitSet).sort();
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const AdminMembersTable = () => {
  // ========================================
  // STATE & REFS
  // ========================================
  const gridRef = useRef(null);
  const [isGridReady, setIsGridReady] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedRole, setSelectedRole] = useState('member');
  const [activeFilters, setActiveFilters] = useState(DEFAULT_FILTERS);

  // ========================================
  // QUERIES
  // ========================================
  const queryParams = useMemo(() => ({
    ...activeFilters,
    role: selectedRole
  }), [activeFilters, selectedRole]);

  const {
    data: members,
    isLoading,
    refetch,
    isError,
    error,
    isFetching
  } = useMembersByRole(queryParams);

  const { mutateAsync: updateGloryTeam, isPending: isUpdatingGloryTeam } = useUpdateGloryTeamMembers();

  // ========================================
  // DERIVED DATA
  // ========================================
  const memberData = useMemo(() => {
    if (!members) return [];
    return Array.isArray(members) ? members : [];
  }, [members]);

  const tableHeight = useMemo(() => {
    if (memberData.length === 0) return MIN_TABLE_HEIGHT;
    const contentHeight = (memberData.length * ROW_HEIGHT) + HEADER_HEIGHT + PAGINATION_HEIGHT;
    return Math.min(Math.max(contentHeight, MIN_TABLE_HEIGHT), MAX_TABLE_HEIGHT);
  }, [memberData.length]);

  const uniqueUnits = useMemo(() => getUniqueUnits(memberData), [memberData]);

  const hasActiveFilters = useMemo(() =>
    activeFilters.birth_month ||
    activeFilters.date_of_birth?.length > 0 ||
    activeFilters.community
    , [activeFilters]);

  // ========================================
  // FORMATTERS
  // ========================================
  const dateValueFormatter = useCallback((params) => {
    return formatDate(params.value);
  }, []);

  const unitsValueGetter = useCallback((params) => {
    return formatUnitsForExport(params.data?.units);
  }, []);

  const booleanValueGetter = useCallback((params) => {
    const value = params.data?.is_glory_team_member;
    return value == true || value == 1 || value == 'true' || value == '1';
  }, []);

  // ========================================
  // GRID CONFIGURATION
  // ========================================
  const defaultColDef = useMemo(() => ({
    filter: true,
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
      headerName: "ID",
      pinned: 'left',
      cellClass: 'font-medium text-gray-700 dark:text-gray-300',
      width: 80,
      filter: false,
      floatingFilter: false,
      suppressAutoSize: false,
    },
    {
      field: "full_name",
      headerName: "Name",
      cellRenderer: NameWithAvatarRenderer,
      pinned: 'left',
      width: 250,
      filter: 'agTextColumnFilter',
      filterParams: {
        buttons: ['reset'],
        debounceMs: 200,
        filterOptions: ['contains', 'notContains', 'equals', 'notEqual', 'startsWith', 'endsWith'],
        defaultOption: 'contains',
        suppressAndOrCondition: true,
      },
    },
    {
      field: "phone_number",
      headerName: "Phone Number",
      cellRenderer: PhoneRenderer,
      width: 150,
      filter: 'agTextColumnFilter',
      filterParams: {
        buttons: ['reset'],
        debounceMs: 200,
        filterOptions: ['contains', 'equals', 'startsWith'],
        defaultOption: 'contains',
        suppressAndOrCondition: true,
      },
    },
    {
      field: "email",
      headerName: "Email",
      cellRenderer: EmailRenderer,
      width: 220,
      filter: 'agTextColumnFilter',
      filterParams: {
        buttons: ['reset'],
        debounceMs: 200,
        filterOptions: ['contains', 'notContains', 'equals', 'startsWith', 'endsWith'],
        defaultOption: 'contains',
        suppressAndOrCondition: true,
      },
    },
    {
      field: "gender",
      headerName: "Gender",
      width: 120,
      filter: false,
    },
    {
      field: "is_glory_team_member",
      headerName: "Glory Team",
      cellRenderer: BooleanRenderer,
      width: 130,
      cellClass: 'ag-cell-centered',
      valueGetter: booleanValueGetter,
      filter: false,
    },
    {
      field: "status",
      headerName: "Status",
      cellRenderer: StatusRenderer,
      width: 120,
      cellClass: 'ag-cell-centered',
      filter: false,
      floatingFilter: false,
    },
    {
      field: "profile_completed",
      headerName: "Profile",
      cellRenderer: ProfileCompletionRenderer,
      width: 140,
      cellClass: 'ag-cell-centered',
      filter: false,
      floatingFilter: false,
    },
    {
      field: "date_of_birth",
      headerName: "Date of Birth",
      valueFormatter: dateValueFormatter,
      width: 150,
      filter: 'agDateColumnFilter',
      filterParams: {
        buttons: ['reset'],
        debounceMs: 200,
        comparator: (filterLocalDateAtMidnight, cellValue) => {
          if (!cellValue) return -1;

          const dateParts = cellValue.split(/[-\/]/);
          let cellDate;

          if (dateParts.length === 3) {
            if (dateParts[0].length === 4) {
              cellDate = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
            } else {
              cellDate = new Date(parseInt(dateParts[2]), parseInt(dateParts[0]) - 1, parseInt(dateParts[1]));
            }
          } else {
            cellDate = new Date(cellValue);
          }

          if (isNaN(cellDate.getTime())) return -1;

          cellDate.setHours(0, 0, 0, 0);

          if (cellDate < filterLocalDateAtMidnight) return -1;
          if (cellDate > filterLocalDateAtMidnight) return 1;
          return 0;
        },
      },
    },
    {
      field: "units",
      headerName: "Units",
      cellRenderer: UnitsRenderer,
      valueGetter: unitsValueGetter,
      width: 250,
      cellClass: 'ag-cell-wrap-text',
      autoHeight: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        buttons: ['reset'],
        debounceMs: 200,
        filterOptions: ['contains', 'notContains', 'equals'],
        defaultOption: 'contains',
        suppressAndOrCondition: true,
        textMatcher: ({ filterOption, value, filterText }) => {
          if (!filterText) return true;

          const lowerFilterText = filterText.toLowerCase();
          const lowerValue = (value || '').toLowerCase();

          if (filterOption === 'contains') {
            return lowerValue.includes(lowerFilterText);
          } else if (filterOption === 'notContains') {
            return !lowerValue.includes(lowerFilterText);
          } else if (filterOption === 'equals') {
            return lowerValue === lowerFilterText;
          }
          return true;
        },
      },
    },
    {
      field: "community",
      headerName: "Community",
      width: 160,
      filter: 'agTextColumnFilter',
      filterParams: {
        buttons: ['reset'],
        debounceMs: 200,
        filterOptions: ['contains', 'equals', 'startsWith'],
        defaultOption: 'contains',
        suppressAndOrCondition: true,
      },
    },
    {
      field: "address",
      headerName: "Address",
      width: 250,
      filter: 'agTextColumnFilter',
      filterParams: {
        buttons: ['reset'],
        debounceMs: 200,
        filterOptions: ['contains', 'notContains', 'startsWith'],
        defaultOption: 'contains',
        suppressAndOrCondition: true,
      },
    },
  ], [dateValueFormatter, unitsValueGetter, booleanValueGetter]);

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
    enableFillHandle: true,
    enableCellTextSelection: true,
    ensureDomOrder: true,
  }), []);

  // ========================================
  // EVENT HANDLERS
  // ========================================
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

    setTimeout(() => {
      autoSizeColumns();
    }, 100);
  }, [autoSizeColumns]);

  const handleExportCSV = useCallback(() => {
    if (!gridRef.current) return;

    const timestamp = new Date().toISOString().split('T')[0];
    gridRef.current.exportDataAsCsv({
      fileName: `members-report-${selectedRole}-${timestamp}.csv`,
      columnKeys: [
        'id',
        'full_name',
        'phone_number',
        'email',
        'gender',
        'is_glory_team_member',
        'status',
        'profile_completed',
        'date_of_birth',
        'units',
        'community',
        'address'
      ]
    });
  }, [selectedRole]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleApplyFilters = useCallback((filters) => {
    setActiveFilters(prev => ({
      ...prev,
      ...filters
    }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setActiveFilters(prev => ({
      ...DEFAULT_FILTERS,
      role: prev.role
    }));
  }, []);

  const handleToggleFilter = useCallback(() => {
    if (showFilter) {
      setActiveFilters(prev => ({
        ...DEFAULT_FILTERS,
        role: prev.role
      }));
    }
    setShowFilter(!showFilter);
  }, [showFilter]);

  const handleRoleChange = useCallback((role) => {
    setSelectedRole(role);
    setActiveFilters({
      ...DEFAULT_FILTERS,
      role: role
    });
  }, []);

  const handleUpdateGloryTeam = useCallback(async () => {
    await updateGloryTeam();
    await refetch();
  }, [updateGloryTeam, refetch]);

  // ========================================
  // EFFECTS
  // ========================================
  useEffect(() => {
    if (isGridReady && memberData.length > 0) {
      setTimeout(() => {
        autoSizeColumns();
      }, 150);
    }
  }, [memberData, isGridReady, autoSizeColumns]);

  // ========================================
  // ERROR STATE
  // ========================================
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

  // ========================================
  // RENDER
  // ========================================
  return (
    <div className="w-full space-y-6">
      {/* Action Buttons */}
      <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <ButtonSwitch
          onChange={handleToggleFilter}
          checked={showFilter}
          color="pink"
          type="button"
          icon={<FilterIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
          description="Filter church members data"
        >
          Filter
        </ButtonSwitch>
        <CreateMembers />
        <AssignMembers />
        <ButtonCard
          color="orange"
          loading={isUpdatingGloryTeam}
          onClick={handleUpdateGloryTeam}
          description="Update glory team member list"
          icon={<Briefcase />}
        >
          Update GloryTeam
        </ButtonCard>
      </div>

      {/* Filter Panel */}
      {showFilter && (
        <div className="max-w-xl p-4 dark:bg-gray-800 bg-white shadow rounded-lg">
          <EditMembersPanel
            initialFilters={activeFilters}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
            loading={isFetching}
          />
        </div>
      )}

      {/* Role Selection */}
      <RoleSelection
        selectedRole={selectedRole}
        onRoleChange={handleRoleChange}
        disabled={isFetching}
      />

      {/* Table Section */}
      <div className="space-y-3">
        {/* Stats Bar */}
        <div className="flex items-center gap-5 flex-wrap">
          <p className="text-sm text-green-600 dark:text-green-400">
            <span className="font-semibold text-green-500 dark:text-green-500">
              {memberData.length}
            </span>
            {' '}Record{memberData.length !== 1 ? 's' : ''} found
          </p>

          {hasActiveFilters && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
              Filtered
            </span>
          )}
        </div>

        {/* Control Buttons */}
        <div className="flex flex-wrap gap-3 justify-between w-full">
          <div className="flex flex-wrap gap-3">
            <Button
              variant="primary"
              onClick={handleExportCSV}
              disabled={!memberData.length || isLoading}
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
              disabled={!memberData.length || isLoading}
            >
              <ExpandFullScreenIcon className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </div>
        </div>

        {/* Table or Loading State */}
        {isLoading && !memberData.length ? (
          <TableSkeletonLoader />
        ) : (
          <>
            <div
              className="ag-theme-alpine border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden transition-colors"
              style={{ width: "100%", height: `${tableHeight}px` }}
            >
              <AgGridReact
                ref={gridRef}
                defaultColDef={defaultColDef}
                columnDefs={columnDefs}
                rowData={memberData}
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
                      <p class="text-gray-700 mt-4 font-medium">Loading members...</p>
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
                        No members found
                      </p>
                      <p class="text-gray-400 text-sm">
                        Members will appear here once available
                      </p>
                    </div>
                  </div>
                `}
              />
            </div>

            {/* Footer Info */}
            {memberData.length > 0 && (
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 flex justify-between items-center">
                <span>Last updated: {new Date().toLocaleString()}</span>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse"></span>
                    <span className="text-green-600 dark:text-green-400 font-medium">Live data</span>
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminMembersTable;