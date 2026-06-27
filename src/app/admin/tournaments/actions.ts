'use server';

import connectToDatabase from '@/infrastructure/db/connect';
import { Tournament } from '@/infrastructure/db/models/Tournament';
import { Registration } from '@/infrastructure/db/models/Registration';
import { Category } from '@/infrastructure/db/models/Category';
import { Match } from '@/infrastructure/db/models/Match';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadFileToCloudinary } from '@/infrastructure/upload/cloudinary';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import mongoose from 'mongoose';

export async function saveTournament(formData: FormData) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error('Not authenticated');
  }

  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const location = formData.get('location') as string;
  const mapAddress = formData.get('mapAddress') as string;
  const startDate = formData.get('startDate') as string;
  const endDate = formData.get('endDate') as string;
  const registrationDeadline = formData.get('registrationDeadline') as string;
  const prizePool = formData.get('prizePool') as string;
  const status = formData.get('status') as 'DRAFT' | 'REGISTRATION_OPEN' | 'REGISTRATION_CLOSED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  const banner = formData.get('banner') as File | null;

  let bannerImage = formData.get('existingBanner') as string;

  if (banner && banner.size > 0) {
    const arrayBuffer = await banner.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    bannerImage = await uploadFileToCloudinary(buffer, 'armwrestling/tournaments', banner.type);
  }

  const tournamentData = {
    title,
    description,
    location,
    mapAddress,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    registrationDeadline: new Date(registrationDeadline),
    prizePool: Number(prizePool),
    status,
    bannerImage,
    organizerId: session.user.id,
  };

  if (id) {
    await Tournament.findByIdAndUpdate(id, tournamentData);
  } else {
    await Tournament.create(tournamentData);
  }

  revalidatePath('/admin/tournaments');
  redirect('/admin/tournaments');
}

export async function deleteTournament(id: string) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== 'Admin' && session.user.role !== 'Super Admin')) {
    throw new Error('Unauthorized');
  }

  const tId = new mongoose.Types.ObjectId(id);

  // Cascade delete: remove the competition AND everything tied to it so no
  // orphaned athletes, categories or matches are left in the database.
  await Promise.all([
    Registration.deleteMany({ tournamentId: tId }),
    Category.deleteMany({ tournamentId: tId }),
    Match.deleteMany({ tournamentId: tId }),
  ]);
  await Tournament.findByIdAndDelete(id);

  revalidatePath('/admin/tournaments');
  revalidatePath('/admin/registrations');
  revalidatePath('/admin');
}
