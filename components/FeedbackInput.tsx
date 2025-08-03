import React, { useState, useCallback, useRef, useEffect } from 'react';
import { EXAMPLE_PROMPTS } from '../constants';
import { generateExamplePrompts } from '../services/geminiService';

interface FeedbackInputProps {
  userInput: string;
  setUserInput: (value: string) => void;
  image: File | null;
  setImage: (file: File | null) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const LoadingSpinner = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2 text-gray-500">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" x2="12" y1="3" y2="15" />
  </svg>
);

const RefreshIcon = ({ spinning }: { spinning: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={spinning ? 'animate-spin' : ''}>
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
        <path d="M21 3v5h-5" />
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
        <path d="M3 21v-5h5" />
    </svg>
);

export function FeedbackInput({ userInput, setUserInput, image, setImage, onSubmit, isLoading }: FeedbackInputProps): React.ReactNode {
  const [isDragging, setIsDragging] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [examplePrompts, setExamplePrompts] = useState<string[]>(EXAMPLE_PROMPTS);
  const [isFetchingExamples, setIsFetchingExamples] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (image) {
      const objectUrl = URL.createObjectURL(image);
      setImagePreview(objectUrl);
      
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setImagePreview(null);
    }
  }, [image]);

  const handlePromptClick = (prompt: string) => {
    setUserInput(prompt);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
        onSubmit();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      if (e.dataTransfer.files[0].type.startsWith('image/')) {
        setImage(e.dataTransfer.files[0]);
      } else {
        alert('이미지 파일만 업로드할 수 있습니다.');
      }
    }
  }, [setImage]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  }, [isDragging]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };
  
  const handleFetchNewExamples = useCallback(async () => {
    setIsFetchingExamples(true);
    const newPrompts = await generateExamplePrompts();
    if (newPrompts && newPrompts.length > 0) {
      setExamplePrompts(newPrompts);
    }
    setIsFetchingExamples(false);
  }, []);


  return (
    <div className="bg-surface rounded-lg p-6 shadow-lg h-full flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-on-surface">1. 모호한 피드백 입력</h2>
        <p className="text-sm text-on-surface-secondary mt-1">어떤 디자인 피드백을 받았나요? 그대로 입력해보세요.</p>
      </div>
      
      <textarea
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="예: '좀 더 세련되게 바꿔주세요...'"
        className="w-full text-base bg-brand-bg border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow duration-200 resize-none"
        rows={4}
      />
      
       <div>
        <h3 className="text-base font-medium text-on-surface mb-2">선택사항: 디자인 스크린샷 첨부</h3>
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
        />
        {imagePreview ? (
            <div className="relative group">
                <img src={imagePreview} alt="Preview" className="w-full h-auto max-h-48 object-contain rounded-md bg-brand-bg" />
                <button
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove image"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                </button>
            </div>
        ) : (
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={openFileDialog}
                className={`flex flex-col justify-center items-center w-full h-32 px-4 text-center border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragging ? 'border-primary bg-primary/10' : 'border-gray-600 hover:border-gray-500'}`}
            >
                <UploadIcon />
                <p className="text-sm text-on-surface-secondary">
                  이미지를 드래그 앤 드롭하거나 클릭하여 업로드
                </p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF 등</p>
            </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-on-surface-secondary">혹은 텍스트 예시를 사용해보세요:</p>
            <button 
                onClick={handleFetchNewExamples} 
                disabled={isFetchingExamples}
                className="text-on-surface-secondary hover:text-primary disabled:text-gray-600 disabled:cursor-wait p-1 rounded-full transition-colors"
                aria-label="다른 예시 보기"
            >
                <RefreshIcon spinning={isFetchingExamples} />
            </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {examplePrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handlePromptClick(prompt)}
              className="text-xs bg-gray-700 text-on-surface-secondary px-3 py-1 rounded-full hover:bg-gray-600 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={isLoading || (!userInput.trim() && !image)}
        className="w-full bg-primary text-white font-bold py-3 px-4 rounded-md flex items-center justify-center transition-all duration-200 ease-in-out hover:bg-primary-hover disabled:bg-gray-500 disabled:cursor-not-allowed transform hover:scale-105 active:scale-100 mt-auto"
      >
        {isLoading ? <LoadingSpinner /> : <span className="text-base">피드백 구체화하기 (Ctrl+Enter)</span>}
      </button>
    </div>
  );
}