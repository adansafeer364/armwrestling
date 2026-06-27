// Seed script for local testing / demo.
//   node scripts/seed.mjs
// Creates admin + referee users, an ACTIVE tournament, and a set of APPROVED
// registrations spread across weight classes so the referee panel has athletes.
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import fs from 'fs';

const env = fs.readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
const uri = env.match(/MONGODB_URI="([^"]+)"/)[1];

await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
const db = mongoose.connection.db;

const passwordHash = await bcrypt.hash('password123', 10);

// --- Users ---
await db.collection('users').updateOne(
  { email: 'admin@test.com' },
  { $set: { email: 'admin@test.com', passwordHash, role: 'Super Admin', firstName: 'System', lastName: 'Admin', updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
  { upsert: true }
);
const admin = await db.collection('users').findOne({ email: 'admin@test.com' });
await db.collection('users').updateOne(
  { email: 'referee@test.com' },
  { $set: { email: 'referee@test.com', passwordHash, role: 'Referee', firstName: 'Match', lastName: 'Referee', updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
  { upsert: true }
);

// --- Tournament (ACTIVE) ---
const now = new Date();
const tRes = await db.collection('tournaments').findOneAndUpdate(
  { title: 'Demo Armwrestling Championship 2026' },
  {
    $set: {
      organizerId: admin._id,
      title: 'Demo Armwrestling Championship 2026',
      description: 'Seeded demo event.',
      location: 'City Sports Arena, Mansehra',
      mapAddress: 'Mansehra, Khyber Pakhtunkhwa, Pakistan',
      bannerImage: 'https://picsum.photos/seed/armwrestling-banner/1600/900',
      startDate: new Date(now.getTime() + 14 * 86400000),
      endDate: new Date(now.getTime() + 15 * 86400000),
      registrationDeadline: new Date(now.getTime() + 7 * 86400000),
      status: 'REGISTRATION_OPEN',
      entryFee: 20,
      prizePool: 5000,
      updatedAt: new Date(),
    },
    $setOnInsert: { createdAt: new Date() },
  },
  { upsert: true, returnDocument: 'after' }
);
const tournament = tRes.value || (await db.collection('tournaments').findOne({ title: 'Demo Armwrestling Championship 2026' }));

// --- Registrations (APPROVED) ---
const firstNames = ['Ali', 'Bilal', 'Hamza', 'Usman', 'Zaid', 'Omar', 'Saad', 'Faris', 'Tariq', 'Nasir', 'Kamran', 'Imran'];
const weightsRight = [68, 69, 70, 67, 66, 70, 65, 69]; // -> 70kg RIGHT (8 athletes, full bracket)
const weightsLeft = [78, 80, 77, 79];                  // -> 80kg LEFT (4 athletes)

const regs = [];
let n = 0;
const mk = (name, weight, hand) => {
  n++;
  return {
    registrationId: `ARM-2026-${String(n).padStart(4, '0')}`,
    tournamentId: tournament._id,
    fullName: name,
    fatherName: 'Father ' + name,
    phone: '0300' + String(1000000 + n),
    email: `${name.toLowerCase()}${n}@example.com`,
    age: 22 + (n % 8),
    city: 'Lahore',
    clubName: 'Iron Grip Club',
    weight,
    hand,
    profilePictureUrl: `https://i.pravatar.cc/200?img=${n}`,
    paymentScreenshotUrl: `https://picsum.photos/seed/pay${n}/300/400`,
    paymentAccountNumber: `PK${String(36000000000000 + n)}`,
    paymentAccountName: name,
    status: 'APPROVED',
    approvedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};
weightsRight.forEach((w, i) => regs.push(mk(firstNames[i], w, 'Right')));
weightsLeft.forEach((w, i) => regs.push(mk(firstNames[i + 8], w, 'Left')));
// one PENDING to show the approval queue
const pending = mk('PendingGuy', 72, 'Right');
pending.status = 'PENDING';
delete pending.approvedAt;
regs.push(pending);

// Clean slate for this tournament so categories/matches don't reference stale ids.
await db.collection('registrations').deleteMany({ tournamentId: tournament._id });
await db.collection('categories').deleteMany({ tournamentId: tournament._id });
await db.collection('matches').deleteMany({ tournamentId: tournament._id });
await db.collection('registrations').insertMany(regs);

console.log('Seeded:');
console.log('  users: admin@test.com / referee@test.com (password123)');
console.log('  tournament:', tournament._id.toString(), '(ACTIVE)');
console.log('  registrations:', regs.length, '(', regs.filter(r => r.status === 'APPROVED').length, 'approved )');
console.log('\nNext: in /admin open the tournament Categories page ->');
console.log('  "Generate Standard Categories" then "Auto-Assign Athletes",');
console.log('  then go to /referee and Start Matches.');

await mongoose.disconnect();
