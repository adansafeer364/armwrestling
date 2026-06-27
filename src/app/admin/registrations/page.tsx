import connectToDatabase from '@/infrastructure/db/connect';
import { Registration } from '@/infrastructure/db/models/Registration';
import RegistrationCard from './RegistrationCard';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function RegistrationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await connectToDatabase();
  const { status } = await searchParams;
  const filter = (status && ['PENDING', 'APPROVED', 'REJECTED'].includes(status)
    ? status
    : 'PENDING') as 'PENDING' | 'APPROVED' | 'REJECTED';

  const registrations = await Registration.find({ status: filter }).sort({ createdAt: -1 }).lean();
  const data = JSON.parse(JSON.stringify(registrations));

  const tabs = [
    { key: 'PENDING', label: 'Pending' },
    { key: 'APPROVED', label: 'Approved' },
    { key: 'REJECTED', label: 'Rejected' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Registrations & Payment Verification</h2>
      <p className="text-gray-500 text-sm mb-6">
        Review payment receipts and approve applications. Approving notifies the athlete by email.
      </p>

      <div className="flex gap-2 mb-6">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={`/admin/registrations?status=${t.key}`}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === t.key ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {data.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center text-gray-500">
          No {filter.toLowerCase()} registrations.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.map((reg: any) => (
            <RegistrationCard key={reg._id} reg={reg} />
          ))}
        </div>
      )}
    </div>
  );
}
