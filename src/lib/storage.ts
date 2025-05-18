import { DashboardData } from './types';

const STORAGE_KEY = 'dashboard_data';

export const getInitialData = (): DashboardData => {
  const currentDate = new Date();
  const currentMonth = `${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`;
  
  return {
    currentMonth,
    dayCounter: 1,
    personal: {
      quran: '',
      tafsir: '',
      arabic: '',
      spanish: '',
      mattersOfHeart: '',
      tasks: [],
      dailyProgress: {},
    },
    business: {
      bestFlightAlerts: {
        emailsSent: 0,
        subscribers: 0,
        targetSubscribers: 1000,
        tasks: [
          { id: crypto.randomUUID(), name: 'Create newsletter template', completed: false, difficulty: 'medium' },
          { id: crypto.randomUUID(), name: 'Send weekly newsletter', completed: false, difficulty: 'easy' },
          { id: crypto.randomUUID(), name: 'Grow subscriber list', completed: false, difficulty: 'hard' },
        ],
      },
      webTailors: {
        clients: 0,
        targetClients: 5,
        revenue: 0,
        websitesCreated: 0,
        tasks: [
          { id: crypto.randomUUID(), name: 'Finish client website', completed: false, difficulty: 'medium' },
          { id: crypto.randomUUID(), name: 'Follow up with leads', completed: false, difficulty: 'easy' },
          { id: crypto.randomUUID(), name: 'Create portfolio showcase', completed: false, difficulty: 'hard' },
        ],
      },
    },
  };
};

export const loadDashboardData = (): DashboardData => {
  if (typeof window === 'undefined') {
    return getInitialData();
  }
  
  const savedData = localStorage.getItem(STORAGE_KEY);
  if (!savedData) {
    const initialData = getInitialData();
    saveDashboardData(initialData);
    return initialData;
  }
  
  try {
    return JSON.parse(savedData) as DashboardData;
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    return getInitialData();
  }
};

export const saveDashboardData = (data: DashboardData): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const resetMonthlyData = (): DashboardData => {
  const currentData = loadDashboardData();
  const currentDate = new Date();
  const newMonth = `${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`;
  
  const newData: DashboardData = {
    ...currentData,
    currentMonth: newMonth,
    personal: {
      ...currentData.personal,
      dailyProgress: {},
      tasks: currentData.personal.tasks.map(task => ({ ...task, completed: false })),
    },
    business: {
      bestFlightAlerts: {
        ...currentData.business.bestFlightAlerts,
        emailsSent: 0,
        tasks: currentData.business.bestFlightAlerts.tasks.map(task => ({ ...task, completed: false })),
      },
      webTailors: {
        ...currentData.business.webTailors,
        clients: 0,
        revenue: 0,
        websitesCreated: 0,
        tasks: currentData.business.webTailors.tasks.map(task => ({ ...task, completed: false })),
      },
    },
  };
  
  saveDashboardData(newData);
  return newData;
}; 