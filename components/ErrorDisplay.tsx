
import React from 'react';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';

interface ErrorDisplayProps {
    message: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
    return (
        <div className="p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-400 dark:border-red-600 rounded-r-lg">
            <div className="flex">
                <div className="flex-shrink-0">
                    <AlertTriangleIcon className="h-5 w-5 text-red-400 dark:text-red-500" />
                </div>
                <div className="ml-3">
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">
                        {message}
                    </p>
                </div>
            </div>
        </div>
    );
};
