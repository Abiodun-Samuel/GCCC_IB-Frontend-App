import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/Table";
import { LoadingIcon2 } from "@/icons";
import { useMemo } from "react";

export function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md ${className}`}
    />
  )
}


export const SkeletonTableLoader = ({ columnCount = 10, rowCount = 50 }) => {
  return (
    <div className="overflow-x-auto p-4">
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            {Array.from({ length: columnCount }).map((_, i) => (
              <th
                key={i}
                className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700"
              >{''}
                <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: rowCount }).map((_, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {Array.from({ length: columnCount }).map((_, colIndex) => (
                <td
                  key={colIndex}
                  className="px-4 py-2 border-b text-sm text-gray-600"
                >
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const BarChartSkeleton = ({
  bars = 12,
  heights = null,
  maxHeight = 280,
  showLabels = true,
  className = "",
}) => {
  // deterministic pseudo-random heights if none provided
  const generatedHeights = useMemo(() => {
    if (Array.isArray(heights) && heights.length >= bars) {
      return heights.slice(0, bars).map((h) => Math.max(0, Math.min(1, Number(h))));
    }
    // simple stable generator (based on index) so layout is consistent
    return Array.from({ length: bars }).map((_, i) => {
      // produce values between 0.25 and 0.95
      const v = ((i * 37) % 100) / 100; // deterministic
      return 0.25 + (v * 0.7);
    });
  }, [bars, heights]);

  return (
    <div
      role="status"
      aria-label="Loading chart"
      style={{ height: "500px" }}
      className={`w-full ${className}`}
    >
      <div className="flex items-end gap-4 px-2 py-3" style={{ minHeight: maxHeight }}>
        {generatedHeights.map((h, idx) => {
          const heightPx = Math.round(h * maxHeight);
          return (
            <div key={idx} className="flex-1 flex flex-col items-center">
              {/* bar */}
              <div
                className="w-full rounded-t-md overflow-hidden"
                style={{
                  height: heightPx,
                  maxHeight,
                  display: "flex",
                  alignItems: "flex-end",
                }}
              >
                <div
                  className="w-full bg-gray-200 dark:bg-gray-700 animate-pulse"
                  style={{ height: Math.max(6, heightPx) }}
                />
              </div>

              {/* value placeholder above label */}
              <div className="mt-2 h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />

              {/* label placeholder */}
              {showLabels && (
                <div className="mt-2 h-3 w-3/4 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
              )}
            </div>
          );
        })}
      </div>

      {/* optional hint for screen readers */}
      <span className="sr-only">Chart loading — bars are placeholders</span>
    </div>
  );
}

export const AnalyticsSkeletonLoader = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-8">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-white/[0.03] md:p-5 animate-pulse"
        >
          {/* Top section (icon + dropdown) */}
          <div className="flex justify-between">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-xl dark:bg-gray-700" />
            <div className="w-6 h-6 bg-gray-200 rounded-full dark:bg-gray-700" />
          </div>

          {/* Middle section (title + value) */}
          <div className="flex items-end justify-between mt-7">
            <div className="w-full">
              <div className="w-20 h-3 mb-2 bg-gray-200 rounded dark:bg-gray-700" />
              <div className="w-16 h-5 bg-gray-300 rounded dark:bg-gray-600" />
            </div>

            <div className="w-10 h-6 bg-gray-200 rounded-full dark:bg-gray-700" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const DashboardSkeletonLoader = () => {
  return (
    <div className="space-y-6">
      {/* Top Filters */}
      <div className="flex gap-4">
        <div className="h-10 w-32 bg-gray-200 rounded-md animate-pulse dark:bg-gray-700" />
        <div className="h-10 w-32 bg-gray-200 rounded-md animate-pulse dark:bg-gray-700" />
      </div>

      {/* Main Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart Skeleton */}
        <div className="flex flex-col items-center justify-center p-4 bg-white border rounded-lg dark:bg-gray-900 dark:border-gray-800">
          <div className="h-56 w-56 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700" />
          <div className="flex justify-center gap-4 mt-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-gray-300 animate-pulse dark:bg-gray-600" />
                <div className="h-3 w-12 bg-gray-200 rounded dark:bg-gray-700 animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Stacked Bar Chart Skeleton */}
        <div className="flex flex-col justify-between p-4 bg-white border rounded-lg dark:bg-gray-900 dark:border-gray-800">
          <div className="h-56 w-full bg-gray-200 rounded-md animate-pulse dark:bg-gray-700" />
          <div className="grid grid-cols-4 gap-3 mt-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-gray-300 animate-pulse dark:bg-gray-600" />
                <div className="h-3 w-14 bg-gray-200 rounded dark:bg-gray-700 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Two Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly First Timers */}
        <div className="flex flex-col p-4 bg-white border rounded-lg dark:bg-gray-900 dark:border-gray-800">
          <div className="h-6 w-40 bg-gray-200 rounded-md mb-4 animate-pulse dark:bg-gray-700" />
          <div className="h-56 w-full bg-gray-200 rounded-md animate-pulse dark:bg-gray-700" />
        </div>

        {/* Monthly Integrated First Timers */}
        <div className="flex flex-col p-4 bg-white border rounded-lg dark:bg-gray-900 dark:border-gray-800">
          <div className="h-6 w-60 bg-gray-200 rounded-md mb-4 animate-pulse dark:bg-gray-700" />
          <div className="h-56 w-full bg-gray-200 rounded-md animate-pulse dark:bg-gray-700" />
        </div>
      </div>
    </div>
  );
};

export const TabContentLoader = () => (
  <div className="flex items-center justify-center py-12">
    <div className="flex flex-col items-center gap-3">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#24244e]"></div>
      <p className="text-sm text-gray-600">Loading form...</p>
    </div>
  </div>
);

export const UnitCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 animate-pulse">
    {/* Header */}
    <div className="bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-700 dark:to-gray-600 p-6 relative">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white/30 rounded-xl mb-3"></div>
          <div className="h-5 w-32 bg-white/30 rounded"></div>
        </div>
        <div className="w-8 h-8 bg-white/30 rounded-lg"></div>
      </div>
    </div>

    {/* Content */}
    <div className="p-5 space-y-3">
      {/* Leader Info */}
      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-3 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="h-4 w-32 bg-gray-400 dark:bg-gray-500 rounded"></div>
        </div>
      </div>

      {/* Assistant Leader Info */}
      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-3 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="h-4 w-28 bg-gray-400 dark:bg-gray-500 rounded"></div>
        </div>
      </div>

      {/* Members Count */}
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
          <div className="space-y-2">
            <div className="h-3 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-5 w-10 bg-gray-400 dark:bg-gray-500 rounded"></div>
          </div>
        </div>
      </div>
    </div>

    {/* Footer */}
    <div className="px-5 py-3 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-700">
      <div className="h-3 w-40 bg-gray-300 dark:bg-gray-600 mx-auto rounded"></div>
    </div>
  </div>
);

export const VideoCardSkeleton = () => {
  return (
    <div className="group bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">
      {/* Thumbnail skeleton */}
      <div className="relative aspect-video bg-slate-200 dark:bg-slate-700 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 bg-slate-300 dark:bg-slate-600 rounded-full animate-pulse"></div>
        </div>
      </div>
      {/* Content skeleton */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4 animate-pulse"></div>

        {/* Badge */}
        <div className="flex gap-2">
          <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
          <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export const AttendanceStatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8 animate-pulse">
      {/* Present Card Skeleton */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-8">
        {/* Icon placeholder */}
        <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-xl dark:bg-gray-700"></div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <div className="h-4 w-20 bg-gray-200 rounded dark:bg-gray-700"></div>
            <div className="h-6 w-32 mt-2 bg-gray-200 rounded dark:bg-gray-700"></div>
          </div>

          {/* Badge placeholder */}
          <div className="h-8 w-16 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </div>
      </div>

      {/* Absent Card Skeleton */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-8">
        {/* Icon placeholder */}
        <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-xl dark:bg-gray-700"></div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <div className="h-4 w-20 bg-gray-200 rounded dark:bg-gray-700"></div>
            <div className="h-6 w-32 mt-2 bg-gray-200 rounded dark:bg-gray-700"></div>
          </div>

          {/* Badge placeholder */}
          <div className="h-8 w-16 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </div>
      </div>
    </div>
  );
};

export const MonthlyTargetSkeleton = () => {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-white/[0.03] animate-pulse">
      {/* Header Skeleton */}
      <div className="px-4 pt-4 sm:px-6 sm:pt-6">
        <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded sm:h-6 sm:w-40" />
        <div className="mt-2 h-3 w-48 bg-gray-200 dark:bg-gray-700 rounded sm:h-4 sm:w-56" />
      </div>

      {/* Chart Skeleton */}
      <div className="px-4 py-6 sm:px-6 sm:py-[75px]">
        <div className="flex flex-col items-center justify-center">
          {/* Semi-circle skeleton */}
          <div className="relative w-full max-w-[220px] sm:max-w-[280px]">
            <div className="aspect-[2/1] flex items-center justify-center">
              <div className="w-full h-full rounded-t-full border-b-0 border-[16px] sm:border-[20px] border-gray-200 dark:border-gray-700" />
            </div>

            {/* Center text skeleton */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pb-4 sm:pb-6">
              <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2 sm:h-12 sm:w-24" />
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded sm:h-5 sm:w-20" />
            </div>
          </div>

          {/* Message Skeleton */}
          <div className="mt-4 sm:mt-6 w-full max-w-xs space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};

export function TableSkeletonLoader() {
  const skeletonRows = Array.from({ length: 5 }); // 5 rows

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      {/* Fake header */}
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="h-5 w-40 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="mt-2 h-4 w-72 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </div>
      </div>

      {/* Table with fake headers */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              {Array.from({ length: 8 }).map((_, i) => (
                <TableCell key={i} className="py-3">
                  <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>

          {/* Skeleton rows */}
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {skeletonRows.map((_, i) => (
              <TableRow key={i}>
                <TableCell className="py-3">
                  <div className="h-4 w-6 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                </TableCell>
                <TableCell className="py-3">
                  <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                </TableCell>
                <TableCell className="py-3">
                  <div className="h-5 w-14 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                </TableCell>
                <TableCell className="py-3">
                  <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                </TableCell>
                <TableCell className="py-3">
                  <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                </TableCell>
                <TableCell className="py-3">
                  <div className="h-5 w-16 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export const TimelineSkeletonLoader = () => {
  return (
    <div className="w-full mx-auto max-w-4xl">
      <div className="py-8 transition-colors duration-300">
        {/* Header Skeleton */}
        <div className="mb-10 space-y-3">
          <div className="h-7 sm:h-8 w-52 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="h-4 sm:h-5 w-80 max-w-full rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="h-8 w-28 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </div>

        {/* Timeline Loader */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 via-purple-400 to-green-400 opacity-25 dark:opacity-40" />

          <div className="space-y-6 sm:space-y-8 py-5 pr-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="relative pl-12 sm:pl-20">
                {/* Timeline Dot */}
                <div className="absolute left-2.5 sm:left-6 top-6 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-blue-400/70 dark:bg-blue-500/60 animate-pulse shadow-md" />

                {/* Card */}
                <div className="bg-white dark:bg-gray-800/80 rounded-2xl shadow-md border border-gray-200/80 dark:border-gray-700/80 overflow-hidden">
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                        {/* Avatar */}
                        <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />

                        {/* Content */}
                        <div className="flex-1 min-w-0 space-y-3">
                          {/* Name + Badge */}
                          <div className="flex items-center gap-3">
                            <div className="h-5 w-36 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
                            <div className="h-5 w-20 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                          </div>

                          {/* Email */}
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-5 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
                            <div className="h-4 w-40 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
                          </div>

                          {/* Date and Time */}
                          <div className="flex items-center gap-5">
                            <div className="h-4 w-28 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
                            <div className="h-4 w-24 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
                          </div>
                        </div>
                      </div>

                      {/* Expand Button */}
                      <div className="w-8 h-8 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const pulse = "animate-pulse bg-gray-200 dark:bg-gray-700";

const InfoSkeleton = ({ fullWidth = false }) => (
  <div className={`${fullWidth ? 'col-span-2' : ''}`}>
    <div className="flex items-start gap-2 mb-1">
      <div className={`w-4 h-4 rounded ${pulse}`} />
      <div className={`w-24 h-3 rounded ${pulse}`} />
    </div>
    <div className={`ml-6 w-full h-4 rounded ${pulse}`} />
  </div>
);

const SectionSkeleton = ({ title = true, count = 4 }) => (
  <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg ${pulse}`} />
        {title && <div className={`w-40 h-5 rounded ${pulse}`} />}
      </div>
      <div className={`w-20 h-8 rounded-lg ${pulse}`} />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <InfoSkeleton key={i} />
      ))}
    </div>
  </div>
);

