
export enum FeedbackCategory {
  TYPOGRAPHY = 'Typography',
  COLOR = 'Color',
  LAYOUT = 'Layout',
  COMPONENT = 'Component',
  INTERACTION = 'Interaction',
  GENERAL = 'General',
}

export interface Suggestion {
  category: FeedbackCategory;
  suggestion: string;
}
