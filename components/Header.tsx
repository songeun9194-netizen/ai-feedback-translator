
import React from 'react';

const SparkleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
        <path d="M12 3L9.5 8.5L4 11L9.5 13.5L12 19L14.5 13.5L20 11L14.5 8.5L12 3Z"/>
        <path d="M5 22L7 17"/>
        <path d="M19 22L17 17"/>
    </svg>
)

export function Header(): React.ReactNode {
  return (
    <header className="py-4 border-b border-gray-800">
      <div className="container mx-auto px-4 md:px-8 flex items-center gap-3">
        <SparkleIcon />
        <h1 className="text-xl md:text-2xl font-bold text-on-surface tracking-tight">
          AI 디자인 피드백 번역기
        </h1>
      </div>
    </header>
  );
}
