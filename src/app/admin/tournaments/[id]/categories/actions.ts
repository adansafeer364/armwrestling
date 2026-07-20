'use server';

import connectToDatabase from '@/infrastructure/db/connect';
import { Category } from '@/infrastructure/db/models/Category';
import { Registration } from '@/infrastructure/db/models/Registration';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose';

async function assertAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== 'Admin' && session.user.role !== 'Super Admin')) {
    throw new Error('Unauthorized');
  }
}

/** Create a single category by hand (admin "Add Category" form). */
export async function createCategory(
  tournamentId: string,
  data: { name: string; minWeightKg: number; maxWeightKg: number; arm: 'LEFT' | 'RIGHT' | 'BOTH'; maxParticipants?: number }
) {
  await assertAdmin();
  await connectToDatabase();

  const name = (data.name || '').trim();
  if (!name) throw new Error('Category name is required.');
  if (!['LEFT', 'RIGHT', 'BOTH'].includes(data.arm)) throw new Error('Please choose an arm.');
  const min = Number(data.minWeightKg);
  const max = Number(data.maxWeightKg);
  if (Number.isNaN(min) || Number.isNaN(max)) throw new Error('Weight limits must be numbers.');
  if (max <= min) throw new Error('Maximum weight must be greater than the minimum weight.');

  const tId = new mongoose.Types.ObjectId(tournamentId);
  const exists = await Category.findOne({ tournamentId: tId, name, arm: data.arm });
  if (exists) throw new Error(`A "${name}" (${data.arm}) category already exists for this tournament.`);

  await Category.create({
    tournamentId: tId,
    name,
    gender: 'OPEN',
    minWeightKg: min,
    maxWeightKg: max,
    arm: data.arm,
    maxParticipants: data.maxParticipants ? Number(data.maxParticipants) : undefined,
    participants: [],
  });

  revalidatePath(`/admin/tournaments/${tournamentId}/categories`);
}

/** Delete a category (admin). */
export async function deleteCategory(tournamentId: string, categoryId: string) {
  await assertAdmin();
  await connectToDatabase();
  await Category.findByIdAndDelete(categoryId);
  revalidatePath(`/admin/tournaments/${tournamentId}/categories`);
}

export async function generateDefaultCategories(tournamentId: string) {
  await connectToDatabase();

  // Custom weight classes requested: -50, -60, -70, -80, -90, -100, 100+
  const steps = [50, 60, 70, 80, 90, 100];
  const weightClasses = [
    ...steps.map((kg, i) => ({
      name: `-${kg}kg`,
      minWeightKg: i === 0 ? 0 : steps[i - 1],
      maxWeightKg: kg,
    })),
    { name: '100kg+', minWeightKg: 100, maxWeightKg: 999 },
  ];

  const arms: Array<'LEFT' | 'RIGHT'> = ['LEFT', 'RIGHT'];

  for (const arm of arms) {
    for (const wc of weightClasses) {
      const categoryName = `${wc.name} ${arm} Arm`;
      
      // Check if exists to avoid unique constraint errors
      const exists = await Category.findOne({
        tournamentId: new mongoose.Types.ObjectId(tournamentId),
        name: categoryName,
        arm
      });

      if (!exists) {
        await Category.create({
          tournamentId: new mongoose.Types.ObjectId(tournamentId),
          name: categoryName,
          gender: 'OPEN',
          minWeightKg: wc.minWeightKg,
          maxWeightKg: wc.maxWeightKg,
          arm,
          participants: []
        });
      }
    }
  }

  revalidatePath(`/admin/tournaments/${tournamentId}/categories`);
}

export async function autoAssignAthletes(tournamentId: string) {
  await connectToDatabase();

  const tId = new mongoose.Types.ObjectId(tournamentId);

  // Fetch categories for this tournament
  const categories = await Category.find({ tournamentId: tId });

  // Only assign APPROVED athletes who belong to this tournament (or who were
  // registered before tournament linking existed — tournamentId unset).
  const registrations = await Registration.find({
    status: 'APPROVED',
    $or: [{ tournamentId: tId }, { tournamentId: { $exists: false } }, { tournamentId: null }],
  });

  let assignmentsMade = 0;

  for (const reg of registrations) {
    const weight = reg.weight;
    if (typeof weight !== 'number') continue;

    let preferredArms: string[] = [];
    if (reg.hand === 'Both') {
      preferredArms = ['LEFT', 'RIGHT'];
    } else if (reg.hand === 'Left') {
      preferredArms = ['LEFT'];
    } else if (reg.hand === 'Right') {
      preferredArms = ['RIGHT'];
    }

    for (const arm of preferredArms) {
      // Find the appropriate category
      const category = categories.find(
        (c) => c.arm === arm && weight > c.minWeightKg && weight <= c.maxWeightKg
      );

      if (category) {
        // Only assign if not already in the array (ObjectId-safe comparison)
        const already = category.participants.some((p) => p.toString() === reg._id.toString());
        if (!already) {
          category.participants.push(reg._id);
          assignmentsMade++;
        }
      }
    }
  }

  // Save updated categories
  for (const category of categories) {
    await category.save();
  }

  revalidatePath(`/admin/tournaments/${tournamentId}/categories`);
  return assignmentsMade;
}
