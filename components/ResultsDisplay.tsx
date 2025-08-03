
import React from 'react';
import type { Suggestion } from '../types';
import { ResultCard } from './ResultCard';

interface ResultsDisplayProps {
  results: Suggestion[];
  isLoading: boolean;
  error: string | null;
  hasTranslated: boolean;
}

const SkeletonCard = () => (
  <div className="bg-surface rounded-lg p-4 animate-pulse flex items-start gap-4">
    <div className="w-10 h-10 rounded-full bg-gray-700 flex-shrink-0"></div>
    <div className="flex-grow">
      <div className="h-4 bg-gray-700 rounded w-1/4 mb-3"></div>
      <div className="h-3 bg-gray-700 rounded w-full mb-2"></div>
      <div className="h-3 bg-gray-700 rounded w-5/6"></div>
    </div>
  </div>
);

const EmptyState = () => (
    <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-700 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 mb-4">
            <path d="m18 16 4-4-4-4"/>
            <path d="m6 8-4 4 4 4"/>
            <path d="m14.5 4-5 16"/>
        </svg>
        <h3 className="text-lg font-semibold text-on-surface">결과가 여기에 표시됩니다</h3>
        <p className="text-on-surface-secondary mt-1">왼쪽 입력창에 피드백을 입력하고<br/>'피드백 구체화하기' 버튼을 눌러주세요.</p>
    </div>
);

export function ResultsDisplay({ results, isLoading, error, hasTranslated }: ResultsDisplayProps): React.ReactNode {
  return (
    <div className="bg-surface rounded-lg p-6 shadow-lg h-full">
      <h2 className="text-lg font-semibold text-on-surface mb-4">2. 구체화된 디자인 제안</h2>
      
      <div className="space-y-4">
        {isLoading && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}

        {!isLoading && error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg" role="alert">
            <strong className="font-bold">오류 발생: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {!isLoading && !error && hasTranslated && results.length === 0 && (
          <div className="text-center py-10 text-on-surface-secondary">
             <p>AI가 제안을 생성하지 못했습니다. <br/> 좀 더 명확한 피드백으로 다시 시도해보세요.</p>
          </div>
        )}

        {!isLoading && !error && results.length > 0 && (
          results.map((result, index) => (
            <ResultCard key={index} suggestion={result} />
          ))
        )}

        {!isLoading && !hasTranslated && (
            <EmptyState />
        )}
      </div>
    </div>
  );
}
