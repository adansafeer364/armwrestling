import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="text-6xl font-black text-indigo-600 mb-4">403</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
      <p className="text-gray-500 mb-6 max-w-md">
        You do not have permission to view this page. Please sign in with an account that has the required role.
      </p>
      <div className="flex gap-3">
        <Link href="/login" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-medium">
          Sign in
        </Link>
        <Link href="/" className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 font-medium">
          Go home
        </Link>
      </div>
    </div>
  );
}
