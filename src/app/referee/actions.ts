'use server';

import connectToDatabase from '@/infrastructure/db/connect';
import { Match } from '@/infrastructure/db/models/Match';
import { Category } from '@/infrastructure/db/models/Category';
import { Registration } from '@/infrastructure/db/models/Registration';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose';

async function assertReferee() {
  const session = await getServerSession(authOptions);
  if (
    !session ||
    (session.user.role !== 'Referee' && session.user.role !== 'Admin' && session.user.role !== 'Super Admin')
  ) {
    throw new Error('Unauthorized');
  }
  return session;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Generate the next round of matches for a category.
 *
 * Round 1: takes every APPROVED participant in the category, shuffles them and
 * pairs them randomly. An odd competitor gets a BYE (auto-advances).
 *
 * Later rounds: regroups the winners of the previous (fully completed) round and
 * pairs them again. The tournament ends when a single champion remains.
 */
export async function generateRound(categoryId: string) {
  await assertReferee();
  await connectToDatabase();

  const category = await Category.findById(categoryId);
  if (!category) throw new Error('Category not found');

  const existing = await Match.find({ categoryId: category._id }).sort({ round: 1, matchNumber: 1 });

  let roundNumber = 1;
  let competitorIds: mongoose.Types.ObjectId[] = [];

  if (existing.length === 0) {
    // ----- Round 1: build the pool from approved participants -----
    const approved = await Registration.find({
      _id: { $in: category.participants },
      status: 'APPROVED',
    });
    competitorIds = approved.map((r) => r._id as mongoose.Types.ObjectId);

    if (competitorIds.length < 2) {
      throw new Error('Need at least 2 approved athletes in this category to start matches.');
    }
  } else {
    // ----- Subsequent rounds: advance winners of the last round -----
    const maxRound = Math.max(...existing.map((m) => m.round));
    const lastRoundMatches = existing.filter((m) => m.round === maxRound);

    const incomplete = lastRoundMatches.filter((m) => m.status !== 'COMPLETED' && m.status !== 'BYE');
    if (incomplete.length > 0) {
      throw new Error(`Round ${maxRound} still has ${incomplete.length} undecided match(es). Finish them first.`);
    }

    const winners = lastRoundMatches.map((m) => m.winnerId).filter(Boolean) as mongoose.Types.ObjectId[];

    if (winners.length <= 1) {
      throw new Error('Tournament complete — a champion has already been decided for this category.');
    }
    competitorIds = winners;
    roundNumber = maxRound + 1;
  }

  // Shuffle + pair randomly
  const pool = shuffle(competitorIds);
  const created: any[] = [];
  let matchNumber = 1;

  for (let i = 0; i < pool.length; i += 2) {
    const c1 = pool[i];
    const c2 = pool[i + 1];

    if (!c2) {
      // Odd one out -> BYE, auto-advances to next round
      const bye = await Match.create({
        tournamentId: category.tournamentId,
        categoryId: category._id,
        matchNumber: matchNumber++,
        competitor1Id: c1,
        round: roundNumber,
        bracketType: 'KNOCKOUT',
        status: 'BYE',
        winnerId: c1,
      });
      created.push(bye);
    } else {
      const match = await Match.create({
        tournamentId: category.tournamentId,
        categoryId: category._id,
        matchNumber: matchNumber++,
        competitor1Id: c1,
        competitor2Id: c2,
        round: roundNumber,
        bracketType: 'KNOCKOUT',
        status: 'READY',
      });
      created.push(match);
    }
  }

  revalidatePath('/referee');
  return { round: roundNumber, matchesCreated: created.length };
}

/** Mark a match as currently being played. */
export async function startMatch(matchId: string) {
  await assertReferee();
  await connectToDatabase();

  const match = await Match.findById(matchId);
  if (!match) throw new Error('Match not found');
  if (match.status === 'COMPLETED' || match.status === 'BYE') throw new Error('Match already decided');
  if (!match.competitor1Id || !match.competitor2Id) throw new Error('Both players must be present to start.');

  match.status = 'IN_PROGRESS';
  await match.save();
  revalidatePath('/referee');
}

/**
 * Swap an absent competitor in a match with another available athlete from the
 * same category. The replaced (absent) athlete is NOT eliminated — they simply
 * leave this match and remain available for future rounds.
 */
export async function swapCompetitor(matchId: string, slot: 'competitor1Id' | 'competitor2Id', newRegistrationId: string) {
  await assertReferee();
  await connectToDatabase();

  const match = await Match.findById(matchId);
  if (!match) throw new Error('Match not found');
  if (match.status === 'COMPLETED' || match.status === 'BYE') throw new Error('Cannot change a decided match');

  const newReg = await Registration.findById(newRegistrationId);
  if (!newReg) throw new Error('Replacement athlete not found');
  if (newReg.status !== 'APPROVED') throw new Error('Replacement athlete is not approved');

  const category = await Category.findById(match.categoryId);
  const inCategory = category?.participants.some((p) => p.toString() === newRegistrationId);
  if (!inCategory) throw new Error('Replacement athlete is not in this category');

  match[slot] = newReg._id as mongoose.Types.ObjectId;
  if (match.competitor1Id && match.competitor2Id && match.status === 'PENDING') {
    match.status = 'READY';
  }
  await match.save();

  revalidatePath('/referee');
}

/** Referee declares the winner of a match. The loser is recorded automatically. */
export async function declareWinner(matchId: string, winnerId: string, score?: string) {
  const session = await assertReferee();
  await connectToDatabase();

  const match = await Match.findById(matchId);
  if (!match) throw new Error('Match not found');
  if (match.status === 'COMPLETED') throw new Error('Match already completed');

  const c1 = match.competitor1Id?.toString();
  const c2 = match.competitor2Id?.toString();
  if (winnerId !== c1 && winnerId !== c2) {
    throw new Error('Winner must be one of the two competitors.');
  }

  const winnerObjectId = new mongoose.Types.ObjectId(winnerId);
  const loserObjectId = winnerId === c1 ? match.competitor2Id : match.competitor1Id;

  match.winnerId = winnerObjectId;
  match.loserId = loserObjectId;
  match.status = 'COMPLETED';
  if (score) match.score = score;
  match.refereeId = new mongoose.Types.ObjectId(session.user.id);
  await match.save();

  revalidatePath('/referee');
  revalidatePath(`/admin/tournaments/${match.tournamentId}/matches`);
  return { winnerId };
}
