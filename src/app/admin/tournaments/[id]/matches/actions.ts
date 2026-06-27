'use server';

import connectToDatabase from '@/infrastructure/db/connect';
import { Match } from '@/infrastructure/db/models/Match';
import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose';

export async function updateMatchDetails(matchId: string, data: {
  scheduledTime?: string;
  tableNumber?: number;
  status?: string;
  score?: string;
  winnerId?: string;
}) {
  await connectToDatabase();
  
  const updatePayload: any = {};
  if (data.scheduledTime !== undefined) updatePayload.scheduledTime = data.scheduledTime ? new Date(data.scheduledTime) : null;
  if (data.tableNumber !== undefined) updatePayload.tableNumber = data.tableNumber ? Number(data.tableNumber) : null;
  if (data.status !== undefined) updatePayload.status = data.status;
  if (data.score !== undefined) updatePayload.score = data.score;
  if (data.winnerId !== undefined) updatePayload.winnerId = data.winnerId ? new mongoose.Types.ObjectId(data.winnerId) : null;

  const match = await Match.findByIdAndUpdate(matchId, updatePayload, { new: true });
  
  if (match) {
    revalidatePath(`/admin/tournaments/${match.tournamentId}/matches`);
  }
}
