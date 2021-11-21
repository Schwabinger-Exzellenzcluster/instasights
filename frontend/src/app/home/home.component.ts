import { Component, OnDestroy, OnInit } from '@angular/core';
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
  public getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  storyItems: StoryItem[];

  constructor(public unsplash: UnsplashService, public storyService: StoryService) {
  }

  ngOnInit(): void {
    this.storyService.getStoryItems().subscribe((storyItems) => {
      this.storyItems = storyItems;
    })
  }

  get topics() {
    return [
      Topic.Sales,
      Topic.Stock,
      Topic.Finance,
      Topic.News
    ];
  }

  getIndicatorColor(impact: number) {
    const opacity = Math.abs(impact);
    if (impact < 0) {
      return `rgba(255, 102, 102, ${opacity})`
    } else if (impact > 0) {
      return `rgba(102, 255, 204, ${opacity})`
    } else {
      return "rgb(153, 204, 255)"
    }
  }

  public toOneString(ui_texts: UiText[]): string {
    return ui_texts.flatMap(e => e.text).join(' ')
  }
}
