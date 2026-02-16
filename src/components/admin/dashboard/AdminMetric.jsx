import { useState } from "react";
import { FirstTimerIcon, FormIcon, UnitIcon, UserIcon, VerticalDotsIcon } from "../../../icons"
import { Dropdown } from "../../ui/dropdown/Dropdown"
import { DropdownItem } from "../../ui/dropdown/DropdownItem"
import { getRandomTextColor, toSlug } from "../../../utils/helper"

const AdminMetric = ({ data }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [iconColor] = useState(() => getRandomTextColor());

    const toggleDropdown = () => setIsOpen(!isOpen);

    const ICON_MAP = {
        Units: UnitIcon,
        Members: UserIcon,
        Forms: FormIcon,
        Default: FirstTimerIcon,
    };
    const IconComponent = ICON_MAP[data?.name] || ICON_MAP.Default;

    return (
        <>
            <div key={data?.name} className="rounded-2xl p-3 border border-gray-200 bg-white  dark:border-gray-800 dark:bg-white/[0.03] md:p-5">
                <div className="flex justify-between">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800`}>
                        <IconComponent width={30} height={30} className={iconColor} />
                    </div>
                    <div className="relative inline-block">
                        <button variant="neutral" className="p-0 m-0" onClick={toggleDropdown}>
                            <VerticalDotsIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
                        </button>
                        <Dropdown
                            isOpen={isOpen}
                            onClose={toggleDropdown}
                            className="w-40 p-2"
                        >
                            <DropdownItem to={`${data?.name == 'Units' ? '/dashboard/leaders/units' : `/dashboard/admin/${toSlug(data?.name)}`}`} tag="a"
                                onItemClick={toggleDropdown}
                                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-blue-500 hover:underline dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                            >
                                View more
                            </DropdownItem>
                        </Dropdown>
                    </div>
                </div>

                <div className="flex items-end justify-between mt-5">
                    <div>
                        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                            {data.name}
                        </span>
                        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                            {data?.count}
                        </h4>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminMetric