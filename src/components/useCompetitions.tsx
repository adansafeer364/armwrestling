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
    setIsLoading(true);
    fetch('/api/competitions')
      .then((res) => res.json())
      .then((data) => {
        setCompetitions(data.competitions || []);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setCompetitions([]);
        setIsLoading(false);
      });
  }, []);

  return { competitions, isLoading, error };
}