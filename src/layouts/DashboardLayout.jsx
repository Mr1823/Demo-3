import React, { useState } from "react";
import DashboardNav from "../pages/Dashboard/DashboardNav/DashboardNav";
import { Outlet } from "react-router-dom";
import CustomHelmet from "../components/CustomHelmet/CustomHelmet";
import useUserInfo from "../hooks/useUserInfo";
import AdminNavigation from "../pages/Dashboard/AdminNavigation/AdminNavigation";
import useAuthContext from "../hooks/useAuthContext";

const DashboardLayout = () => {
  const [userFromDB, isUserLoading] = useUserInfo();
  const { user, isAuthLoading } = useAuthContext();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="font-body bg-background min-h-screen text-on-surface">
      <CustomHelmet title={"Dashboard | Sri Ram Jewellery"} />

      <>
        {!isAuthLoading && user && (
          <>
            {!isUserLoading && userFromDB?.admin ? (
              <div>
                <AdminNavigation
                  sidebarCollapsed={sidebarCollapsed}
                  setSidebarCollapsed={setSidebarCollapsed}
                />
                <div className="mt-20 mb-24 overflow-x-hidden">
                  <div
                    className={`w-[calc(100vw-70px)] ml-[65px] ${
                      !sidebarCollapsed
                        ? "md:w-[calc(100vw-280px)] md:ml-[260px]"
                        : "md:ml-[85px] md:w-[calc(100vw-110px)]"
                    } py-5 px-3 transition-all duration-500 ease-in-out md:px-6 overflow-x-auto`}
                  >
                    <Outlet />
                  </div>
                </div>
              </div>
            ) : (
              <main className="max-w-[1280px] mx-auto px-5 md:px-16 py-16 flex flex-col md:flex-row gap-8 lg:gap-16 min-h-[calc(100vh-100px)]">
                {/* Sidebar Navigation */}
                <aside className="w-full md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-outline-variant/30 pb-8 md:pb-0 md:pr-8">
                  <DashboardNav />
                </aside>
                
                {/* Main Content Area */}
                <section className="flex-1 w-full overflow-hidden">
                  <Outlet />
                </section>
              </main>
            )}
          </>
        )}
      </>
    </div>
  );
};

export default DashboardLayout;
