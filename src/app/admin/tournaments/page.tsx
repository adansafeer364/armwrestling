import connectToDatabase from '@/infrastructure/db/connect';
import { Tournament } from '@/infrastructure/db/models/Tournament';
import Link from 'next/link';
import DeleteButton from './_components/DeleteButton';
import { optimizeImage } from '@/lib/img';
import { formatPKR } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function TournamentManagement() {
  await connectToDatabase();
  const tournaments = await Tournament.find().sort({ startDate: -1 }).lean();

  const badgeClassFor = (s: string) => {
    switch (s) {
      case 'REGISTRATION_OPEN':
        return 'bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-200';
      case 'ACTIVE':
        return 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-200';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      case 'CANCELLED':
        return 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-200';
      default:
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-200';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-light-text-main dark:text-dark-text-main">Tournament Management</h2>
        <Link href="/admin/tournaments/create" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-medium transition-colors">
          Create Tournament
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.length > 0 ? tournaments.map(t => (
          <div key={t._id.toString()} className="bg-light-card dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col hover:shadow-md transition-shadow text-light-text-main dark:text-dark-text-main">
             {t.bannerImage ? (
               <img src={optimizeImage(t.bannerImage, 600)} alt={t.title} loading="lazy" decoding="async" className="w-full h-40 object-cover" />
             ) : (
               <div className="w-full h-40 bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500">
                 No Banner Uploaded
               </div>
             )}
             <div className="p-6 flex-1 flex flex-col">
               <div className="flex justify-between items-start mb-4">
                 <h3 className="text-lg font-bold text-light-text-main dark:text-dark-text-main line-clamp-1" title={t.title}>{t.title}</h3>
                 <span className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ml-2 ${badgeClassFor(t.status)}`}>
                   {t.status.replace('_', ' ')}
                 </span>
               </div>
               <p className="text-sm text-light-text-muted dark:text-dark-text-muted mb-2">Location: <span className="text-light-text-main dark:text-dark-text-main font-medium">{t.location}</span></p>
               <p className="text-sm text-light-text-muted dark:text-dark-text-muted mb-2">Date: <span className="text-light-text-main dark:text-dark-text-main font-medium">{new Date(t.startDate).toLocaleDateString()}</span></p>
               <p className="text-sm text-light-text-muted dark:text-dark-text-muted mb-4 flex-1">Prize Pool: <span className="text-green-600 font-bold">{formatPKR(t.prizePool)}</span></p>
               
               <div className="flex justify-end items-center border-t border-gray-100 dark:border-gray-800 pt-4 mt-auto">
                 <Link href={`/admin/tournaments/${t._id}/matches`} className="text-sm text-indigo-600 hover:text-indigo-900 dark:text-indigo-300 dark:hover:text-indigo-100 font-medium px-2 py-1 rounded hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors mr-2">
                   Matches
                 </Link>
                 <Link href={`/admin/tournaments/${t._id}/categories`} className="text-sm text-indigo-600 hover:text-indigo-900 dark:text-indigo-300 dark:hover:text-indigo-100 font-medium px-2 py-1 rounded hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors mr-auto">
                   Categories
                 </Link>
                 <Link href={`/admin/tournaments/${t._id}/edit`} className="text-sm text-indigo-600 hover:text-indigo-900 dark:text-indigo-300 dark:hover:text-indigo-100 font-medium px-2 py-1 rounded hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors">
                   Edit
                 </Link>
                 <DeleteButton id={t._id.toString()} />
               </div>
             </div>
          </div>
        )) : (
          <div className="col-span-full text-center py-16 bg-light-card dark:bg-dark-card rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
            <h3 className="text-lg font-medium text-light-text-main dark:text-dark-text-main mb-2">No Tournaments Found</h3>
            <p className="text-light-text-muted dark:text-dark-text-muted mb-6">Get started by creating your first arm wrestling tournament.</p>
            <Link href="/admin/tournaments/create" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-medium transition-colors">
              Create Tournament
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
