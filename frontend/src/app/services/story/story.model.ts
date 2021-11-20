import { NumberSymbol } from "@angular/common";

export interface StoryItem {
    id: string;
    duration: number;
    ui_text: UiText[];
    tts_text?: string;
    keywords: string[];
    date: Date;
    isNew?: boolean;
    poll?: Poll;
}

export interface UiText {
    text: string;
    impact: number;
}

export interface Poll {
  question: string;
  answerA: {
    text: string;
    votes: NumberSymbol;
  },
  answerB: {
    text: string;
    votes: number;
  }
}
