import React, { useState, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { ResultsDisplay } from './components/ResultsDisplay';
import { analyzeFiles } from './services/linkAnalysisService';
import type { DuplicateLink } from './types';
import { Header } from './components/Header';
import { InitialState } from './components/InitialState';
import { ErrorDisplay } from './components/ErrorDisplay';
import { LoadingState } from './components/LoadingState';

const App: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<DuplicateLink[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFilesChange = useCallback((selectedFiles: FileList | null) => {
    if (selectedFiles) {
      setFiles(Array.from(selectedFiles));
    } else {
      setFiles([]);
    }
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (files.length === 0) {
      setError("Please select at least one file to analyze.");
      return;
    }
    if (files.length > 20) {
      setError("You can upload a maximum of 20 files at a time.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const duplicateLinks = await analyzeFiles(files);
      setResults(duplicateLinks);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred during analysis.");
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  }, [files]);
  
  const handleReset = useCallback(() => {
    setFiles([]);
    setResults(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return (
    <div className="min-h-screen font-sans text-slate-800 dark:text-slate-200">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Header />
        <main className="mt-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 sm:p-8">
          <FileUpload 
            onFilesChange={handleFilesChange} 
            onAnalyze={handleAnalyze}
            onReset={handleReset}
            isLoading={isLoading} 
            selectedFileCount={files.length}
          />

          <div className="mt-8">
            {isLoading && <LoadingState />}
            {error && <ErrorDisplay message={error} />}
            {results === null && !isLoading && !error && <InitialState />}
            {results !== null && !isLoading && !error && <ResultsDisplay results={results} />}
          </div>
        </main>
        <footer className="text-center mt-8 text-slate-500 dark:text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Internal Tools Division. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;