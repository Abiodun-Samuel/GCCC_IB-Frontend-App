import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AdminIcon,
  AttendanceIcon2,
  ChevronDownIcon,
  DashboardIcon,
  EventIcon,
  HorizontaLDotsIcon,
  UserIcon,
  LeaderIcon,
  MessageIcon,
} from '@/icons';
import { adminNavItems, leaderNavItems, navItems } from '@/utils/data';
import { useAuthStore } from '@/store/auth.store';
import { useSidebar } from '@/context/SidebarContext';
import {
  AdminAttendanceBadge,
  AdminDashboardBadge,
  AdminFirstTimersBadge,
  AdminFollowUpBadge,
  AdminFormsBadge,
  AdminMembersBadge,
  AdminSettingsBadge,
  LeaderDashboardBadge,
  LeaderUnitsBadge,
} from '@/icons/sidebarIcons';

const AppSidebar = () => {
  const { isExpanded, isMobileOpen, toggleMobileSidebar } = useSidebar();
  const location = useLocation();
  const { isAdmin, isLeader } = useAuthStore();

  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [subMenuHeight, setSubMenuHeight] = useState({});
  const subMenuRefs = useRef({});

  const isActive = useCallback(
    (path) => location.pathname === path,
    [location.pathname]
  );

  const hasActiveSubmenuItem = useCallback(
    (menuItem) => {
      if (!menuItem.subItems) return false;
      return menuItem.subItems.some((subItem) => isActive(subItem.path));
    },
    [isActive]
  );

  const findActiveSubmenu = useCallback(
    (items, menuType) => {
      for (let index = 0; index < items.length; index++) {
        const nav = items[index];
        if (hasActiveSubmenuItem(nav)) {
          return { type: menuType, index };
        }
      }
      return null;
    },
    [hasActiveSubmenuItem]
  );

  const handleLinkClick = useCallback(() => {
    if (isMobileOpen && toggleMobileSidebar) {
      toggleMobileSidebar();
    }
  }, [isMobileOpen, toggleMobileSidebar]);


  const iconMap = {
    AdminIcon,
    AttendanceIcon2,
    DashboardIcon,
    EventIcon,
    UserIcon,
    LeaderIcon,
    MessageIcon,
  };

  const adminBadgeMap = {
    Dashboard: AdminDashboardBadge,
    Attendance: AdminAttendanceBadge,
    'Attendance Records': AdminAttendanceBadge,
    'First Timers': AdminFirstTimersBadge,
    Members: AdminMembersBadge,
    Events: AdminMembersBadge,
    Forms: AdminFormsBadge,
    'Follow-Up Feedbacks': AdminFollowUpBadge,
    Settings: AdminSettingsBadge,
  };

  const leaderBadgeMap = {
    Dashboard: LeaderDashboardBadge,
    Units: LeaderUnitsBadge,
    'Attendance Records': AdminAttendanceBadge,
  };

  useEffect(() => {
    if (isAdmin) {
      const activeAdminSubmenu = findActiveSubmenu(adminNavItems, 'admin');
      if (activeAdminSubmenu) {
        setOpenSubmenu(activeAdminSubmenu);
        return;
      }
    }

    const activeMainSubmenu = findActiveSubmenu(navItems, 'main');
    if (activeMainSubmenu) {
      setOpenSubmenu(activeMainSubmenu);
      return;
    }

    const allItems = isAdmin ? [...adminNavItems, ...navItems] : navItems;
    const isOnSubmenuRoute = allItems.some((item) =>
      hasActiveSubmenuItem(item)
    );

    if (!isOnSubmenuRoute) {
      const isTopLevelRoute = allItems.some(
        (item) => !item.subItems && isActive(item.path)
      );
      if (isTopLevelRoute) {
        setOpenSubmenu(null);
      }
    }
  }, [
    location.pathname,
    isActive,
    findActiveSubmenu,
    hasActiveSubmenuItem,
    isAdmin,
  ]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index, menuType) => {
    // Don't close mobile sidebar when toggling dropdown
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderBadge = (menuType, subItem) => {
    if (menuType === 'admin' && subItem.pro) {
      const BadgeComponent = adminBadgeMap[subItem.name];
      return BadgeComponent ? <BadgeComponent /> : null;
    }
    if (menuType === 'leaders') {
      const BadgeComponent = leaderBadgeMap[subItem.name];
      return BadgeComponent ? <BadgeComponent /> : null;
    }
    return null;
  };

  const renderMenuItems = (items, menuType) => {
    return (
      <ul className="flex flex-col gap-4">
        {items?.map((nav, index) => {
          const Icon = iconMap[nav.icon];
          const isSubmenuOpen =
            openSubmenu?.type === menuType && openSubmenu?.index === index;
          const hasActiveSubItem = hasActiveSubmenuItem(nav);

          return (
            <li key={nav.name}>
              {nav.subItems ? (
                <button
                  onClick={() => handleSubmenuToggle(index, menuType)}
                  className={`menu-item group ${isSubmenuOpen || hasActiveSubItem
                    ? 'menu-item-active'
                    : 'menu-item-inactive'
                    } cursor-pointer ${!isExpanded ? 'lg:justify-center' : 'lg:justify-start'
                    }`}
                >
                  <span
                    className={`menu-item-icon-size ${isSubmenuOpen || hasActiveSubItem
                      ? 'menu-item-icon-active'
                      : 'menu-item-icon-inactive'
                      }`}
                  >
                    <Icon width={30} height={30} />
                  </span>
                  {(isExpanded || isMobileOpen) && (
                    <span className="menu-item-text">{nav.name}</span>
                  )}
                  {(isExpanded || isMobileOpen) && (
                    <ChevronDownIcon
                      className={`ml-auto w-5 h-5 transition-transform duration-200 ${isSubmenuOpen ? 'rotate-180 text-brand-500' : ''
                        }`}
                    />
                  )}
                </button>
              ) : (
                nav.path && (
                  <Link
                    to={nav.path}
                    onClick={handleLinkClick}
                    className={`menu-item group ${isActive(nav.path)
                      ? 'menu-item-active'
                      : 'menu-item-inactive'
                      }`}
                  >
                    <span
                      className={`menu-item-icon-size ${isActive(nav.path)
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive'
                        }`}
                    >
                      <Icon width={30} height={30} />
                    </span>
                    {(isExpanded || isMobileOpen) && (
                      <span className="menu-item-text">{nav.name}</span>
                    )}
                  </Link>
                )
              )}
              {nav.subItems && (isExpanded || isMobileOpen) && (
                <div
                  ref={(el) => {
                    subMenuRefs.current[`${menuType}-${index}`] = el;
                  }}
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    height: isSubmenuOpen
                      ? `${subMenuHeight[`${menuType}-${index}`]}px`
                      : '0px',
                  }}
                >
                  <ul className="mt-2 space-y-1 ml-9">
                    {nav.subItems.map((subItem) => {
                      const badge = renderBadge(menuType, subItem);

                      return (
                        <li key={subItem.name}>
                          <Link
                            to={subItem.path}
                            onClick={handleLinkClick}
                            className={`menu-dropdown-item ${isActive(subItem.path)
                              ? 'menu-dropdown-item-active'
                              : 'menu-dropdown-item-inactive'
                              }`}
                          >
                            <span className="flex-1 truncate">
                              {subItem.name}
                            </span>
                            {badge && (
                              <span className="flex items-center ml-2">
                                {badge}
                              </span>
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <aside
      className={`fixed flex flex-col mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 dark:text-gray-100 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen ? 'w-[290px]' : 'w-[90px]'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0`}
    >
      <div
        className={`pt-5 flex ${!isExpanded ? 'lg:justify-center' : 'justify-start'
          }`}
      >
        <Link to="/" onClick={handleLinkClick}>
          {isExpanded || isMobileOpen ? (
            <>
              <img
                className="dark:hidden"
                src="/images/logo/logo-black.png"
                alt="Logo"
                width={150}
                height={40}
              />
              <img
                className="hidden dark:block"
                src="/images/logo/logo-white.png"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <img
              src="/images/logo/gccc.png"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mt-10">
          <div className="flex flex-col gap-4">
            {isAdmin && (
              <div>
                <h2
                  className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 dark:text-gray-500 ${!isExpanded ? 'lg:justify-center' : 'justify-start'
                    }`}
                >
                  {isExpanded || isMobileOpen ? (
                    'Admin'
                  ) : (
                    <HorizontaLDotsIcon className="size-6" />
                  )}
                </h2>
                {renderMenuItems(adminNavItems, 'admin')}
              </div>
            )}
            {isAdmin || isLeader ? (
              <div>
                <h2
                  className={`mb-4 text-xs uppercase flex  leading-5 text-gray-400 dark:text-gray-500 ${!isExpanded ? 'lg:justify-center' : 'justify-start'
                    }`}
                >
                  {isExpanded || isMobileOpen ? (
                    'Leaders'
                  ) : (
                    <HorizontaLDotsIcon className="size-6" />
                  )}
                </h2>
                {renderMenuItems(leaderNavItems, 'leaders')}
              </div>
            ) : null}
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-5 text-gray-400 dark:text-gray-500 ${!isExpanded ? 'lg:justify-center' : 'justify-start'
                  }`}
              >
                {isExpanded || isMobileOpen ? (
                  'Members'
                ) : (
                  <HorizontaLDotsIcon className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItems, 'members')}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;