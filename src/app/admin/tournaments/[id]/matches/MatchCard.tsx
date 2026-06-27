'use client';

import { useState, useTransition } from 'react';
import { updateMatchDetails } from './actions';

export default function MatchCard({
  match,
  athletes,
}: {
  match: any;
  athletes: any[];
}) {
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);

  const [tableNumber, setTableNumber] = useState(
    match.tableNumber || ''
  );

  const [scheduledTime, setScheduledTime] = useState(
    match.scheduledTime
      ? new Date(match.scheduledTime)
          .toISOString()
          .slice(0, 16)
      : ''
  );

  const [status, setStatus] = useState(match.status);
  const [score, setScore] = useState(match.score || '');
  const [winnerId, setWinnerId] = useState(
    match.winnerId || ''
  );

  const c1 = athletes.find(
    (a) => a._id === match.competitor1Id
  );

  const c2 = athletes.find(
    (a) => a._id === match.competitor2Id
  );

  const nameOf = (a: any) =>
    a ? a.fullName || `${a.firstName ?? ''} ${a.lastName ?? ''}`.trim() || 'Unknown' : 'TBD';

  const handleSave = () => {
    startTransition(async () => {
      await updateMatchDetails(match._id, {
        tableNumber: tableNumber
          ? Number(tableNumber)
          : undefined,

        scheduledTime,

        status,

        score,

        winnerId: winnerId || undefined,
      });

      setIsEditing(false);
    });
  };

  const getStatusBadge = () => {
    switch (match.status) {
      case 'PENDING':
        return (
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 text-xs rounded-full font-medium">
            Upcoming
          </span>
        );

      case 'IN_PROGRESS':
        return (
          <span className="bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded-full font-medium">
            Live
          </span>
        );

      case 'COMPLETED':
        return (
          <span className="bg-green-100 text-green-800 px-2 py-1 text-xs rounded-full font-medium">
            Finished
          </span>
        );

      case 'BYE':
        return (
          <span className="bg-gray-100 text-gray-800 px-2 py-1 text-xs rounded-full font-medium">
            BYE
          </span>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Round {match.round}
          </span>

          <h4 className="font-bold text-gray-900 mt-1">
            {nameOf(c1)}

            <span className="text-gray-400 mx-2">
              vs
            </span>

            {nameOf(c2)}
          </h4>
        </div>

        <div>{getStatusBadge()}</div>
      </div>

      {!isEditing ? (
        <div className="text-sm text-gray-600 grid grid-cols-2 gap-2 mb-4">
          <p>
            <span className="font-medium">
              Table:
            </span>{' '}
            {match.tableNumber || 'Not assigned'}
          </p>

          <p>
            <span className="font-medium">
              Time:
            </span>{' '}
            {match.scheduledTime
              ? new Date(
                  match.scheduledTime
                ).toLocaleString()
              : 'TBD'}
          </p>

          <p>
            <span className="font-medium">
              Score:
            </span>{' '}
            {match.score || '-'}
          </p>

          <p>
            <span className="font-medium">
              Winner:
            </span>{' '}
            {match.winnerId
              ? nameOf(athletes.find((a) => a._id === match.winnerId))
              : '-'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Status
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="PENDING">
                Upcoming
              </option>

              <option value="IN_PROGRESS">
                Live
              </option>

              <option value="COMPLETED">
                Finished
              </option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Table
            </label>

            <input
              type="number"
              value={tableNumber}
              onChange={(e) =>
                setTableNumber(e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="e.g. 1"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Time
            </label>

            <input
              type="datetime-local"
              value={scheduledTime}
              onChange={(e) =>
                setScheduledTime(e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Score
            </label>

            <input
              type="text"
              value={score}
              onChange={(e) =>
                setScore(e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="e.g. 3-0"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-gray-700 font-medium mb-1">
              Winner
            </label>

            <select
              value={winnerId}
              onChange={(e) =>
                setWinnerId(e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">None</option>

              {c1 && (
                <option value={c1._id}>
                  {nameOf(c1)}
                </option>
              )}

              {c2 && (
                <option value={c2._id}>
                  {nameOf(c2)}
                </option>
              )}
            </select>
          </div>
        </div>
      )}

      <div className="border-t border-gray-100 pt-3 flex justify-end gap-2">
        {isEditing ? (
          <>
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={isPending}
              className="px-3 py-1 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded disabled:bg-indigo-300"
            >
              {isPending
                ? 'Saving...'
                : 'Save'}
            </button>
          </>
        ) : (
          <button
            onClick={() =>
              setIsEditing(true)
            }
            className="px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-50 font-medium rounded"
          >
            Manage Match
          </button>
        )}
      </div>
    </div>
  );
}