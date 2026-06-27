import connectToDatabase from '@/infrastructure/db/connect';
import { Match } from '@/infrastructure/db/models/Match';
import { Category } from '@/infrastructure/db/models/Category';
import { Registration } from '@/infrastructure/db/models/Registration';
import { Tournament } from '@/infrastructure/db/models/Tournament';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import RefereePanel from './RefereePanel';
import Link from 'next/link';
import { LogOut } from 'lucide-react';

export const dynamic = 'force-dynamic'; 

export default async function RefereeDashboard() {
  const session = await getServerSession(authOptions);

  if (
    !session ||
    (session.user.role !== 'Referee' && session.user.role !== 'Admin' && session.user.role !== 'Super Admin')
  ) {
    redirect('/login');
  }

  await connectToDatabase();

  // Pick the tournament that is being played: prefer ACTIVE, then closed-registration, then most recent.
  const tournament =
    (await Tournament.findOne({ status: 'ACTIVE' }).sort({ startDate: -1 })) ||
    (await Tournament.findOne({ status: 'REGISTRATION_CLOSED' }).sort({ startDate: -1 })) ||
    (await Tournament.findOne({}).sort({ startDate: -1 }));

  let categoriesData: any[] = [];
  let competitorMap: Record<string, any> = {};
  let matchesData: any[] = [];

  if (tournament) {
    const categories = await Category.find({ tournamentId: tournament._id })
      .populate({ path: 'participants', match: { status: 'APPROVED' }, select: '_id' })
      .sort({ minWeightKg: 1, arm: 1 })
      .lean();

    // Only show categories that have at least one approved participant.
    const usable = categories.filter((c) => (c.participants?.length || 0) > 0);

    const categoryIds = usable.map((c) => c._id);
    const matches = await Match.find({ categoryId: { $in: categoryIds } }).sort({ round: 1, matchNumber: 1 }).lean();

    // Build a competitor lookup (id -> name/photo/weight) from all participants + match competitors.
    const ids = new Set<string>();
    usable.forEach((c) => (c.participants as any[]).forEach((p: any) => ids.add(p._id.toString())));
    matches.forEach((m) => {
      if (m.competitor1Id) ids.add(m.competitor1Id.toString());
      if (m.competitor2Id) ids.add(m.competitor2Id.toString());
    });
    const competitors = await Registration.find({ _id: { $in: Array.from(ids) } })
      .select('fullName profilePictureUrl weight city')
      .lean();
    competitors.forEach((r: any) => {
      competitorMap[r._id.toString()] = {
        _id: r._id.toString(),
        fullName: r.fullName,
        profilePictureUrl: r.profilePictureUrl,
        weight: r.weight,
        city: r.city,
      };
    });

    categoriesData = usable.map((c: any) => ({
      _id: c._id.toString(),
      name: c.name,
      arm: c.arm,
      minWeightKg: c.minWeightKg,
      maxWeightKg: c.maxWeightKg,
      participantIds: (c.participants as any[]).map((p: any) => p._id.toString()),
    }));

    matchesData = JSON.parse(JSON.stringify(matches));
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-indigo-900 text-white shadow-md py-3 px-4 sm:px-6 flex justify-between items-center gap-3">
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-bold leading-tight">Referee Dashboard</h1>
          {tournament && <p className="text-indigo-200 text-xs sm:text-sm truncate">{tournament.title}</p>}
        </div>
        <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
          <Link href="/live" target="_blank" className="flex items-center gap-1.5 text-red-300 hover:text-red-200 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <span className="text-sm font-medium">Watch Live</span>
          </Link>
          <Link href="/api/auth/signout" className="flex items-center gap-1.5 hover:text-indigo-200 whitespace-nowrap">
            <LogOut size={20} />
            <span className="text-sm sm:text-base">Logout</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-6">
        {!tournament ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">
            No tournament found. An admin must create a tournament first.
          </div>
        ) : categoriesData.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">
            No categories with approved athletes yet. Ask an admin to approve registrations and run
            <span className="font-medium"> Auto-Assign Athletes</span> on the tournament categories page.
          </div>
        ) : (
          <RefereePanel categories={categoriesData} competitors={competitorMap} matches={matchesData} />
        )}
      </main>
    </div>
  );
}
