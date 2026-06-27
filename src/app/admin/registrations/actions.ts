'use server';

import connectToDatabase from '@/infrastructure/db/connect';
import { Registration } from '@/infrastructure/db/models/Registration';
import { Tournament } from '@/infrastructure/db/models/Tournament';
import { sendApprovalEmail, sendRejectionEmail } from '@/infrastructure/email/mailer';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

async function assertAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== 'Admin' && session.user.role !== 'Super Admin')) {
    throw new Error('Unauthorized');
  }
}

export async function approveRegistration(registrationId: string) {
  await assertAdmin();
  await connectToDatabase();

  const reg = await Registration.findById(registrationId);
  if (!reg) throw new Error('Registration not found');

  reg.status = 'APPROVED';
  reg.approvedAt = new Date();
  await reg.save();

  let tournamentTitle: string | undefined;
  if (reg.tournamentId) {
    const t = await Tournament.findById(reg.tournamentId);
    tournamentTitle = t?.title;
  }

  // Notify the athlete on the email taken from their registration form.
  const emailed = await sendApprovalEmail({
    to: reg.email,
    fullName: reg.fullName,
    registrationId: reg.registrationId,
    tournamentTitle,
  });

  revalidatePath('/admin/registrations');
  revalidatePath('/admin');
  return { emailed };
}

export async function rejectRegistration(registrationId: string, reason?: string) {
  await assertAdmin();
  await connectToDatabase();

  const reg = await Registration.findById(registrationId);
  if (!reg) throw new Error('Registration not found');

  reg.status = 'REJECTED';
  await reg.save();

  const emailed = await sendRejectionEmail({
    to: reg.email,
    fullName: reg.fullName,
    registrationId: reg.registrationId,
    reason,
  });

  revalidatePath('/admin/registrations');
  revalidatePath('/admin');
  return { emailed };
}
