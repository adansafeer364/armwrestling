import { useState, useEffect } from 'react';

export interface Competition {
  _id: string;
  title: string;
  startDate: string;
  location: string;
  mapAddress: string;
}

export function useCompetitions() {
  const [isLoading, setIsLoading] = useState(true);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch('/api/competitions')
      .then(async (res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch competitions');
        }
        return res.json();
      })
      .then((data) => {
        setCompetitions(data.competitions || []);
      })
      .catch((err: Error) => {
        setError(err);
        setCompetitions([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return { competitions, isLoading, error };
}