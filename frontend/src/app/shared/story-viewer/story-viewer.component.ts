import { Component, OnInit } from '@angular/core';
import { StoryItemComponent } from './story-item/story-item.component';

@Component({
  selector: 'app-story-viewer',
  templateUrl: './story-viewer.component.html',
  styleUrls: ['./story-viewer.component.scss']
})
export class StoryViewerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
