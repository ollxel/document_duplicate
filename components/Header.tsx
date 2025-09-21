
import React from 'react';
import { LayersIcon } from './icons/LayersIcon';

export const Header: React.FC = () => {
  return (
    <header className="text-center">
        <div className="inline-flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/50 rounded-xl p-3">
            <LayersIcon className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
        </div>
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl mt-4">
        Document Link Analyzer
      </h1>
      <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
        Upload a batch of documents to identify and list all hyperlinks that appear more than once.
      </p>
    </header>
  );
};
