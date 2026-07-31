import { useState, useEffect } from 'react';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 2000;
    const steps = 100;
    const stepTime = duration / steps;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const step = Math.min(Math.floor(elapsed / stepTime), steps);
      setCount(step);

      if (step >= steps) {
        clearInterval(interval);
        setTimeout(() => setExiting(true), 200);
        setTimeout(() => onComplete(), 900);
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-white flex items-end justify-start transition-opacity duration-700 ${
        exiting ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <span className="text-7xl md:text-9xl font-bold tabular-nums p-6 md:p-10 leading-none text-black">
        {count}
      </span>
    </div>
  );
}
