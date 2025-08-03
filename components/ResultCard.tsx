
import React from 'react';
import type { Suggestion } from '../types';
import { CATEGORY_STYLES } from '../constants';

interface ResultCardProps {
  suggestion: Suggestion;
}

export function ResultCard({ suggestion }: ResultCardProps): React.ReactNode {
  const style = CATEGORY_STYLES[suggestion.category] || CATEGORY_STYLES.General;

  return (
    <div className="bg-brand-bg border border-gray-700 rounded-lg p-4 flex items-start gap-4 transition-all hover:border-primary hover:shadow-lg">
      <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white text-sm ${style.color}`}>
        {style.icon}
      </div>
      <div className="flex-grow">
        <span className={`text-sm font-semibold ${style.color.replace('bg-', 'text-')}`}>{style.label}</span>
        <p className="text-on-surface mt-1">{suggestion.suggestion}</p>
      </div>
    </div>
  );
}
