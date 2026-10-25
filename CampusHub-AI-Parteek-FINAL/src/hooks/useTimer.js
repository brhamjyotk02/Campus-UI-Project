import { useCallback, useEffect, useRef, useState } from "react";

export default function useTimer(initialSeconds = 25 * 60, onComplete) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const reset = useCallback(() => {
    setIsRunning(false);
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setSeconds((current) => {
        if (current <= 1) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          if (onComplete) onComplete();
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isRunning, onComplete]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);

  return { seconds, isRunning, start, pause, reset };
}