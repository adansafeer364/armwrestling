import { NextResponse } from 'next/server';
import connectToDatabase from '@/infrastructure/db/connect';
import { Registration } from '@/infrastructure/db/models/Registration';
import { Tournament } from '@/infrastructure/db/models/Tournament';
import { uploadFileToCloudinary } from '@/infrastructure/upload/cloudinary';
import mongoose from 'mongoose';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Extract text fields
    const fullName = formData.get('fullName') as string;
    const fatherName = formData.get('fatherName') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const age = formData.get('age') as string;
    const city = formData.get('city') as string;
    const clubName = formData.get('clubName') as string;
    const hand = formData.get('hand') as string;
    const tournamentId = formData.get('tournamentId') as string;
    const paymentAccountNumber = formData.get('paymentAccountNumber') as string;
    const paymentAccountName = formData.get('paymentAccountName') as string;

    // Extract files
    const profilePicture = formData.get('profilePicture') as File | null;
    const paymentScreenshot = formData.get('paymentScreenshot') as File | null;

    // Validate required fields
    if (!fullName || !fatherName || !phone || !email || !age || !city || !hand) {
      return NextResponse.json({ error: 'Missing required text fields' }, { status: 400 });
    }

    if (!profilePicture) {
      return NextResponse.json({ error: 'Your picture is required' }, { status: 400 });
    }

    // Specific requirement: Prevent Submission Without Payment Screenshot + account details
    if (!paymentScreenshot) {
      return NextResponse.json({ error: 'Payment screenshot is strictly required' }, { status: 400 });
    }
    if (!paymentAccountNumber || !paymentAccountName) {
      return NextResponse.json({ error: 'Account number and account name used for payment are required' }, { status: 400 });
    }

    // Connect to database
    await connectToDatabase();

    // Helper to upload File object to Cloudinary
    const uploadSingleFile = async (file: File, folder: string) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      return uploadFileToCloudinary(buffer, folder, file.type);
    };

    // Upload the player's picture + payment screenshot concurrently
    const [profilePictureUrl, paymentScreenshotUrl] = await Promise.all([
      uploadSingleFile(profilePicture, 'armwrestling/profiles'),
      uploadSingleFile(paymentScreenshot, 'armwrestling/payments'),
    ]);

    // Determine which competition this registration belongs to. The form passes
    // the selected competition; otherwise fall back to the open tournament so
    // each competition keeps its athletes separately.
    let competitionId: mongoose.Types.ObjectId | undefined;
    if (tournamentId && mongoose.Types.ObjectId.isValid(tournamentId)) {
      const t = await Tournament.findById(tournamentId);
      competitionId = t?._id as mongoose.Types.ObjectId | undefined;
    }
    if (!competitionId) {
      const openTournament =
        (await Tournament.findOne({ status: 'REGISTRATION_OPEN' }).sort({ startDate: 1 })) ||
        (await Tournament.findOne({ status: { $in: ['ACTIVE', 'REGISTRATION_CLOSED'] } }).sort({ startDate: 1 }));
      competitionId = openTournament?._id as mongoose.Types.ObjectId | undefined;
    }

    // Generate Registration ID (ARM-YYYY-XXXX) and save, retrying on the rare
    // chance two people register at the same instant and collide on the ID.
    const currentYear = new Date().getFullYear();
    let registrationId = '';
    for (let attempt = 0; ; attempt++) {
      const count = await Registration.countDocuments();
      registrationId = `ARM-${currentYear}-${(count + 1 + attempt).toString().padStart(4, '0')}`;
      try {
        await new Registration({
          registrationId,
          tournamentId: competitionId,
          status: 'PENDING',
          fullName,
          fatherName,
          phone,
          email,
          age: parseInt(age, 10),
          city,
          clubName,
          hand,
          profilePictureUrl,
          paymentScreenshotUrl,
          paymentAccountNumber,
          paymentAccountName,
        }).save();
        break;
      } catch (e: any) {
        // Duplicate registrationId -> try the next sequence number (max 5 tries)
        if (e?.code === 11000 && attempt < 5) continue;
        throw e;
      }
    }

    return NextResponse.json(
      {
        message: 'Registration successful',
        registrationId,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
