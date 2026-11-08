import React, { useState, useCallback, useMemo } from 'react';
import Badge from '@/components/ui/Badge';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { DropdownItem } from '@/components/ui/dropdown/DropdownItem';
import { ArrowDownIcon, AttendanceIcon2, VerticalDotsIcon } from '@/icons';

const METRIC_TYPES = {
    PRESENT: 'Present',
    ABSENT: 'Absent'
};

const METRIC_CONFIG = {
    [METRIC_TYPES.PRESENT]: {
        iconColor: 'text-emerald-500',
        badgeColor: 'success',
        arrowDirection: true
    },
    [METRIC_TYPES.ABSENT]: {
        iconColor: 'text-rose-500',
        badgeColor: 'error',
        arrowDirection: false
    }
};

const AttendanceMetric = ({ data, type }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    const config = useMemo(() => METRIC_CONFIG[type] || METRIC_CONFIG[METRIC_TYPES.PRESENT], [type]);

    const attendanceCount = useMemo(() => {
        return type === METRIC_TYPES.PRESENT ? data?.total_present : data?.total_absent;
    }, [type, data]);

    const percentage = useMemo(() => {
        return type === METRIC_TYPES.PRESENT ? data?.present_percentage ?? 0 : data?.absent_percentage ?? 0;
    }, [data?.present_percentage, data?.absent_percentage, type]);

    return (
        <div className="relative rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                    <AttendanceIcon2
                        width={30}
                        height={30}
                        className={config.iconColor}
                    />
                </div>

                <div className="relative inline-block">
                    <button
                        className="m-0 p-0"
                        onClick={toggleDropdown}
                        aria-label="Options"
                    >
                        <VerticalDotsIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
                    </button>

                    <Dropdown
                        isOpen={isOpen}
                        onClose={toggleDropdown}
                        className="w-40 p-2"
                    >
                        <DropdownItem
                            to="/dashboard/attendance"
                            tag="a"
                            onItemClick={toggleDropdown}
                            className="flex w-full rounded-lg text-left font-normal text-gray-500 hover:bg-gray-100 hover:text-blue-500 hover:underline dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                        >
                            View more
                        </DropdownItem>
                    </Dropdown>
                </div>
            </div>

            <div className="mt-5 flex items-end justify-between">
                <div>
                    <span className="text-base text-gray-500 dark:text-gray-400">
                        {type}
                    </span>
                    <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">
                        {attendanceCount}{' '}
                        <span className="text-sm text-gray-400 dark:text-white/50">
                            / {data?.total_services ?? 0}
                        </span>
                    </h4>
                </div>

                <Badge color={config.badgeColor} size="lg">
                    <ArrowDownIcon isOpen={config.arrowDirection} />
                    {percentage}%
                </Badge>
            </div>
        </div>
    );
};

export default AttendanceMetric;