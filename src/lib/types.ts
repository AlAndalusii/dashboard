export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type TaskCategory = 'Personal' | 'Business';

export interface TaskNote {
  id: string;
  content: string;
  createdAt: string;
}

export interface Task {
  id: string;
  name: string;
  completed: boolean;
  score?: number; // Score from 1-10
  category: TaskCategory;
  day?: number; // Day of the month (1-31)
  week?: number; // Week number (1-5)
  notes: TaskNote[];
  createdAt: string;
}

export interface DailyTasks {
  [day: string]: Task[]; // Key is day number as string (1-31)
}

export interface WeeklyTasks {
  [week: string]: Task[]; // Key is week number as string (1-5)
}

export interface PersonalData {
  quran: string;
  tafsir: string;
  arabic: string;
  spanish: string;
  mattersOfHeart: string;
  tasks: Task[];
  dailyTasks: DailyTasks;
  weeklyTasks: WeeklyTasks;
  dailyProgress: Record<string, boolean>;
}

export interface BusinessData {
  bestFlightAlerts: {
    emailsSent: number;
    subscribers: number;
    targetSubscribers: number;
    tasks: Task[];
    dailyTasks: DailyTasks;
    weeklyTasks: WeeklyTasks;
  };
  webTailors: {
    clients: number;
    targetClients: number;
    revenue: number;
    websitesCreated: number;
    tasks: Task[];
    dailyTasks: DailyTasks;
    weeklyTasks: WeeklyTasks;
  };
}

export interface MonthlyData {
  month: string; // Format: "January 2023"
  year: string;
  personal: PersonalData;
  business: BusinessData;
}

export interface DashboardData {
  currentMonth: string;
  dayCounter: number;
  personal: PersonalData;
  business: BusinessData;
  monthlyArchive: Record<string, MonthlyData>; // Key is month-year format
} 