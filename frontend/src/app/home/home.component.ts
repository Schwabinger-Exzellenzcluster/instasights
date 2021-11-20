import { Component, OnInit } from '@angular/core';
import { compareAsc } from 'date-fns';
import { Subscription } from 'rxjs';
import { StoryItem, Topic, UiText } from '../services/story/story.model';
import { StoryService } from '../services/story/story.service';
import { UnsplashService } from '../services/unsplash/unsplash.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public funkyColors = ["#1770ff", "#17ff9e", "#ff2e17", "#6817ff"];

  public getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  public storyItems: StoryItem[];
  private storySub: Subscription

  constructor(public unsplash: UnsplashService, private storyService: StoryService) { }

  ngOnInit(): void {
    this.storySub = this.storyService.getStoryItems().subscribe((storyItems) => {
      this.storyItems = storyItems;
    });
  }

  get topics() {
    return [
      Topic.Sales,
      Topic.Stock,
      Topic.Finance,
      Topic.News
    ];
  }

  getTopicStory(topic: Topic) {
    return this.storyItems.filter((storyItem) => {
      return storyItem.topic == topic;
    }).sort((a: StoryItem, b: StoryItem) => {
      return compareAsc(a.date, b.date);
    });
  }

  public toOneString(ui_texts: UiText[]): string {
    return ui_texts.flatMap(e => e.text).join(' ')
  }
}
