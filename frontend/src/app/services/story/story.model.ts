export interface StoryItem {
    uuid: string;
    topic: Topic;
    duration: number;
    ui_text: UiText[];
    voice_text?: string;
    date: Date;
    isNew?: boolean;
    poll?: Poll;
}

export interface UiText {
    text: string;
    relevance: number;
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
