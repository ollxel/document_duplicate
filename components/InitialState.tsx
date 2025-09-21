
import React from 'react';
import { SearchIcon } from './icons/SearchIcon';

export const InitialState: React.FC = () => {
  return (
    <div className="text-center py-12 px-6 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
      <SearchIcon className="w-12 h-12 mx-auto text-slate-400" />
      <h3 className="mt-4 text-xl font-semibold text-slate-800 dark:text-slate-100">Ready for Analysis</h3>
      <p className="mt-2 text-slate-600 dark:text-slate-300">Upload your documents and click "Analyze" to see the results here.</p>
    </div>
  );
};
