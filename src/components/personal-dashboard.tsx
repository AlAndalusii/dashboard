import { EditableField } from './ui/editable-field';
import { PersonalData } from '@/lib/types';

interface PersonalDashboardProps {
  data: PersonalData;
  onUpdate: (data: PersonalData) => void;
}

export function PersonalDashboard({ data, onUpdate }: PersonalDashboardProps) {
  const handleFieldUpdate = (field: keyof Omit<PersonalData, 'tasks' | 'dailyProgress'>, value: string) => {
    onUpdate({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="container-inner">
        <h3 className="text-xl font-bold mb-4">Self-Growth Tracker</h3>
        
        <div className="space-y-4">
          <div className="task-item">
            <span className="font-medium w-24">Quran:</span>
            <EditableField 
              value={data.quran} 
              onChange={(value) => handleFieldUpdate('quran', value)}
              placeholder="Enter Juzz & Surahs..."
              className="flex-1"
            />
          </div>
          
          <div className="task-item">
            <span className="font-medium w-24">Tafsir:</span>
            <EditableField 
              value={data.tafsir} 
              onChange={(value) => handleFieldUpdate('tafsir', value)}
              placeholder="Enter progress..."
              className="flex-1"
            />
          </div>
          
          <div className="task-item">
            <span className="font-medium w-24">Arabic:</span>
            <EditableField 
              value={data.arabic} 
              onChange={(value) => handleFieldUpdate('arabic', value)}
              placeholder="Enter progress..."
              className="flex-1"
            />
          </div>
          
          <div className="task-item">
            <span className="font-medium w-24">Spanish:</span>
            <EditableField 
              value={data.spanish} 
              onChange={(value) => handleFieldUpdate('spanish', value)}
              placeholder="Enter progress..."
              className="flex-1"
            />
          </div>
          
          <div className="task-item">
            <span className="font-medium w-24">Matters of Heart:</span>
            <EditableField 
              value={data.mattersOfHeart} 
              onChange={(value) => handleFieldUpdate('mattersOfHeart', value)}
              placeholder="Enter progress..."
              className="flex-1"
            />
          </div>
        </div>
      </div>
      
      <div className="container-inner">
        <h3 className="text-xl font-bold mb-4">Daily Progress</h3>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
            const isCompleted = data.dailyProgress[day.toString()] || false;
            
            return (
              <div 
                key={day}
                className={`h-10 w-10 rounded-md flex items-center justify-center cursor-pointer transition-colors ${
                  isCompleted 
                    ? 'bg-white/20 text-white border border-white/30' 
                    : 'bg-black/40 text-white/50 border border-white/10 hover:bg-white/10'
                }`}
                onClick={() => {
                  onUpdate({
                    ...data,
                    dailyProgress: {
                      ...data.dailyProgress,
                      [day.toString()]: !isCompleted,
                    },
                  });
                }}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 