import TournamentForm from '../_components/TournamentForm';

export default function CreateTournamentPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Create New Tournament</h2>
        <p className="text-gray-500 text-sm mt-1">Fill in the details below to publish a new arm wrestling event.</p>
      </div>
      <TournamentForm />
    </div>
  );
}
