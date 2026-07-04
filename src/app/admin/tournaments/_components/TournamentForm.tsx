'use client';

import { useState } from 'react';
import { saveTournament } from '../actions';

export default function TournamentForm({ tournament }: { tournament?: any }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData(e.currentTarget);
      if (tournament?._id) {
        formData.append('id', tournament._id.toString());
        if (tournament.bannerImage) {
            formData.append('existingBanner', tournament.bannerImage);
        }
      }
      await saveTournament(formData);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().slice(0, 16);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-light-card dark:bg-dark-card p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-light-text-main dark:text-dark-text-main">
      {error && <div className="text-red-500 bg-red-50 p-3 rounded text-sm">{error}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name (Title)</label>
          <input required type="text" name="title" defaultValue={tournament?.title} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border text-light-text-main dark:text-dark-text-main" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Location (short label)</label>
          <input required type="text" name="location" defaultValue={tournament?.location} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border text-light-text-main dark:text-dark-text-main" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Map Coordinates — Latitude, Longitude</label>
          <input type="text" name="mapAddress" defaultValue={tournament?.mapAddress} placeholder="e.g. 34.3360, 73.1968" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border text-light-text-main dark:text-dark-text-main" />
          <p className="text-xs text-gray-500 mt-1">
            Paste the exact <span className="font-semibold">latitude, longitude</span> of the venue (right-click the spot in Google Maps → copy the numbers).
            The homepage map will drop a pin there and the “Get Directions” button routes to it. Leave empty to hide the map.
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input required type="datetime-local" name="startDate" defaultValue={formatDate(tournament?.startDate)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border text-light-text-main dark:text-dark-text-main" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input required type="datetime-local" name="endDate" defaultValue={formatDate(tournament?.endDate)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border text-light-text-main dark:text-dark-text-main" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Registration Deadline</label>
          <input required type="datetime-local" name="registrationDeadline" defaultValue={formatDate(tournament?.registrationDeadline)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border text-light-text-main dark:text-dark-text-main" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Prize Pool (Rs)</label>
          <input required type="number" name="prizePool" defaultValue={tournament?.prizePool || 0} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border text-light-text-main dark:text-dark-text-main" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select name="status" defaultValue={tournament?.status || 'DRAFT'} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border bg-white text-light-text-main dark:text-dark-text-main">
            <option value="DRAFT">Draft</option>
            <option value="REGISTRATION_OPEN">Registration Open</option>
            <option value="REGISTRATION_CLOSED">Registration Closed</option>
            <option value="ACTIVE">Live</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Banner Image</label>
          <input type="file" name="banner" accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
          {tournament?.bannerImage && <p className="text-xs text-gray-500 mt-1">Leave empty to keep current banner.</p>}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" defaultValue={tournament?.description} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border text-light-text-main dark:text-dark-text-main"></textarea>
        </div>
      </div>
      <div className="flex justify-end">
        <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 font-medium transition-colors">
          {loading ? 'Saving...' : 'Save Tournament'}
        </button>
      </div>
    </form>
  );
}
