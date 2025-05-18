'use client';

import { useState, useEffect } from 'react';
import { DayCounter } from '@/components/day-counter';
import { DashboardTabs } from '@/components/dashboard-tabs';
import { DashboardData } from '@/lib/types';
import { loadDashboardData, saveDashboardData, resetMonthlyData } from '@/lib/storage';

export default function Home() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleResetMonth = () => {
    const newData = resetMonthlyData();
    setDashboardData(newData);
  };

  if (isLoading || !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Personal & Business Dashboard</h1>
            <p className="text-white/60">Track your personal growth and business metrics</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <button
              onClick={handleResetMonth}
              className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-sm"
            >
              Reset Monthly Data
            </button>
          </div>
        </header>

        <main>
          <DayCounter currentDay={dashboardData.dayCounter} onIncrement={handleDayIncrement} />
          
          <DashboardTabs data={dashboardData} onUpdate={handleDataUpdate} />
        </main>
      </div>
    </div>
  );
}
