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
              <div className="flex h-screen w-full overflow-hidden">
                <AdminNavigation
                  sidebarCollapsed={sidebarCollapsed}
                  setSidebarCollapsed={setSidebarCollapsed}
                />
                <main className="flex-1 h-full overflow-hidden bg-background">
                  <Outlet />
                </main>
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
