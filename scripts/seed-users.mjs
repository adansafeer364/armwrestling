// Create / update the staff login accounts (Admin + Referee) in the DATABASE.
//   node scripts/seed-users.mjs
//
// Credentials come from env vars if set, otherwise sensible defaults are used.
// Override like:  ADMIN_EMAIL="me@club.pk" ADMIN_PASSWORD="strongpass" node scripts/seed-users.mjs
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import fs from 'fs';

const env = fs.readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
const uri = env.match(/MONGODB_URI="([^"]+)"/)[1];

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@test.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password123';
const REFEREE_EMAIL = process.env.REFEREE_EMAIL || 'referee@test.com';
const REFEREE_PASSWORD = process.env.REFEREE_PASSWORD || 'password123';

await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
const users = mongoose.connection.db.collection('users');

async function upsertUser(email, password, role, firstName, lastName) {
  const passwordHash = await bcrypt.hash(password, 10);
  await users.updateOne(
    { email: email.toLowerCase() },
    {
      $set: { email: email.toLowerCase(), passwordHash, role, firstName, lastName, updatedAt: new Date() },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true }
  );
  console.log(`  ✓ ${role.padEnd(12)} ${email}  (password: ${password})`);
}

console.log('Saving staff accounts to the database:');
await upsertUser(ADMIN_EMAIL, ADMIN_PASSWORD, 'Super Admin', 'System', 'Admin');
await upsertUser(REFEREE_EMAIL, REFEREE_PASSWORD, 'Referee', 'Match', 'Referee');

console.log('\nDone. These credentials now live in MongoDB and are used for login.');
await mongoose.disconnect();
