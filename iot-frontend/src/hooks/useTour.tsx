import { useState, useEffect } from 'react';

export function useTour(pageType: String) {
  const [run, setRun] = useState(false);

  useEffect(() => {
    const storageKey = `tour_${pageType}_seen`;
    const hasTourBeenSeen = localStorage.getItem(storageKey);

    if (!hasTourBeenSeen || hasTourBeenSeen === 'false') {
      setRun(true);
      localStorage.setItem(storageKey, 'true');
    }
  }, [pageType]);

  return { run, setRun };
}
