import { useState } from 'react';

interface DayCounterProps {
  currentDay: number;
  onIncrement: () => void;
}

export function DayCounter({ currentDay, onIncrement }: DayCounterProps) {
  const [animate, setAnimate] = useState(false);

  const handleClick = () => {
    setAnimate(true);
    onIncrement();
    setTimeout(() => setAnimate(false), 500);
  };

  return (
    <div className="day-counter-box w-full max-w-sm mx-auto mb-8 cursor-pointer" onClick={handleClick}>
      <h3 className="text-lg text-white/70 mb-2">Track Your Progress</h3>
      <div className={`text-5xl font-bold mb-2 ${animate ? 'scale-110 transition-transform' : ''}`}>
        Day {currentDay}
      </div>
      <div className="text-sm text-white/50">Click to mark today complete</div>
    </div>
  );
} 