'use client';

import { useState, useTransition } from 'react';
// import { generateMatches } from './actions'; // Uncomment and adjust this once your server action is ready

export default function GenerateMatchesButton({
  tournamentId,
}: {
  tournamentId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState('');

  const handleGenerate = () => {
    startTransition(async () => {
      try {
        // await generateMatches(tournamentId); // Call your server action here
        setMessage('Matches generated successfully.');
        
        setTimeout(() => {
          setMessage('');
        }, 3000);
      } catch (error: any) {
        setMessage(error.message || 'An error occurred while generating matches.');
      }
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleGenerate}
        disabled={isPending}
        className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 disabled:bg-indigo-400 w-fit"
      >
        {isPending ? 'Generating Matches...' : 'Generate Matches'}
      </button>

      {message && (
        <p className="text-sm text-gray-700 mt-2 font-medium">{message}</p>
      )}
    </div>
  );
}