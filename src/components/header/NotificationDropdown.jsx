import { Link } from "react-router-dom";
import { Bell } from "lucide-react";

export const NotificationButton = ({
  className = 'h-10 w-10',
  hasAlert = false,
  to = '/dashboard/messages'
}) => {
  return (
    <Link
      to={to}
      className={`${className} ring-2 ring-white dark:ring-gray-600 relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-900 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white`}
    >
      {/* Red Alert Indicator */}
      {hasAlert && (
        <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900" />
      )}

      {/* Notification Bell Icon */}
      <Bell size={20} />
    </Link>
  );
};