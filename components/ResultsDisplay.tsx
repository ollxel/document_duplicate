
import React from 'react';
import type { DuplicateLink } from '../types';
import { LinkIcon } from './icons/LinkIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { InfoIcon } from './icons/InfoIcon';

interface ResultsDisplayProps {
  results: DuplicateLink[];
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  if (results.length === 0) {
    return (
      <div className="text-center py-12 px-6 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
        <CheckCircleIcon className="w-12 h-12 mx-auto text-green-500" />
        <h3 className="mt-4 text-xl font-semibold text-slate-800 dark:text-slate-100">Analysis Complete</h3>
        <p className="mt-2 text-slate-600 dark:text-slate-300">No duplicate hyperlinks were found across the selected documents.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-4">
        <InfoIcon className="w-6 h-6 mr-3 text-indigo-500" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Duplicate Links Found</h2>
      </div>
      <p className="mb-6 text-slate-600 dark:text-slate-400">The following hyperlinks were found in more than one document. They are sorted by frequency.</p>
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Hyperlink
                </th>
                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Source Files
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider w-32">
                  Count
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {results.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-6 py-4 whitespace-nowrap max-w-sm">
                    <div className="flex items-center">
                      <LinkIcon className="w-4 h-4 mr-3 text-slate-400 flex-shrink-0" />
                      <a 
                        href={item.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 truncate"
                        title={item.link}
                      >
                        {item.link}
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-md">
                    <div className="flex flex-wrap gap-2">
                      {item.sourceFiles.map((file, fileIndex) => (
                        <span 
                          key={fileIndex} 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-600 dark:text-slate-200"
                          title={file}
                        >
                          {file}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-300 font-semibold">
                    {item.count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};