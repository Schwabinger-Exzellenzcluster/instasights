import { Component, OnInit } from '@angular/core';
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

  constructor() { }

  ngOnInit(): void {
  }

}
