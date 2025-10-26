import { useState, useEffect } from "react";

export default function useSession(key = "taxvault_user", initialValue = null) {
  const [session, setSession] = useState(() => {
    try {
      const saved = sessionStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Keep in sync with sessionStorage
  useEffect(() => {
    if (session) {
      sessionStorage.setItem(key, JSON.stringify(session));
    } else {
      sessionStorage.removeItem(key);
    }
  }, [session, key]);

  // Sync across tabs
  useEffect(() => {
    const sync = (e) => {
      if (e.key === key) {
        setSession(e.newValue ? JSON.parse(e.newValue) : initialValue);
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [key, initialValue]);

  return [session, setSession];
}
