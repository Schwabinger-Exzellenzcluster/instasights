import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoryItem } from 'src/app/services/story/story.model';
import { StoryItemComponent } from './story-item/story-item.component';

@Component({
  selector: 'app-story-viewer',
  templateUrl: './story-viewer.component.html',
  styleUrls: ['./story-viewer.component.scss']
})
export class StoryViewerComponent implements OnInit {

  public story: StoryItem[] = [{
    id: "dgh",
    duration: 2
  }, {
    id: "xc-lknv",
    duration: 1
  }, {
    id: "cmh",
    duration: 1
  }];

  public activeStoryItem: number = 0;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      console.log(params.get("userId") +" " + params.get("storyItemId"));
    });
    this.nextStoryItem(this.story[0].duration);
  }

  private nextStoryItem(time: number) {
    setTimeout(() => {
      if (this.activeStoryItem < this.story.length - 1) {
        this.activeStoryItem++;
        this.nextStoryItem(this.story[this.activeStoryItem].duration);
      }
    }, time * 1000);
  }

}
