
import React from 'react';
import { Spinner } from './Spinner';

export const LoadingState: React.FC = () => {
  return (
    <div className="text-center py-12 px-6 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
      <Spinner />
      <h3 className="mt-4 text-xl font-semibold text-slate-800 dark:text-slate-100">Analyzing Documents...</h3>
      <p className="mt-2 text-slate-600 dark:text-slate-300">This may take a moment. Please wait.</p>
    </div>
  );
};
