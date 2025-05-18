import { useState } from 'react';

interface DayCounterProps {
  currentDay: number;
  onIncrement: () => void;
}

export function DayCounter({ currentDay, onIncrement }: DayCounterProps) {
  const today = new Date().getDate();
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() || 30;
  const progress = (currentDay / daysInMonth) * 100;
  
  return (
    <div>
      <div className="flex justify-between items-end mb-2">
        <div>
          <h3 className="text-sm font-medium text-slate-400">Day Counter</h3>
          <div className="text-3xl font-bold text-white">Day {currentDay} <span className="text-sm text-slate-400">of {daysInMonth}</span></div>
        </div>
        
        <button
          onClick={onIncrement}
          className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 transition-colors rounded-lg text-white text-sm font-medium shadow-sm"
        >
          Increment Day
        </button>
      </div>
      
      <div className="mt-4">
        <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="mt-2 text-sm text-slate-400 flex justify-between">
          <span>Current day: {today}</span>
          <span>Monthly progress: {Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
} 