'use client';

import { deleteTournament } from '../actions';
import { useTransition } from 'react';

export default function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button 
      onClick={() => {
        if(confirm('Are you sure you want to delete this tournament? This action cannot be undone.')) {
          startTransition(() => deleteTournament(id));
        }
      }}
      disabled={isPending}
      className="text-sm text-red-600 hover:text-red-900 font-medium ml-4 disabled:text-red-300 transition-colors"
    >
      {isPending ? 'Deleting...' : 'Delete'}
    </button>
  );
}
