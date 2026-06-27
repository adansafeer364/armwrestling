import connectToDatabase from '@/infrastructure/db/connect';
import { Match } from '@/infrastructure/db/models/Match';
import { Tournament } from '@/infrastructure/db/models/Tournament';
import { Registration } from '@/infrastructure/db/models/Registration';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import MatchCard from './MatchCard';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export default async function MatchesManagementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectToDatabase();

  const tournament = await Tournament.findById(id);
  if (!tournament) {
    notFound();
  }

  // Fetch all matches for this tournament
  const tId = new mongoose.Types.ObjectId(id);
  const matches = await Match.find({ tournamentId: tId }).sort({ scheduledTime: 1, round: 1, matchNumber: 1 }).lean();

  // Collect competitor ids (now Registration references)
  const competitorIds = new Set<string>();
  matches.forEach((m) => {
    if (m.competitor1Id) competitorIds.add(m.competitor1Id.toString());
    if (m.competitor2Id) competitorIds.add(m.competitor2Id.toString());
    if (m.winnerId) competitorIds.add(m.winnerId.toString());
  });

  const competitors = await Registration.find({ _id: { $in: Array.from(competitorIds) } })
    .select('fullName profilePictureUrl weight')
    .lean();

  // Serialize for client components
  const matchesObj = JSON.parse(JSON.stringify(matches));
  const competitorsObj = JSON.parse(JSON.stringify(competitors));

  const upcoming = matchesObj.filter((m: any) => m.status === 'PENDING' || m.status === 'READY');
  const live = matchesObj.filter((m: any) => m.status === 'IN_PROGRESS');
  const finished = matchesObj.filter((m: any) => m.status === 'COMPLETED' || m.status === 'BYE');

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/admin/tournaments" className="text-indigo-600 text-sm hover:underline mb-2 inline-block">&larr; Back to Tournaments</Link>
          <h2 className="text-2xl font-bold text-gray-800">Match Management</h2>
          <p className="text-gray-500 text-sm mt-1">{tournament.title}</p>
        </div>
        <div className="text-sm text-gray-500">
          Matches are generated and refereed live from the{' '}
          <Link href="/referee" className="text-indigo-600 font-medium hover:underline">Referee Panel</Link>.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Live Matches */}
        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
          <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse mr-2"></span>
            Live Now ({live.length})
          </h3>
          <div className="space-y-4">
            {live.length > 0 ? live.map((m: any) => (
              <MatchCard key={m._id} match={m} athletes={competitorsObj} />
            )) : (
              <p className="text-sm text-gray-500 italic">No live matches.</p>
            )}
          </div>
        </div>

        {/* Upcoming Matches */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Upcoming ({upcoming.length})
          </h3>
          <div className="space-y-4">
            {upcoming.length > 0 ? upcoming.map((m: any) => (
              <MatchCard key={m._id} match={m} athletes={competitorsObj} />
            )) : (
              <p className="text-sm text-gray-500 italic">No upcoming matches.</p>
            )}
          </div>
        </div>

        {/* Finished / History */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Match History ({finished.length})
          </h3>
          <div className="space-y-4">
            {finished.length > 0 ? finished.map((m: any) => (
              <MatchCard key={m._id} match={m} athletes={competitorsObj} />
            )) : (
              <p className="text-sm text-gray-500 italic">No finished matches yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
