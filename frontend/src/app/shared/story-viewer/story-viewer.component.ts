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
    duration: 1
  }, {
    id: "xc-lknv",
    duration: 1
  }, {
    id: "cmh",
    duration: 1
  }];

  public activeStoryItem: number = 1;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      console.log(params.get("userId") +" " + params.get("storyItemId"));
    });
  }

}