export const FirstTimerProfileSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-in fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Left section — Avatar + Info */}
        <div className="flex items-center gap-4">
          {/* Avatar Skeleton */}
          <div className="w-36 h-36 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />

          <div className="space-y-6">
            {/* Name */}
            <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
            {/* Email */}
            <div className="h-4 w-56 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
            </div>
          </div>
        </div>

        {/* Right section — Switches */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
            <div className="h-5 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
            <div className="h-5 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const FollowupFeedbacksSkeletonLoader = () => {
  return (
    [1, 2, 3, 4, 5].map((i) => <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 animate-pulse mb-5">
      <div className="p-5 sm:p-6 flex items-start gap-4">
        {/* Avatar Skeleton */}
        <div className="relative flex-shrink-0">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-300 dark:bg-gray-700"></div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
        </div>

        {/* Main Info Skeleton */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0 space-y-2">
              {/* Name */}
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>

              {/* Email and Phone */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-40"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-32"></div>
              </div>
            </div>

            {/* Chevron */}
            <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>

          {/* Badges Skeleton */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-full w-20"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-full w-28"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-full w-24"></div>
          </div>
        </div>
      </div>
    </div>)
  );
};

export const ProfileHeaderSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Skeleton className="w-32 h-32 rounded-2xl" variant="rectangular" />
          <div className="space-y-3 flex-1">
            <Skeleton className="h-8 w-48" variant="text" />
            <Skeleton className="h-4 w-64" variant="text" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 rounded-full" variant="rectangular" />
              <Skeleton className="h-6 w-20 rounded-full" variant="rectangular" />
              <Skeleton className="h-6 w-20 rounded-full" variant="rectangular" />
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-10 w-40" variant="rectangular" />
          <Skeleton className="h-10 w-40" variant="rectangular" />
        </div>
      </div>
    </div>
  );
};

export function FormCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-5 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        {/* Left Section */}
        <div className="flex items-start sm:items-center gap-3 sm:flex-1 min-w-0">
          {/* Checkbox placeholder */}
          <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700" />

          {/* Name + Meta */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-end gap-2 sm:gap-3">
          <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-5 w-10 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  );
}

