import connectToDatabase from '@/infrastructure/db/connect';
import { Registration } from '@/infrastructure/db/models/Registration';
import { Tournament } from '@/infrastructure/db/models/Tournament';
import { Match } from '@/infrastructure/db/models/Match';
import { User } from '@/infrastructure/db/models/User';
import Link from 'next/link';
import { Users, CreditCard, Trophy, Gavel, Swords } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  await connectToDatabase();

  const [
    totalRegistrations,
    pendingRegistrations,
    approvedRegistrations,
    tournaments,
    referees,
    liveMatches,
  ] = await Promise.all([
    Registration.countDocuments({}),
    Registration.countDocuments({ status: 'PENDING' }),
    Registration.countDocuments({ status: 'APPROVED' }),
    Tournament.countDocuments({}),
    User.countDocuments({ role: 'Referee' }),
    Match.countDocuments({ status: { $in: ['READY', 'IN_PROGRESS'] } }),
  ]);

  const stats = [
    { label: 'Total Registrations', value: totalRegistrations, icon: Users, color: 'bg-indigo-600' },
    { label: 'Pending Approval', value: pendingRegistrations, icon: CreditCard, color: 'bg-amber-500', href: '/admin/registrations' },
    { label: 'Approved Athletes', value: approvedRegistrations, icon: Users, color: 'bg-green-600' },
    { label: 'Tournaments', value: tournaments, icon: Trophy, color: 'bg-purple-600', href: '/admin/tournaments' },
    { label: 'Referees', value: referees, icon: Gavel, color: 'bg-blue-600', href: '/admin/referees' },
    { label: 'Live / Ready Matches', value: liveMatches, icon: Swords, color: 'bg-red-600' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Dashboard</h2>
      <p className="text-gray-500 text-sm mb-6">Real-time overview of the platform.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((s) => {
          const Icon = s.icon;
          const card = (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center gap-4 hover:shadow-md transition-shadow h-full">
              <div className={`w-12 h-12 rounded-lg ${s.color} flex items-center justify-center text-white flex-shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-3xl font-black text-gray-900">{s.value}</div>
                <div className="text-sm text-gray-500">{s.label}</div>
              </div>
            </div>
          );
          return s.href ? (
            <Link key={s.label} href={s.href}>{card}</Link>
          ) : (
            <div key={s.label}>{card}</div>
          );
        })}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/registrations" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-medium">
            Review Registrations
          </Link>
          <Link href="/admin/tournaments" className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 font-medium">
            Manage Tournaments
          </Link>
          <Link href="/referee" className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 font-medium">
            Open Referee Panel
          </Link>
        </div>
      </div>
    </div>
  );
}
