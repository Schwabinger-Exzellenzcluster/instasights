export interface Profile {
    name: string;
    imageUrl: string;
}

export interface Story {
    profile: Profile;
    items: StoryItem[];
}

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
  answerA: Answer
  answerB: Answer
}

export interface Answer {
  text: string,
  votes: number
}
