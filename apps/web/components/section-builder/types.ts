export type Mode = "generate" | "improve";

export interface Result {
  code: string;
  title: string;
  description: string;
  componentsUsed: string[];
}

export interface SuggestionPrompt {
  label: string;
  description: string;
  icon: string;
  prompt: string;
}
