import connectToDatabase from '@/infrastructure/db/connect';
import { Category } from '@/infrastructure/db/models/Category';
import { Tournament } from '@/infrastructure/db/models/Tournament';
import { notFound } from 'next/navigation';
import { CategoryActions } from './CategoryActions';
import DeleteCategoryButton from './DeleteCategoryButton';
import mongoose from 'mongoose';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function CategoryManagementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectToDatabase();

  const tournament = await Tournament.findById(id);
  if (!tournament) {
    notFound();
  }

  // Fetch categories and populate participants
  const categories = await Category.find({ tournamentId: new mongoose.Types.ObjectId(id) })
    .populate({ path: 'participants', select: 'fullName weight' })
    .sort({ minWeightKg: 1, arm: 1 })
    .lean();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/admin/tournaments" className="text-indigo-600 text-sm hover:underline mb-2 inline-block">&larr; Back to Tournaments</Link>
          <h2 className="text-2xl font-bold text-gray-800">Categories for {tournament.title}</h2>
          <p className="text-gray-500 text-sm mt-1">Manage weight classes and view assigned athletes.</p>
        </div>
        <CategoryActions tournamentId={id} />
      </div>

      {categories.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
          <p className="text-gray-500">No categories found. Click "Generate Standard Categories" to create them.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map(category => (
            <div key={category._id.toString()} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                    {category.arm}
                  </span>
                  <DeleteCategoryButton tournamentId={id} categoryId={category._id.toString()} />
                </div>
              </div>
              <div className="mb-4 text-sm text-gray-600">
                Weight Class: {category.minWeightKg}kg - {category.maxWeightKg === 999 ? 'MAX' : category.maxWeightKg + 'kg'}
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-2">
                  Assigned Athletes ({category.participants?.length || 0})
                </h4>
                {category.participants && category.participants.length > 0 ? (
                  <ul className="space-y-1">
                    {category.participants.map((p: any) => (
                      <li key={p._id.toString()} className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
                        {p.fullName} ({p.weight}kg)
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400 italic">No athletes assigned yet.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
