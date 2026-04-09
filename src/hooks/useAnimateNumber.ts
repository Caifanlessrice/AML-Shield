import { useEffect, useState } from 'react';

export function useAnimateNumber(target: number, duration = 1500): number {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const from = 0;

    function update(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCurrent(Math.round(from + (target - from) * eased));

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }, [target, duration]);

  return current;
}
