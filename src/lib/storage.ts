import { DashboardData, Task, MonthlyData, TaskCategory } from './types';

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
      dailyTasks: {},
      weeklyTasks: {},
      dailyProgress: {},
    },
    business: {
      bestFlightAlerts: {
        emailsSent: 0,
        subscribers: 0,
        targetSubscribers: 1000,
        tasks: [],
        dailyTasks: {},
        weeklyTasks: {},
      },
      webTailors: {
        clients: 0,
        targetClients: 5,
        revenue: 0,
        websitesCreated: 0,
        tasks: [],
        dailyTasks: {},
        weeklyTasks: {},
      },
    },
    monthlyArchive: {},
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
  const previousMonth = currentData.currentMonth;
  
  // Archive current month data
  const archiveData: MonthlyData = {
    month: previousMonth,
    year: new Date().getFullYear().toString(),
    personal: { ...currentData.personal },
    business: { ...currentData.business },
  };
  
  const monthKey = previousMonth.replace(' ', '-');
  
  const newData: DashboardData = {
    ...currentData,
    currentMonth: newMonth,
    personal: {
      ...currentData.personal,
      dailyProgress: {},
      dailyTasks: {},
      weeklyTasks: {},
      tasks: currentData.personal.tasks.map(task => ({ 
        ...task, 
        completed: false,
        notes: [...task.notes] 
      })),
    },
    business: {
      bestFlightAlerts: {
        ...currentData.business.bestFlightAlerts,
        emailsSent: 0,
        dailyTasks: {},
        weeklyTasks: {},
        tasks: currentData.business.bestFlightAlerts.tasks.map(task => ({ 
          ...task, 
          completed: false,
          notes: [...task.notes]
        })),
      },
      webTailors: {
        ...currentData.business.webTailors,
        clients: 0,
        revenue: 0,
        websitesCreated: 0,
        dailyTasks: {},
        weeklyTasks: {},
        tasks: currentData.business.webTailors.tasks.map(task => ({ 
          ...task, 
          completed: false,
          notes: [...task.notes]
        })),
      },
    },
    monthlyArchive: {
      ...currentData.monthlyArchive,
      [monthKey]: archiveData,
    },
  };
  
  saveDashboardData(newData);
  return newData;
};

export const exportMonthlyDataToCSV = (monthKey: string): string => {
  const data = loadDashboardData();
  const monthData = data.monthlyArchive[monthKey];
  
  if (!monthData) {
    return '';
  }
  
  // Headers
  let csv = 'Category,TaskName,Completed,CreatedDate,Day,Week,Notes\n';
  
  // Personal tasks
  const personalTasks = monthData.personal.tasks || [];
  personalTasks.forEach(task => {
    const notes = task.notes?.map(note => note.content).join(' | ') || '';
    csv += `Personal,"${task.name}",${task.completed},${task.createdAt},${task.day || ''},${task.week || ''},"${notes}"\n`;
  });
  
  // Business tasks - BestFlightAlerts
  const bfaTasks = monthData.business.bestFlightAlerts.tasks || [];
  bfaTasks.forEach(task => {
    const notes = task.notes?.map(note => note.content).join(' | ') || '';
    csv += `Business-BFA,"${task.name}",${task.completed},${task.createdAt},${task.day || ''},${task.week || ''},"${notes}"\n`;
  });
  
  // Business tasks - WebTailors
  const wtTasks = monthData.business.webTailors.tasks || [];
  wtTasks.forEach(task => {
    const notes = task.notes?.map(note => note.content).join(' | ') || '';
    csv += `Business-WT,"${task.name}",${task.completed},${task.createdAt},${task.day || ''},${task.week || ''},"${notes}"\n`;
  });
  
  return csv;
};

export const downloadCSV = (monthKey: string): void => {
  const csv = exportMonthlyDataToCSV(monthKey);
  
  if (!csv) {
    console.error('No data found for the specified month');
    return;
  }
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${monthKey}-dashboard-data.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const createNewTask = (
  name: string, 
  category: TaskCategory, 
  day?: number, 
  week?: number
): Task => {
  return {
    id: crypto.randomUUID(),
    name,
    completed: false,
    category,
    day,
    week,
    notes: [],
    createdAt: new Date().toISOString(),
    score: 5, // Default score
  };
};

export const addNoteToTask = (task: Task, noteContent: string): Task => {
  const newNote = {
    id: crypto.randomUUID(),
    content: noteContent,
    createdAt: new Date().toISOString(),
  };
  
  return {
    ...task,
    notes: [...task.notes, newNote],
  };
}; 