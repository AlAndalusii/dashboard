'use client';

import { useState, useEffect } from 'react';
import { DayCounter } from '@/components/day-counter';
import { DashboardTabs } from '@/components/dashboard-tabs';
import { DashboardData } from '@/lib/types';
import { loadDashboardData, saveDashboardData, resetMonthlyData, downloadCSV } from '@/lib/storage';
import { MonthlyArchive } from '@/components/monthly-archive';

export default function Home() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showArchive, setShowArchive] = useState(false);

  useEffect(() => {
    // Load data on client-side
    const data = loadDashboardData();
    setDashboardData(data);
    setIsLoading(false);
  }, []);

  const handleDataUpdate = (newData: DashboardData) => {
    setDashboardData(newData);
    saveDashboardData(newData);
  };

  const handleDayIncrement = () => {
    if (!dashboardData) return;
    
    const newData = {
      ...dashboardData,
      dayCounter: dashboardData.dayCounter + 1,
    };
    
    handleDataUpdate(newData);
  };

  const handleResetDay = () => {
    if (!dashboardData) return;
    
    const newData = {
      ...dashboardData,
      dayCounter: 0,
    };
    
    handleDataUpdate(newData);
  };

  const handleResetMonth = () => {
    const newData = resetMonthlyData();
    setDashboardData(newData);
  };

  const handleSaveData = () => {
    if (dashboardData) {
      saveDashboardData(dashboardData);
      // Show a toast or notification here if you have one
      alert("Data saved successfully!");
    }
  };

  const handleExportCSV = (monthKey: string) => {
    downloadCSV(monthKey);
  };

  const handlePrepareNextMonth = () => {
    // Open a confirmation dialog
    if (confirm("Prepare data for next month? This will save current progress and reset counters.")) {
      const newData = resetMonthlyData();
      setDashboardData(newData);
      alert("Ready for the next month! Your previous data has been saved.");
    }
  };

  if (isLoading || !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 border-b border-slate-700 pb-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-white">Business Dashboard</h1>
              <p className="text-slate-400">Track your personal and business tasks with precision</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
              <button
                onClick={handleSaveData}
                className="px-4 py-2 bg-emerald-600 rounded-lg hover:bg-emerald-500 transition-colors text-sm font-medium text-white shadow-sm"
              >
                Save Data
              </button>
              
              <button
                onClick={handlePrepareNextMonth}
                className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors text-sm font-medium text-white shadow-sm"
              >
                Prepare Next Month
              </button>
              
              <button
                onClick={() => setShowArchive(!showArchive)}
                className="px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-medium text-white shadow-sm"
              >
                {showArchive ? 'Hide Archive' : 'Monthly Archive'}
              </button>
            </div>
          </div>
        </header>

        <main>
          {showArchive ? (
            <MonthlyArchive 
              monthlyArchive={dashboardData.monthlyArchive} 
              onExportCSV={handleExportCSV}
              onClose={() => setShowArchive(false)}
            />
          ) : (
            <>
              <div className="mb-8 bg-slate-800 rounded-xl shadow-lg p-6">
                <DayCounter currentDay={dashboardData.dayCounter} onIncrement={handleDayIncrement} />
              </div>
              
              <DashboardTabs 
                data={dashboardData} 
                onUpdate={handleDataUpdate} 
                onResetDay={handleResetDay} 
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
