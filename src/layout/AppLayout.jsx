import ProgressBar from "@/components/others/ProgressBar";
import { ScrollToTop } from "@/components/others/ScrollToTop";
import ProfileCompletionBanner from "@/components/userProfile/ProfileCompletionBanner";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/app/AppHeader";
import AppSidebar from "@/layout/app/AppSidebar";
import Backdrop from "@/layout/app/Backdrop";
import { useMe } from "@/queries/auth.query";
import { useAuthStore } from "@/store/auth.store";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  useMe()
  return (
    <>
      <ProgressBar />
      <ScrollToTop />

      <SidebarProvider>
        <AppLayoutInner />
      </SidebarProvider>
    </>
  );
};

const AppLayoutInner = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen xl:flex">
      <div>
        <AppSidebar />
        <Backdrop />
      </div>

      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
          } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader />

        <div className="p-4 md:p-6 mx-auto">
          {!user?.profile_completed && (
            <ProfileCompletionBanner
              completion_percent={user?.completion_percent}
            />
          )}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
