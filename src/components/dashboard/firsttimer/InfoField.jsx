import { Link } from "react-router-dom";

export const InfoField = ({ icon: Icon, label, value, fullWidth = false, isEmail = false, isPhone = false }) => (
    <div className={`${fullWidth ? 'col-span-2' : 'col-span-1'}`}>
        <div className="flex items-start gap-2 mb-1">
            <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0 shrink-0" />
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                {label}
            </span>
        </div>
        {isEmail ? (
            <Link to={`mailto:${value}`} className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 ml-6 hover:underline">
                <span className="">{value || 'N/A'}</span>
            </Link>
        ) : isPhone ? (
            <Link to={`tel:${value}`} className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 ml-6 hover:underline">
                {value || 'N/A'}
            </Link>
        ) : (
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 ml-6">
                {value || 'N/A'}
            </p>
        )}
    </div>
);