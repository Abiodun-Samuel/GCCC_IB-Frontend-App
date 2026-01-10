import { Link } from 'react-router-dom';

export const InfoField = ({ icon: Icon, label, value, type }) => {
    // Format the display value based on type
    const getDisplayValue = () => {
        // Handle null or undefined
        if (value === null || value === undefined) {
            return (
                <span className="text-gray-400 dark:text-gray-500 font-normal italic">
                    Not assigned
                </span>
            );
        }

        // Handle boolean values
        if (typeof value === 'boolean') {
            return (
                <span className={`font-semibold ${value ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {value ? 'Yes' : 'No'}
                </span>
            );
        }

        // Handle empty strings
        if (typeof value === 'string' && value.trim() === '') {
            return (
                <span className="text-gray-400 dark:text-gray-500 font-normal italic">
                    Not assigned
                </span>
            );
        }

        // Handle numbers (including 0)
        if (typeof value === 'number') {
            return value.toString();
        }

        // Handle arrays
        if (Array.isArray(value)) {
            if (value.length === 0) {
                return (
                    <span className="text-gray-400 dark:text-gray-500 font-normal italic">
                        Not provided
                    </span>
                );
            }
            return value.join(', ');
        }

        // Handle objects
        if (typeof value === 'object') {
            return JSON.stringify(value);
        }

        // Default: return the value as string
        return String(value);
    };

    // Get the appropriate link href based on type
    const getLinkHref = () => {
        if (!value || typeof value !== 'string') return null;

        switch (type) {
            case 'email':
                return `mailto:${value}`;
            case 'phone':
                return `tel:${value.replace(/\s+/g, '')}`;
            case 'whatsapp':
                // Remove all non-numeric characters for WhatsApp
                const cleanNumber = value.replace(/\D/g, '');
                return `https://wa.me/${cleanNumber}`;
            default:
                return null;
        }
    };

    const linkHref = getLinkHref();
    const displayValue = getDisplayValue();
    const isEmptyValue = value === null || value === undefined ||
        (typeof value === 'string' && value.trim() === '') ||
        (Array.isArray(value) && value.length === 0);

    return (
        <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Icon className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0 w-full">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    {label}
                </p>
                <div className={`text-sm text-wrap font-semibold ${isEmptyValue
                        ? 'text-gray-400 dark:text-gray-500 italic'
                        : 'text-gray-900 dark:text-white'
                    }`}>
                    {linkHref ? (
                        <Link
                            to={linkHref}
                            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors underline decoration-dotted underline-offset-2"
                        >
                            {displayValue}
                        </Link>
                    ) : (
                        displayValue
                    )}
                </div>
            </div>
        </div>
    );
};