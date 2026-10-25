import { useState, useEffect } from "react";

// Custom hook: works like useState, but the value is loaded from and
// saved to localStorage under `key`, so it survives page refreshes.
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage full or blocked: the app still works for this session
    }
  }, [key, value]);

  return [value, setValue];
}
