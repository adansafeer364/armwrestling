import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function RefereeDashboard() {
  const session = await getServerSession(authOptions);

  if (
    !session ||
    (session.user.role !== 'Referee' && session.user.role !== 'Admin' && session.user.role !== 'Super Admin')
  ) {
    redirect('/login');
  }

  redirect('/admin/tournaments');
}
