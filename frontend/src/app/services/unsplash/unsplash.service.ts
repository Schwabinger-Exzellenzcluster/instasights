import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StoryItem } from '../story/story.model';


@Injectable({
  providedIn: 'root'
})
export class UnsplashService {

  constructor(private http: HttpClient) { }

  /**
   * Example Usage: <img [src]="unsplash.getImageUrl(['business'])">
   */
  public getImageUrl(storyItem: StoryItem): string {
    const relevantWords = storyItem.ui_text.filter((el) => el.relevance == 1 && !/\d/.test(el.text)).map((el) => el.text);
    const firstRelevantWord = relevantWords?.length > 0 ? relevantWords[0] : ""
    const keywords = [storyItem.topic.toString()].concat(firstRelevantWord.split(" "))
    return `https://source.unsplash.com/featured/?${keywords.join(",")}`;
  }
}
