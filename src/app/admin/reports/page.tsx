import React from 'react';

export default function Reports() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Analytics & Reports</h2>
      
      <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center justify-center min-h-[400px] border border-dashed border-gray-300">
         <div className="text-gray-400 mb-4">
           <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
           </svg>
         </div>
         <h3 className="text-lg font-medium text-gray-900 mb-2">Advanced Reporting Module</h3>
         <p className="text-gray-500 text-center max-w-md">
            This module will contain detailed exportable Excel/CSV reports for tournament brackets, financial reconciliations, and athlete statistics.
         </p>
         <button className="mt-6 px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
            Generate Snapshot
         </button>
      </div>
    </div>
  );
}
