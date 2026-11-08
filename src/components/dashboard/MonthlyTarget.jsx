import { useState, useEffect } from "react";
import Message from "@/components/common/Message";
import ConfettiShower from "@/components/dashboard/ConfettiShower";
import { SemiCircleProgress } from "@/components/dashboard/metrics/SemiCircleProgress";
import { MonthlyTargetSkeleton } from "@/components/skeleton";
import { BagdeIcon, ChevronDownIcon2 } from "@/icons";
import { Toast } from "@/lib/toastify";
import { getAttendanceMessage, getMonthName } from "@/utils/helper";
import { useAuthStore } from "@/store/auth.store";
import Badge from "@/components/ui/Badge";
import MonthYearSelector from "@/components/common/MonthYearSelector";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import 'swiper/css/effect-fade';
import AttendanceLeaderboard from "@/components/dashboard/attendance/AttendanceLeaderboard";

const CONFETTI_DURATION = 10000;
const GOAL_PERCENTAGE = 100;

const MonthlyTarget = ({ data, isError, isLoading, error, params, handleDateChange }) => {
    const [showConfetti, setShowConfetti] = useState(false);
    const [hasShownToast, setHasShownToast] = useState(false);

    const monthAndYear = `${getMonthName(params?.month)}, ${params.year}`;
    const percentage = Number(data?.metrics?.present_percentage) || 0;
    const { level, message, fromColor, toColor } = getAttendanceMessage(percentage);
    const isGoalMet = percentage === GOAL_PERCENTAGE;

    useEffect(() => {
        if (isGoalMet && !isLoading) {
            setShowConfetti(true);
            if (!hasShownToast) {
                Toast.success(message);
                setHasShownToast(true);
            }
            const timer = setTimeout(() => {
                setShowConfetti(false);
            }, CONFETTI_DURATION);
            return () => clearTimeout(timer);
        }
    }, [isGoalMet, isLoading, message, hasShownToast]);

    if (isError) return <Message variant="error" data={error?.data} />;

    return (
        <>
            {showConfetti && <ConfettiShower />}
            <aside className="col-span-12 xl:col-span-5 relative overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3 transition-all">
                <Swiper
                    modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
                    spaceBetween={0}
                    slidesPerView={1}
                    centeredSlides={true}
                    pagination={{
                        clickable: true,
                        dynamicBullets: true,
                        dynamicMainBullets: 3
                    }}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: true,
                        pauseOnMouseEnter: true
                    }}
                >
                    {isLoading ? <MonthlyTargetSkeleton /> : <>
                        <SwiperSlide key={'1'}>
                            <div className="w-full space-y-5 pt-5 pb-10 px-4 sm:px-6">

                                <Header monthAndYear={monthAndYear} isGoalMet={isGoalMet} handleDateChange={handleDateChange} />

                                <ChartSection
                                    percentage={percentage}
                                    fromColor={fromColor}
                                    toColor={toColor}
                                    level={level}
                                    message={message}
                                />
                            </div>
                        </SwiperSlide>
                        <SwiperSlide key={'2'}>
                            <AttendanceLeaderboard handleDateChange={handleDateChange} topAttendees={data?.topAttendees} monthAndYear={monthAndYear} />
                        </SwiperSlide>
                    </>}
                </Swiper>
            </aside>
        </>
    );
};

const Header = ({ monthAndYear, isGoalMet, handleDateChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const closeDropdown = () => setIsOpen(false);
    const toggleDropdown = () => setIsOpen((prev) => !prev);

    const { user } = useAuthStore()
    return (
        <div>
            <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white sm:text-lg">
                    Monthly Target
                </h3>
                <div className="relative">
                    <button role="button" onClick={toggleDropdown} className="cursor-pointer flex items-center text-gray-500 gap-1 dark:text-gray-400 text-sm">
                        <Badge size="md" endIcon={<ChevronDownIcon2 className={`transform transition-transform duration-300 h-5 w-4 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />} color="primary">{monthAndYear}</Badge>
                    </button>
                    <Dropdown
                        onClose={closeDropdown}
                        isOpen={isOpen}
                        className="w-60 p-2 mt-2 shadow-xl"
                    >
                        <MonthYearSelector
                            onChange={(value) => {
                                handleDateChange(value);
                                closeDropdown();
                            }}
                        />
                    </Dropdown>
                </div>
            </div>
            <div>
                <p className="text-sm text-gray-600 dark:text-gray-400"> Attendance Report</p>
            </div>

            {isGoalMet || user?.attendance_badges?.length ? (
                <div className="flex gap-0.5">
                    <BagdeIcon
                        width={24}
                        height={24}
                        fill="#32d583"
                    />
                    <Badge color="success">
                        <span className="text-xs font-bold">{user?.total_badges}</span>
                    </Badge>
                </div>
            ) : null}
        </div>
    );
}



const ChartSection = ({ percentage, fromColor, toColor, level, message }) => (
    <div className="space-y-5">
        <SemiCircleProgress
            percentage={percentage}
            fillColor={fromColor}
            toColor={toColor}
            level={level}
        />

        <div className="text-center">
            <p className="text-sm text-gray-700 dark:text-gray-300 sm:text-base">
                {message}
            </p>
        </div>
    </div>
);

export default MonthlyTarget;