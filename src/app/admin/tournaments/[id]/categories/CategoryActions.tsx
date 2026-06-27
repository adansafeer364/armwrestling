'use client';

import { useState, useTransition } from 'react';
import { createCategory, autoAssignAthletes, generateDefaultCategories } from './actions';
import { Plus, X } from 'lucide-react';

const EMPTY = { name: '', minWeightKg: '', maxWeightKg: '', arm: 'RIGHT', maxParticipants: '' };

export function CategoryActions({ tournamentId }: { tournamentId: string }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ ...EMPTY });

  const flash = (m: string) => { setMessage(m); setTimeout(() => setMessage(''), 3500); };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    startTransition(async () => {
      try {
        await createCategory(tournamentId, {
          name: form.name,
          minWeightKg: Number(form.minWeightKg),
          maxWeightKg: Number(form.maxWeightKg),
          arm: form.arm as 'LEFT' | 'RIGHT' | 'BOTH',
          maxParticipants: form.maxParticipants ? Number(form.maxParticipants) : undefined,
        });
        flash(`Category "${form.name}" (${form.arm}) added.`);
        // Keep the modal open and reset so multiple can be added quickly.
        setForm((f) => ({ ...EMPTY, arm: f.arm }));
      } catch (err: any) {
        setError(err.message || 'Could not add category.');
      }
    });
  };

  const handleAssign = () => {
    setError('');
    startTransition(async () => {
      try {
        const count = await autoAssignAthletes(tournamentId);
        flash(`Assigned ${count} approved athlete slot(s) to matching categories.`);
      } catch (err: any) {
        setError(err.message || 'Assign failed.');
      }
    });
  };

  const handleQuickFill = () => {
    setError('');
    startTransition(async () => {
      try {
        await generateDefaultCategories(tournamentId);
        flash('Standard 5 kg categories created.');
      } catch (err: any) {
        setError(err.message || 'Failed.');
      }
    });
  };

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="flex flex-col gap-2 items-end">
      <div className="flex flex-wrap gap-3 justify-end">
        <button
          onClick={() => { setOpen(true); setError(''); }}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700"
        >
          <Plus size={18} /> Add Category
        </button>
        <button
          onClick={handleQuickFill}
          disabled={isPending}
          className="bg-gray-700 text-white px-4 py-2 rounded shadow hover:bg-gray-800 disabled:bg-gray-400 text-sm"
          title="Optional: auto-create the standard −55…−100 + 100kg+ classes for Left & Right"
        >
          Quick-fill Standard
        </button>
        <button
          onClick={handleAssign}
          disabled={isPending}
          className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 disabled:bg-green-400"
        >
          Auto-Assign Approved Athletes
        </button>
      </div>

      {message && <p className="text-sm text-green-700 font-medium">{message}</p>}
      {error && !open && <p className="text-sm text-red-600 font-medium">{error}</p>}

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleAdd}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 text-left"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Add Category</h3>
              <button type="button" onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            {error && <div className="mb-3 bg-red-50 text-red-700 p-2.5 rounded text-sm">{error}</div>}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Category Name</label>
                <input
                  required value={form.name} onChange={(e) => set('name', e.target.value)}
                  placeholder="e.g. −75kg"
                  className="mt-1 w-full p-2 border border-gray-300 rounded focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Min weight (kg)</label>
                  <input required type="number" step="0.1" value={form.minWeightKg} onChange={(e) => set('minWeightKg', e.target.value)}
                    placeholder="70" className="mt-1 w-full p-2 border border-gray-300 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Max weight (kg)</label>
                  <input required type="number" step="0.1" value={form.maxWeightKg} onChange={(e) => set('maxWeightKg', e.target.value)}
                    placeholder="75" className="mt-1 w-full p-2 border border-gray-300 rounded" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Arm</label>
                  <select value={form.arm} onChange={(e) => set('arm', e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded bg-white">
                    <option value="RIGHT">Right</option>
                    <option value="LEFT">Left</option>
                    <option value="BOTH">Both</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Max athletes (optional)</label>
                  <input type="number" value={form.maxParticipants} onChange={(e) => set('maxParticipants', e.target.value)}
                    placeholder="e.g. 16" className="mt-1 w-full p-2 border border-gray-300 rounded" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
                Done
              </button>
              <button type="submit" disabled={isPending} className="bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700 disabled:bg-indigo-300">
                {isPending ? 'Adding…' : 'Add & keep open'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
