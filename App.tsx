
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { FeedbackInput } from './components/FeedbackInput';
import { ResultsDisplay } from './components/ResultsDisplay';
import { translateFeedback } from './services/geminiService';
import type { Suggestion } from './types';
import { Footer } from './components/Footer';

// Helper to convert File to base64
const fileToBase64 = (file: File): Promise<{ mimeType: string; data: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const mimeType = result.split(';')[0].split(':')[1];
      const data = result.split(',')[1];
      resolve({ mimeType, data });
    };
    reader.onerror = (error) => reject(error);
  });
};


function App(): React.ReactNode {
  const [userInput, setUserInput] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [results, setResults] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasTranslated, setHasTranslated] = useState<boolean>(false);

  const handleSubmit = useCallback(async () => {
    if ((!userInput.trim() && !image) || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResults([]);
    setHasTranslated(true);

    try {
      let imagePart;
      if (image) {
        const { mimeType, data } = await fileToBase64(image);
        imagePart = { inlineData: { mimeType, data } };
      }
      
      const feedbackText = userInput.trim() || "첨부된 이미지를 분석하고 개선점을 제안해주세요.";
      const translatedSuggestions = await translateFeedback(feedbackText, imagePart);
      setResults(translatedSuggestions);

    } catch (err) {
      console.error(err);
      setError('피드백을 번역하는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  }, [userInput, image, isLoading]);

  return (
    <div className="min-h-screen bg-brand-bg text-on-surface font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3 lg:flex-shrink-0">
          <FeedbackInput
            userInput={userInput}
            setUserInput={setUserInput}
            image={image}
            setImage={setImage}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
        <div className="lg:w-2/3 lg:flex-grow">
          <ResultsDisplay
            results={results}
            isLoading={isLoading}
            error={error}
            hasTranslated={hasTranslated}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
