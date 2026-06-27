'use client';

import { useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteCategory } from './actions';

export default function DeleteCategoryButton({ tournamentId, categoryId }: { tournamentId: string; categoryId: string }) {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      onClick={() => {
        if (!confirm('Delete this category?')) return;
        startTransition(() => deleteCategory(tournamentId, categoryId));
      }}
      disabled={isPending}
      className="text-gray-400 hover:text-red-600 disabled:opacity-50"
      title="Delete category"
    >
      <Trash2 size={16} />
    </button>
  );
}
