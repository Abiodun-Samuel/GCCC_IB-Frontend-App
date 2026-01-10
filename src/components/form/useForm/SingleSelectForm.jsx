import { useState, memo, useEffect, useRef } from "react";

const SingleSelectForm = memo(({
    label,
    name,
    options = [],
    register = () => { },
    setValue,
    error,
    placeholder = "Select an option",
    required = false,
    disabled = false,
    searchable = true,
    maxHeight = "16rem",
    expandParent = false,
    defaultValue = ""
}) => {
    const [selectedValue, setSelectedValue] = useState(defaultValue);
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [dropdownHeight, setDropdownHeight] = useState(0);
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);
    const dropdownContentRef = useRef(null);
    const containerRef = useRef(null);

    // Register with react-hook-form
    useEffect(() => {
        if (register && name) {
            register(name, {
                required: required ? `${label || 'This field'} is required` : false,
            });
        }
    }, [register, name, required, label]);

    // Update form value when selection changes
    useEffect(() => {
        if (setValue && name) {
            setValue(name, selectedValue);
        }
    }, [selectedValue, setValue, name]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchQuery("");
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    // Focus search input when dropdown opens
    useEffect(() => {
        if (isOpen && searchable && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen, searchable]);

    // Measure dropdown height and animate parent container
    useEffect(() => {
        if (expandParent) {
            if (isOpen && dropdownContentRef.current) {
                const height = dropdownContentRef.current.offsetHeight;
                setDropdownHeight(height);
            } else {
                setDropdownHeight(0);
            }
        }
    }, [isOpen, searchQuery, options, expandParent]);

    const toggleDropdown = () => {
        if (!disabled) {
            setIsOpen((prev) => !prev);
        }
    };

    const handleSelect = (optionValue) => {
        setSelectedValue(optionValue);
        setIsOpen(false);
        setSearchQuery("");
    };

    const clearSelection = (event) => {
        event?.stopPropagation();
        setSelectedValue("");
    };

    const selectedOption = options.find((option) => option.value === selectedValue);
    const selectedText = selectedOption?.text || "";

    // Filter options based on search query
    const filteredOptions = searchable && searchQuery
        ? options.filter((option) =>
            option.text.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : options;

    return (
        <div
            ref={containerRef}
            className="w-full transition-all duration-300 ease-in-out"
            style={{
                paddingBottom: expandParent && isOpen ? `${dropdownHeight + 8}px` : '0px'
            }}
        >
            <div ref={dropdownRef}>
                {label && (
                    <label
                        htmlFor={name}
                        className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200"
                    >
                        {label}
                        {required && <span className="text-red-500 ml-0.5" aria-label="required">*</span>}
                    </label>
                )}

                <div className="relative inline-block w-full">
                    {/* Main Control Wrapper */}
                    <div className="flex items-center gap-2">
                        {/* Main Select Button */}
                        <button
                            type="button"
                            id={name}
                            onClick={toggleDropdown}
                            disabled={disabled}
                            aria-invalid={error ? "true" : "false"}
                            aria-describedby={error ? `${name}-error` : undefined}
                            className={`
                                flex-1 flex items-center justify-between rounded-lg px-4 py-2.5 text-left
                                transition-colors duration-200
                                bg-white dark:bg-gray-800
                                border focus:outline-none focus:ring-1
                                ${error
                                    ? "border-red-500 dark:border-red-400 focus:ring-red-200 dark:focus:ring-red-900"
                                    : isOpen
                                        ? "border-blue-500 dark:border-blue-400 ring-1 ring-blue-200 dark:ring-blue-900"
                                        : "border-gray-300 dark:border-gray-600 focus:ring-blue-200 dark:focus:ring-blue-900 focus:border-blue-500 dark:focus:border-blue-400"
                                }
                                ${disabled
                                    ? "bg-gray-100 dark:bg-gray-900 cursor-not-allowed opacity-60"
                                    : "cursor-pointer hover:border-gray-400 dark:hover:border-gray-500"
                                }
                            `}
                            aria-haspopup="listbox"
                            aria-expanded={isOpen}
                            aria-labelledby={label ? `${name}-label` : undefined}
                        >
                            <span
                                className={`text-sm w-2 font-normal flex-1 truncate ${selectedText
                                    ? "text-gray-900 dark:text-gray-100"
                                    : "text-gray-400 dark:text-gray-500"
                                    }`}
                            >
                                {selectedText || placeholder}
                            </span>

                            {/* Dropdown arrow */}
                            <svg
                                className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                                    }`}
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M4.79175 7.39551L10.0001 12.6038L15.2084 7.39551"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>

                        {/* Clear Selection Button */}
                        {selectedValue && !disabled && (
                            <button
                                type="button"
                                onClick={clearSelection}
                                className="flex items-center justify-center w-10 h-[2.75rem] rounded-lg border border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-1 focus:ring-blue-200 dark:focus:ring-blue-900 transition-colors duration-200"
                                aria-label="Clear selection"
                            >
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M12 4L4 12M4 4L12 12"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Dropdown Menu */}
                    {isOpen && (
                        <div
                            ref={dropdownContentRef}
                            className="absolute left-0 z-50 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 dark:border-gray-600 overflow-hidden"
                            role="listbox"
                            aria-labelledby={label ? `${name}-label` : undefined}
                        >
                            {/* Search Input */}
                            {searchable && (
                                <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                            <svg
                                                className="w-4 h-4 text-gray-400 dark:text-gray-500"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                />
                                            </svg>
                                        </div>
                                        <input
                                            ref={searchInputRef}
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search..."
                                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-200 dark:focus:ring-blue-900 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-colors duration-200"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Options List */}
                            <div
                                className="overflow-y-auto py-1"
                                style={{ maxHeight }}
                            >
                                {filteredOptions.length > 0 ? (
                                    filteredOptions.map((option, index) => {
                                        const isSelected = option.value === selectedValue;
                                        return (
                                            <button
                                                key={`${option.value}-${index}`}
                                                type="button"
                                                onClick={() => handleSelect(option.value)}
                                                className={`w-full text-left px-4 py-2.5 text-sm font-normal transition-colors duration-200 ${isSelected
                                                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                                    }`}
                                                role="option"
                                                aria-selected={isSelected}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="flex-1 truncate">{option.text}</span>
                                                    {isSelected && (
                                                        <svg
                                                            className="w-4 h-4 text-blue-600 dark:text-blue-400 ml-2 flex-shrink-0"
                                                            fill="none"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })
                                ) : (
                                    <div className="px-4 py-6 text-sm text-center text-gray-400 dark:text-gray-500">
                                        <svg
                                            className="w-10 h-10 mx-auto mb-2 text-gray-300 dark:text-gray-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        <p className="font-medium">
                                            {searchQuery ? "No results found" : "No options available"}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <p
                        id={`${name}-error`}
                        className="text-red-500 dark:text-red-400 text-xs mt-1"
                        role="alert"
                    >
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
});

SingleSelectForm.displayName = "SingleSelectForm";
export default SingleSelectForm