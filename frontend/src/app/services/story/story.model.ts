export interface StoryItem {
    id: string;
    duration: number;
    ui_text: UiText[];
    tts_text?: string;
    keywords: string[];
    date: Date;
    isNew?: boolean;
}

export interface UiText {
    text: string;
    impact: number;
}