import { NextResponse } from 'next/server';
import connectToDatabase from '@/infrastructure/db/connect';
import { Match } from '@/infrastructure/db/models/Match';
import { Category } from '@/infrastructure/db/models/Category';
import { Registration } from '@/infrastructure/db/models/Registration';

export const dynamic = 'force-dynamic';

// Returns the single "current" match the referee is working on, so a public
// screen can mirror it: Player 1 vs Player 2 (with photos), and once decided,
// who won and who lost.
export async function GET() {
  try {
    await connectToDatabase();

    // Priority: a live (in-progress) match, then the most recently decided
    // match (to show the result), then the next ready match.
    const current =
      (await Match.findOne({ status: 'IN_PROGRESS' }).sort({ updatedAt: -1 }).lean()) ||
      (await Match.findOne({ status: 'COMPLETED' }).sort({ updatedAt: -1 }).lean()) ||
      (await Match.findOne({ status: 'READY' }).sort({ round: 1, matchNumber: 1 }).lean());

    if (!current) {
      return NextResponse.json({ match: null });
    }

    const [c1, c2, category] = await Promise.all([
      current.competitor1Id ? Registration.findById(current.competitor1Id).select('fullName profilePictureUrl weight city').lean() : null,
      current.competitor2Id ? Registration.findById(current.competitor2Id).select('fullName profilePictureUrl weight city').lean() : null,
      current.categoryId ? Category.findById(current.categoryId).select('name').lean() : null,
    ]);

    const player = (r: any) =>
      r ? { id: r._id.toString(), name: r.fullName, photo: r.profilePictureUrl, weight: r.weight, city: r.city } : null;

    return NextResponse.json({
      match: {
        id: current._id.toString(),
        status: current.status,
        round: current.round,
        category: category ? category.name : '',
        score: current.score || '',
        winnerId: current.winnerId ? current.winnerId.toString() : null,
        player1: player(c1),
        player2: player(c2),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ match: null, error: error.message }, { status: 500 });
  }
}
