import { NextResponse } from 'next/server';
import connectToDatabase from '@/infrastructure/db/connect';
import { Tournament } from '@/infrastructure/db/models/Tournament';

// Public list of competitions open for registration — used by the homepage
// carousel and the registration form's competition selector.
export async function GET() {
  try {
    await connectToDatabase();
    const tournaments = await Tournament.find({
      status: { $in: ['REGISTRATION_OPEN', 'ACTIVE'] },
    })
      .sort({ startDate: 1 })
      .select('title description bannerImage location mapAddress startDate prizePool status weightCategory')
      .lean();

    const data = tournaments.map((t) => ({
      _id: t._id.toString(),
      title: t.title,
      description: t.description || '',
      bannerImage: t.bannerImage || '',
      location: t.location,
      mapAddress: t.mapAddress || '',
      startDate: t.startDate,
      prizePool: t.prizePool || 0,
      status: t.status,
      weightCategory: t.weightCategory || '',
    }));

    return NextResponse.json(
      { competitions: data },
      {
        // Cache at the edge/CDN for 60s, serve stale while revalidating — the
        // open-competition list changes rarely, so this avoids hitting the DB
        // on every homepage/registration page load.
        headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
      }
    );
  } catch (error: any) {
    return NextResponse.json({ competitions: [], error: error.message }, { status: 500 });
  }
}
