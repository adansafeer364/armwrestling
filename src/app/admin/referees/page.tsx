import connectToDatabase from '@/infrastructure/db/connect';
import { User } from '@/infrastructure/db/models/User';

export default async function RefereeManagement() {
  await connectToDatabase();
  const referees = await User.find({ role: { $in: ['Referee', 'Admin', 'Super Admin'] } });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Referee & Staff Management</h2>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Add Referee</button>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {referees.length > 0 ? referees.map((referee) => (
              <tr key={referee._id.toString()}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{referee.firstName} {referee.lastName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{referee.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                   <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">{referee.role}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Active</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 hover:text-indigo-900 cursor-pointer">Manage</td>
              </tr>
            )) : (
              <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">No referees found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
