export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface Task {
  id: string;
  name: string;
  completed: boolean;
  difficulty?: DifficultyLevel;
}

export interface PersonalData {
  quran: string;
  tafsir: string;
  arabic: string;
  spanish: string;
  mattersOfHeart: string;
  tasks: Task[];
  dailyProgress: Record<string, boolean>;
}

export interface BusinessData {
  bestFlightAlerts: {
    emailsSent: number;
    subscribers: number;
    targetSubscribers: number;
    tasks: Task[];
  };
  webTailors: {
    clients: number;
    targetClients: number;
    revenue: number;
    websitesCreated: number;
    tasks: Task[];
  };
}

export interface DashboardData {
  currentMonth: string;
  dayCounter: number;
  personal: PersonalData;
  business: BusinessData;
} 