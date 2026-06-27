import connectToDatabase from '@/infrastructure/db/connect';
import { Tournament } from '@/infrastructure/db/models/Tournament';
import TournamentForm from '../../_components/TournamentForm';
import { notFound } from 'next/navigation';

export default async function EditTournamentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectToDatabase();
  const tournament = await Tournament.findById(id);
  
  if (!tournament) {
    notFound();
  }

  // Serialize mongoose document to plain object for client component
  const tournamentObj = JSON.parse(JSON.stringify(tournament));

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Edit Tournament</h2>
        <p className="text-gray-500 text-sm mt-1">Update the details for {tournament.title}.</p>
      </div>
      <TournamentForm tournament={tournamentObj} />
    </div>
  );
}
