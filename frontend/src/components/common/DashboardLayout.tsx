import React, { useState } from 'react';
import { DashboardHeader } from './DashboardHeader';
import { DashboardSidebar } from './DashboardSidebar';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-full overflow-hidden bg-slate-100 flex flex-col">
      {/* Top Header - Stays fixed at the top */}
      <DashboardHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Container: Fixed Sidebar + Independently Scrollable Page Content */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Navigation Sidebar Component - Pinned on the left, does not scroll with page data */}
        <DashboardSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main Page Content - Only this container scrolls when there is lots of data */}
        <main className="flex-1 h-full overflow-y-auto min-w-0 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto pb-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
