export interface StoryItem {
    uuid: string;
    topic: Topic;
    impact: number;
    duration?: number;
    ui_text: UiText[];
    voice_text?: string;
    date?: Date;
    isNew?: boolean;
    poll?: Poll;
    data?: InsightData;
    summary?: string;
}

export interface UiText {
    text: string;
    relevance: number;
}

export enum Topic {
  Sales = "sales",
  Stock = "stock",
  Finance = "finance",
  News = "news"
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

export interface InsightData {
  xLabel: string;
  yLabel: string;
  chartData: {
    x: Date,
    y: number
  }[];
}
