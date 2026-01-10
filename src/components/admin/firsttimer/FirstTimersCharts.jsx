import { useState, useMemo, useCallback } from "react";
import { DashboardSkeletonLoader } from "../../skeleton";
import { AgCharts } from "ag-charts-react";
import { generateChartSeries } from "../../../utils/helper";
import { years } from "../../../utils/constant";
import { useFirstTimersAnalytics } from "../../../queries/firstTimer.query";
import { CalendarIcon, ChevronDownIcon } from "@/icons";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { Link } from "react-router-dom";

const FirstTimersCharts = () => {

    const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleDateString('en-Ng', { month: 'long' }));
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const { data, isLoading } = useFirstTimersAnalytics({ year: selectedYear })
    const { totalFirstTimers = [], statusesPerMonth = [], integratedFirstTimers = [] } = data || {}

    const getStatusDataForMonth = useCallback((selectedMonth, statusesPerMonthData) => {
        if (!statusesPerMonthData?.length) return [];

        const monthData = statusesPerMonthData.find(data => data.month === selectedMonth);
        if (!monthData) return [];

        const { month, ...statuses } = monthData;
        return Object.entries(statuses)
            .map(([status, count]) => ({ status, count }))
            .filter(item => item.count > 0);
    }, []);

    const chartOptions = useMemo(() => {
        const statusPerMonthOptions = {
            title: {
                text: `First timers' status in a year`,
            },
            data: statusesPerMonth,
            series: generateChartSeries(statusesPerMonth)
        };

        const totalFirstTimerOptions = {
            title: {
                text: `Total First Timers`,
            },
            data: totalFirstTimers,
            series: [
                {
                    type: "bar",
                    xKey: "month",
                    yKey: "count",
                    stroke: "#465fff",
                    fill: "#465fff"
                },
            ]
        };

        const integratedFirstTimerOptions = {
            title: {
                text: `Integrated First Timers`,
            },
            data: integratedFirstTimers,
            series: [
                {
                    type: "bar",
                    xKey: "month",
                    yKey: "count",
                    stroke: "#039855",
                    fill: "#039855"
                },
            ],
        };

        const statusPerMonthOptionsPie = {
            title: {
                text: `First timers' status in a month.`,
            },
            data: getStatusDataForMonth(selectedMonth, statusesPerMonth),
            series: [
                {
                    type: "pie",
                    angleKey: "count",
                    calloutLabelKey: "status",
                    sectorLabelKey: "count",
                    sectorLabel: {
                        color: "white",
                        fontWeight: "bold",
                        formatter: ({ value }) => `${value}`,
                    },
                },
            ],
        };

        return {
            statusPerMonthOptions,
            totalFirstTimerOptions,
            integratedFirstTimerOptions,
            statusPerMonthOptionsPie
        };
    }, [statusesPerMonth, totalFirstTimers, integratedFirstTimers, selectedMonth, getStatusDataForMonth]);

    const handleMonthChange = useCallback((event) => {
        setSelectedMonth(event.target.value);
    }, []);

    const commonChartProps = {
        enableCharts: true,
        enableRangeSelection: true,
        animateRows: true
    };

    if (isLoading) return <DashboardSkeletonLoader />

    const MonthlyChartsSection = () => {
        return (
            <>
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    <ChartContainer >
                        <AgCharts
                            options={chartOptions.totalFirstTimerOptions}
                            {...commonChartProps} style={{ height: "500px" }}
                        />
                    </ChartContainer>
                    <ChartContainer >
                        <AgCharts style={{ height: "500px" }}
                            options={chartOptions.integratedFirstTimerOptions}
                            {...commonChartProps}
                        />
                    </ChartContainer>
                </div>
            </>
        )
    }

    const StatusReportSection = () => {
        const [isOpen, setIsOpen] = useState(false);
        const closeDropdown = () => setIsOpen(false);
        const openDropdown = () => setIsOpen(true);

        return (
            <>
                <div className="relative inline-block mb-4 mr-4">
                    <button
                        role="button" onClick={openDropdown}
                        className="
                                flex items-center gap-2 
                                px-4 py-2 rounded-lg 
                                bg-white dark:bg-gray-800 
                                text-gray-900 dark:text-gray-100 
                                border border-gray-200 dark:border-gray-700
                                hover:bg-gray-100 dark:hover:bg-gray-700
                                transition-colors duration-200
                                shadow-sm
                            "
                    >
                        <CalendarIcon />
                        <span className="font-medium">{selectedMonth}, {selectedYear}</span>
                        <ChevronDownIcon className={`w-5 h-5 transform transition-transform duration-300 text-gray-500 dark:text-gray-400 ${isOpen ? 'rotate-180' : 'rotate-0'} `} />
                    </button>
                    <Dropdown
                        onClose={closeDropdown}
                        isOpen={isOpen}
                        className="p-2 mt-5"
                        direction='right'
                    >
                        <MonthSelector />
                    </Dropdown>

                </div>
                <div className="relative inline-block mb-4">
                    <Link to='/dashboard/admin/first-timers/report'
                        className="
                                flex items-center gap-2 
                                px-4 py-2 rounded-lg 
                                bg-white dark:bg-gray-800 
                                text-gray-900 dark:text-gray-100 
                                border border-gray-200 dark:border-gray-700
                                hover:bg-gray-100 dark:hover:bg-gray-700
                                transition-colors duration-200
                                shadow-sm
                            "
                    >
                        <CalendarIcon />
                        FirstTimers' Report
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2">
                    <ChartContainer>
                        <AgCharts
                            style={{ height: "500px" }}
                            options={chartOptions.statusPerMonthOptionsPie}
                        />
                    </ChartContainer>
                    <ChartContainer >
                        <AgCharts
                            style={{ height: "500px" }}
                            options={chartOptions.statusPerMonthOptions}
                            {...commonChartProps}
                        />
                    </ChartContainer>
                </div>
            </>
        );
    }


    const ChartContainer = ({ children }) => (
        <div className="mb-7">
            {children}
        </div>
    );

    const MonthSelector = () => (
        <div className="flex gap-3 p-2">
            <div className="w-24">
                <label
                    htmlFor="month-select"
                    className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-400 mb-1"
                >
                    Select Month:
                </label>
                <select
                    id="month-select"
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    className="block w-full p-1.5 text-gray-700 border border-gray-300 rounded-md shadow-sm  text-xs sm:text-sm font-normal dark:border-gray-400  focus:outline-none dark:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    aria-label="Select month for pie chart"
                >
                    {statusesPerMonth?.map(({ month }) => (
                        <option key={month} value={month}>
                            {month}
                        </option>
                    )) || []}
                </select>
            </div>
            <div className="w-24">
                <label
                    htmlFor="month-select"
                    className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1 sm:text-sm"
                >
                    Select Year:
                </label>
                <select
                    id="month-year"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className=" dark:border-gray-400 block w-full p-1.5 text-gray-700 dark:text-gray-400 border border-gray-300 rounded-md shadow-sm text-xs sm:text-sm font-normal focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    aria-label="Select month for pie chart"
                >
                    {years?.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    )) || []}
                </select>
            </div>
        </div>
    );

    return (
        <div>
            <StatusReportSection />
            <MonthlyChartsSection />
        </div>
    );
};

export default FirstTimersCharts;