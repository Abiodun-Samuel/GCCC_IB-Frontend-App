import { useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { CloseIcon, HorizontaLDotsIcon, MenuIcon } from "@/icons";
import { useMe } from "@/queries/auth.query";
import { useSidebar } from "@/context/SidebarContext";
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import UserDropdown from "@/components/header/UserDropdown";
import Animated from "@/components/common/Animated";
import { HomeIcon } from "lucide-react";

const BREAKPOINT_LG = 1024;
const LOGO_DIMENSIONS = { width: 150, height: 40 };

const Logo = () => (
  <Link to="/" className="lg:hidden flex items-center gap-3" aria-label="Go to homepage">
    <HomeIcon />
    <img
      className="dark:hidden"
      src="/images/logo/logo-black.png"
      alt="Company Logo"
      width={LOGO_DIMENSIONS.width}
      height={LOGO_DIMENSIONS.height}
    />
    <img
      className="hidden dark:block"
      src="/images/logo/logo-white.png"
      alt="Company Logo"
      width={LOGO_DIMENSIONS.width}
      height={LOGO_DIMENSIONS.height}
    />
  </Link>
);

const HeaderActions = () => (
  <div className="flex items-center gap-2 sm:gap-3">
    {/* <NotificationDropdown /> */}
    <ThemeToggleButton />
  </div>
);

const DesktopActions = () => (
  <div className="hidden lg:flex items-center justify-between w-full gap-4 px-5 py-4 shadow-theme-md lg:justify-end lg:px-0 lg:shadow-none">
    <HeaderActions />
    <UserDropdown />
  </div>
);

const MobileActions = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <Animated
      animation="fade-up"
      className="flex lg:hidden items-center justify-between w-full gap-4 px-5 py-4 shadow-theme-md"
    >
      <HeaderActions />
      <UserDropdown />
    </Animated>
  );
};

const SidebarToggleButton = ({ isMobileOpen, onClick }) => (
  <button
    className="items-center justify-center w-10 h-10 text-gray-500 border-gray-200 rounded-lg z-99999 dark:border-gray-800 lg:flex dark:text-gray-400 lg:h-11 lg:w-11 lg:border hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    onClick={onClick}
    aria-label={isMobileOpen ? "Close sidebar" : "Open sidebar"}
    aria-expanded={isMobileOpen}
  >
    {isMobileOpen ? <CloseIcon /> : <MenuIcon />}
  </button>
);

const ApplicationMenuButton = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg z-99999 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden transition-colors"
    aria-label="Toggle application menu"
  >
    <HorizontaLDotsIcon />
  </button>
);

const AppHeader = () => {
  useMe();
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);

  const handleSidebarToggle = useCallback(() => {
    if (window.innerWidth >= BREAKPOINT_LG) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  }, [toggleSidebar, toggleMobileSidebar]);

  const handleApplicationMenuToggle = useCallback(() => {
    setApplicationMenuOpen((prev) => !prev);
  }, []);

  const headerClasses = useMemo(
    () =>
      "sticky top-0 flex w-full bg-white border-gray-200 z-20 dark:border-gray-800 dark:bg-gray-900 lg:border-b",
    []
  );

  const containerClasses = useMemo(
    () =>
      "flex flex-col items-center justify-between grow lg:flex-row lg:px-6",
    []
  );

  const topBarClasses = useMemo(
    () =>
      "flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4",
    []
  );

  return (
    <header className={headerClasses}>
      <div className={containerClasses}>
        <div className={topBarClasses}>
          <SidebarToggleButton
            isMobileOpen={isMobileOpen}
            onClick={handleSidebarToggle}
          />

          <Logo />

          <ApplicationMenuButton onClick={handleApplicationMenuToggle} />
        </div>

        <MobileActions isOpen={isApplicationMenuOpen} />

        <DesktopActions />
      </div>
    </header>
  );
};

export default AppHeader;
