
import { FeedbackCategory } from './types';

export const EXAMPLE_PROMPTS: string[] = [
  '좀 더 세련되게 만들어주세요.',
  '뭔가 허전한 느낌이에요.',
  '사용자가 더 오래 머물게 하고 싶어요.',
  '좀 더 전문가적인 느낌이 나도록 해주세요.',
  '눈에 잘 안 들어와요.',
];

export const CATEGORY_STYLES: { [key in FeedbackCategory]: { icon: string; color: string; label: string } } = {
  [FeedbackCategory.TYPOGRAPHY]: { icon: 'T', color: 'bg-sky-500', label: '타이포그래피' },
  [FeedbackCategory.COLOR]: { icon: 'C', color: 'bg-rose-500', label: '색상' },
  [FeedbackCategory.LAYOUT]: { icon: 'L', color: 'bg-amber-500', label: '레이아웃' },
  [FeedbackCategory.COMPONENT]: { icon: 'Co', color: 'bg-emerald-500', label: '컴포넌트' },
  [FeedbackCategory.INTERACTION]: { icon: 'I', color: 'bg-violet-500', label: '인터랙션' },
  [FeedbackCategory.GENERAL]: { icon: 'G', color: 'bg-gray-500', label: '일반' },
};
