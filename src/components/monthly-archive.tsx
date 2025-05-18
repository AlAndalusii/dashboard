import { useState } from 'react';
import { MonthlyData } from '@/lib/types';

interface MonthlyArchiveProps {
  monthlyArchive: Record<string, MonthlyData>;
  onExportCSV: (monthKey: string) => void;
  onClose: () => void;
}

export function MonthlyArchive({ monthlyArchive, onExportCSV, onClose }: MonthlyArchiveProps) {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  
  const monthKeys = Object.keys(monthlyArchive);
  
  // Sort months in descending order (newest first)
  monthKeys.sort((a, b) => {
    const dateA = new Date(a.replace('-', ' '));
    const dateB = new Date(b.replace('-', ' '));
    return dateB.getTime() - dateA.getTime();
  });
  
  if (monthKeys.length === 0) {
    return (
      <div className="bg-slate-800 rounded-xl shadow-lg p-6 text-center">
        <h2 className="text-2xl font-bold mb-4 text-white">Monthly Archive</h2>
        <p className="text-slate-400 mb-6">No archived months found.</p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-medium text-white"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }
  
  return (
    <div className="bg-slate-800 rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Monthly Archive</h2>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-medium text-white"
        >
          Return to Dashboard
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {monthKeys.map(monthKey => {
          const month = monthlyArchive[monthKey];
          const isSelected = selectedMonth === monthKey;
          
          // Count tasks
          const personalTaskCount = month.personal.tasks.length;
          const businessTaskCount = 
            month.business.bestFlightAlerts.tasks.length + 
            month.business.webTailors.tasks.length;
          
          // Count completed tasks
          const personalCompletedCount = month.personal.tasks.filter(t => t.completed).length;
          const businessCompletedCount = 
            month.business.bestFlightAlerts.tasks.filter(t => t.completed).length + 
            month.business.webTailors.tasks.filter(t => t.completed).length;
          
          return (
            <div 
              key={monthKey}
              className={`bg-slate-700 rounded-lg p-4 cursor-pointer transition-colors hover:bg-slate-600 ${
                isSelected ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedMonth(isSelected ? null : monthKey)}
            >
              <h3 className="text-lg font-medium text-white mb-2">{month.month}</h3>
              <div className="grid grid-cols-2 gap-2 text-sm text-slate-300">
                <div>
                  <p>Personal Tasks:</p>
                  <p className="font-medium">{personalCompletedCount} / {personalTaskCount}</p>
                </div>
                <div>
                  <p>Business Tasks:</p>
                  <p className="font-medium">{businessCompletedCount} / {businessTaskCount}</p>
                </div>
              </div>
              
              {isSelected && (
                <div className="mt-4 pt-3 border-t border-slate-600">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onExportCSV(monthKey);
                    }}
                    className="w-full px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-500 transition-colors"
                  >
                    Export as CSV
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {selectedMonth && (
        <div className="bg-slate-700 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-white">{monthlyArchive[selectedMonth].month} Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-medium mb-3 text-white">Personal Tasks</h4>
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                {monthlyArchive[selectedMonth].personal.tasks.map(task => (
                  <div 
                    key={task.id} 
                    className="bg-slate-800 p-3 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${task.completed ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-white">{task.name}</span>
                    </div>
                    {task.notes && task.notes.length > 0 && (
                      <div className="mt-2 pl-5 text-sm text-slate-400">
                        <p className="font-medium mb-1">Notes:</p>
                        {task.notes.map(note => (
                          <p key={note.id} className="mb-1">{note.content}</p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-3 text-white">Business Tasks</h4>
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                <h5 className="text-md font-medium text-slate-300">BestFlightAlerts</h5>
                {monthlyArchive[selectedMonth].business.bestFlightAlerts.tasks.map(task => (
                  <div 
                    key={task.id} 
                    className="bg-slate-800 p-3 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${task.completed ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-white">{task.name}</span>
                    </div>
                    {task.notes && task.notes.length > 0 && (
                      <div className="mt-2 pl-5 text-sm text-slate-400">
                        <p className="font-medium mb-1">Notes:</p>
                        {task.notes.map(note => (
                          <p key={note.id} className="mb-1">{note.content}</p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                <h5 className="text-md font-medium text-slate-300 mt-4">WebTailors</h5>
                {monthlyArchive[selectedMonth].business.webTailors.tasks.map(task => (
                  <div 
                    key={task.id} 
                    className="bg-slate-800 p-3 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${task.completed ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-white">{task.name}</span>
                    </div>
                    {task.notes && task.notes.length > 0 && (
                      <div className="mt-2 pl-5 text-sm text-slate-400">
                        <p className="font-medium mb-1">Notes:</p>
                        {task.notes.map(note => (
                          <p key={note.id} className="mb-1">{note.content}</p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 