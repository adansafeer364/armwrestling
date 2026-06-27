import { NextResponse } from 'next/server';
import connectToDatabase from '@/infrastructure/db/connect';
import { Registration } from '@/infrastructure/db/models/Registration';
import { Tournament } from '@/infrastructure/db/models/Tournament';

export const dynamic = 'force-dynamic';

// Public status lookup — athletes register without an account, so they can
// check their approval status by Registration ID or phone number.
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || '').trim();
    if (!q) return NextResponse.json({ found: false });

    await connectToDatabase();

    // Normalize a phone number to its significant digits so different formats
    // all match: "0300 1234567", "03001234567", "+923001234567" → "3001234567".
    const normPhone = (p: string) => (p || '').replace(/\D/g, '').replace(/^92/, '').replace(/^0/, '');
    const qDigits = normPhone(q);

    // First try an exact Registration ID match.
    let reg: any = await Registration.findOne({ registrationId: q.toUpperCase() })
      .select('registrationId fullName status tournamentId phone')
      .lean();

    // Otherwise match by normalized phone (small dataset — a scan is fine here).
    if (!reg && qDigits.length >= 7) {
      const candidates = await Registration.find({})
        .select('registrationId fullName status tournamentId phone')
        .lean();
      reg = candidates.find((c: any) => normPhone(c.phone) === qDigits) || null;
    }

    if (!reg) return NextResponse.json({ found: false });

    let competition = '';
    if (reg.tournamentId) {
      const t = await Tournament.findById(reg.tournamentId).select('title').lean();
      competition = (t as any)?.title || '';
    }

    return NextResponse.json({
      found: true,
      registrationId: reg.registrationId,
      fullName: reg.fullName,
      status: reg.status,
      competition,
    });
  } catch (error: any) {
    return NextResponse.json({ found: false, error: error.message }, { status: 500 });
  }
}
