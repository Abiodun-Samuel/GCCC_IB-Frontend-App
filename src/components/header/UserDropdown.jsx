import { useState } from "react";
import { ArrowDownIcon, AttendanceIcon2, DashboardIcon, LogoutIcon, UserIcon2 } from "@/icons";
import { Dropdown } from '../../components/ui/dropdown/Dropdown'
import { DropdownItem } from '../../components/ui/dropdown/DropdownItem'
import { useLogout } from "@/queries/auth.query";
import { useAuthStore } from "@/store/auth.store";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import RoleBadge from "@/components/userProfile/RoleBadge";


export default function UserDropdown() {
  const { user } = useAuthStore();
  const { mutate, isPending } = useLogout();

  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 text-gray-700 dropdown-toggle dark:text-gray-400"
      >
        <Avatar
          size="sm" src={user?.avatar || ''} name={user?.initials || ''}
          isProfileCompleted={user?.profile_completed}
          showProfileStatus
        />
        <span className="block mr-1 font-medium text-theme-sm">
          {user?.first_name}
        </span>
        <ArrowDownIcon className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={toggleDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <div>
          <span className="flex items-start gap-2 font-medium text-gray-700 text-theme-sm dark:text-gray-400">
            {user?.first_name} {user?.last_name}
          </span>
          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
            {user?.email}
          </span>
          <div className="flex items-center gap-2 mt-2">
            <RoleBadge showIcon />
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <svg className="w-3.5 h-3.5 fill-amber-500 dark:fill-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                {user?.total_stars || 0}
              </span>
            </div>
          </div>
        </div>

        <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
          <li>
            <DropdownItem
              onItemClick={toggleDropdown}
              tag="a"
              to='/dashboard'
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <DashboardIcon className="fill-gray-500 group-hover:fill-gray-700 dark:fill-gray-400 dark:group-hover:fill-gray-300" />
              Dashboard
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={toggleDropdown}
              tag="a"
              to="/dashboard/profile"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <UserIcon2 className="fill-gray-500 group-hover:fill-gray-700 dark:fill-gray-400 dark:group-hover:fill-gray-300" />
              Profile
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={toggleDropdown}
              tag="a"
              to="/dashboard/attendance"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <AttendanceIcon2 className="fill-gray-500 group-hover:fill-gray-700 dark:fill-gray-400 dark:group-hover:fill-gray-300" />
              Attendance
            </DropdownItem>
          </li>
        </ul>

        <Button
          loading={isPending}
          onClick={mutate}
          className="mt-3"
          variant="ghost"
          startIcon={<LogoutIcon width={18} height={18} />}
        >
          Sign out
        </Button>
      </Dropdown>
    </div>
  );
}