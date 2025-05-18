import { useState } from 'react';
import { PersonalDashboard } from './personal-dashboard';
import { BusinessDashboard } from './business-dashboard';
import { DashboardData, PersonalData, BusinessData } from '@/lib/types';
import { EditableField } from './ui/editable-field';

interface DashboardTabsProps {
  data: DashboardData;
  onUpdate: (data: DashboardData) => void;
}

export function DashboardTabs({ data, onUpdate }: DashboardTabsProps) {
  const [activeTab, setActiveTab] = useState<'personal' | 'business'>('personal');

  const handlePersonalUpdate = (updatedPersonal: PersonalData) => {
    onUpdate({
      ...data,
      personal: updatedPersonal,
    });
  };

  const handleBusinessUpdate = (updatedBusiness: BusinessData) => {
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
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          <EditableField
            value={data.currentMonth}
            onChange={handleMonthUpdate}
            className="min-w-[200px]"
          />
        </h2>
      </div>

      <div className="dashboard-tabs">
        <div className="flex border-b border-white/10">
          <button
            className={`px-6 py-3 text-lg font-medium ${
              activeTab === 'personal'
                ? 'text-white border-b-2 border-white'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
            onClick={() => setActiveTab('personal')}
          >
            Personal Dashboard
          </button>
          <button
            className={`px-6 py-3 text-lg font-medium ${
              activeTab === 'business'
                ? 'text-white border-b-2 border-white'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
            onClick={() => setActiveTab('business')}
          >
            Business Dashboard
          </button>
        </div>
      </div>

      <div className="py-6">
        {activeTab === 'personal' ? (
          <PersonalDashboard data={data.personal} onUpdate={handlePersonalUpdate} />
        ) : (
          <BusinessDashboard data={data.business} onUpdate={handleBusinessUpdate} />
        )}
      </div>
    </div>
  );
} 