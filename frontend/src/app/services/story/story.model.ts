export interface StoryItem {
    id: string;
    topic: Topic;
    impact: number;
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
  answerA: Answer
  answerB: Answer
}

export interface Answer {
  text: string,
  votes: number
}

export enum Topic {
  Sales = "sales",
  Stock = "stock",
  Finance = "finance",
  News = "news"
}
