import { useState, useEffect } from 'react';
import { PersonalDashboard } from './personal-dashboard';
import { BusinessDashboard } from './business-dashboard';
import { DashboardData, PersonalData, BusinessData, TaskCategory } from '@/lib/types';
import { EditableField } from './ui/editable-field';

interface DashboardTabsProps {
  data: DashboardData;
  onUpdate: (data: DashboardData) => void;
  onResetDay: () => void;
}

export function DashboardTabs({ data, onUpdate, onResetDay }: DashboardTabsProps) {
  const [activeTab, setActiveTab] = useState<TaskCategory>('Personal');
  const [activeView, setActiveView] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Ensure data structures are properly initialized
  const ensureDataStructure = () => {
    let needsUpdate = false;
    let updatedData = { ...data };
    
    // Initialize personal data if missing
    if (!data.personal.dailyTasks) {
      updatedData.personal.dailyTasks = {};
      needsUpdate = true;
    }
    
    if (!data.personal.weeklyTasks) {
      updatedData.personal.weeklyTasks = {};
      needsUpdate = true;
    }
    
    // Initialize business data if missing
    if (!data.business.bestFlightAlerts.dailyTasks) {
      updatedData.business.bestFlightAlerts.dailyTasks = {};
      needsUpdate = true;
    }
    
    if (!data.business.bestFlightAlerts.weeklyTasks) {
      updatedData.business.bestFlightAlerts.weeklyTasks = {};
      needsUpdate = true;
    }
    
    if (!data.business.webTailors.dailyTasks) {
      updatedData.business.webTailors.dailyTasks = {};
      needsUpdate = true;
    }
    
    if (!data.business.webTailors.weeklyTasks) {
      updatedData.business.webTailors.weeklyTasks = {};
      needsUpdate = true;
    }
    
    if (needsUpdate) {
      onUpdate(updatedData);
    }
  };
  
  // Initialize data on mount
  useEffect(() => {
    ensureDataStructure();
  }, []);

  const handlePersonalUpdate = (updatedPersonal: PersonalData) => {
    // Ensure we're not introducing undefined values
    if (!updatedPersonal.dailyTasks) updatedPersonal.dailyTasks = {};
    if (!updatedPersonal.weeklyTasks) updatedPersonal.weeklyTasks = {};
    
    onUpdate({
      ...data,
      personal: updatedPersonal,
    });
  };

  const handleBusinessUpdate = (updatedBusiness: BusinessData) => {
    // Ensure we're not introducing undefined values
    if (!updatedBusiness.bestFlightAlerts.dailyTasks) updatedBusiness.bestFlightAlerts.dailyTasks = {};
    if (!updatedBusiness.bestFlightAlerts.weeklyTasks) updatedBusiness.bestFlightAlerts.weeklyTasks = {};
    if (!updatedBusiness.webTailors.dailyTasks) updatedBusiness.webTailors.dailyTasks = {};
    if (!updatedBusiness.webTailors.weeklyTasks) updatedBusiness.webTailors.weeklyTasks = {};
    
    onUpdate({
      ...data,
      business: updatedBusiness,
    });
  };

  const handleMonthUpdate = (month: string) => {
    onUpdate({
      ...data,
      currentMonth: month,
    });
  };

  return (
    <div className="bg-slate-800 rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-2xl font-bold text-white">
            <EditableField
              value={data.currentMonth}
              onChange={handleMonthUpdate}
              className="min-w-[200px] bg-transparent border-none p-0 focus:ring-0 font-bold text-2xl"
            />
          </h2>

          <div className="flex">
            <div className="flex bg-slate-700 rounded-lg p-1 mr-4">
              <button
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${
                  activeView === 'daily'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
                onClick={() => setActiveView('daily')}
              >
                Daily
              </button>
              <button
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${
                  activeView === 'weekly'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
                onClick={() => setActiveView('weekly')}
              >
                Weekly
              </button>
              <button
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${
                  activeView === 'monthly'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
                onClick={() => setActiveView('monthly')}
              >
                Monthly
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-slate-700">
        <div className="flex">
          <button
            className={`px-6 py-3 text-lg font-medium transition ${
              activeTab === 'Personal'
                ? 'text-white border-b-2 border-blue-500'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
            onClick={() => setActiveTab('Personal')}
          >
            Personal Dashboard
          </button>
          <button
            className={`px-6 py-3 text-lg font-medium transition ${
              activeTab === 'Business'
                ? 'text-white border-b-2 border-blue-500'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
            onClick={() => setActiveTab('Business')}
          >
            Business Dashboard
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'Personal' ? (
          <PersonalDashboard 
            data={data.personal} 
            onUpdate={handlePersonalUpdate} 
            onResetDay={onResetDay}
            viewMode={activeView}
          />
        ) : (
          <BusinessDashboard 
            data={data.business} 
            onUpdate={handleBusinessUpdate}
            viewMode={activeView}
          />
        )}
      </div>
    </div>
  );
} 