export function FormsSkeleton() {
  return (
    <div className="space-y-5">
      {/* Top Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50 dark:bg-gray-700/40 border border-gray-200 dark:border-gray-700 rounded-lg p-3 animate-pulse">
        <div className="inline-flex items-center gap-2 bg-gray-200 dark:bg-gray-700 px-3 rounded py-1">
          <div className="w-4 h-4 rounded bg-gray-300 dark:bg-gray-600" />
          <div className="h-4 w-28 bg-gray-300 dark:bg-gray-600 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-24 bg-gray-300 dark:bg-gray-600 rounded" />
          <div className="h-8 w-20 bg-gray-300 dark:bg-gray-600 rounded" />
        </div>
      </div>

      {/* List of Cards */}
      {[...Array(4)].map((_, i) => (
        <FormCardSkeleton key={i} />
      ))}
    </div>
  );
}

export const TableLoadingSkeleton = ({ title }) => {
  return (
    <div className="flex flex-col items-center py-10 space-y-2 justify-center  backdrop-blur-sm w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
      <div className="relative flex justify-center items-center">
        <LoadingIcon2 className='h-10 w-10 dark:text-gray-300' />
      </div>
      <p className="text-gray-700 dark:text-gray-300 mt-4 font-medium">Loading {title}...</p>
      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Please wait while we fetch the data</p>
    </div>
  );
};


export const InlineLoader = ({ text = "Syncing..." }) => (
  <span className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400">
    <svg className="animate-spin h-3 w-3 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    {text}
  </span>
);