import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoryItem } from 'src/app/services/story/story.model';
import { UnsplashService } from 'src/app/services/unsplash/unsplash.service';

@Component({
  selector: 'app-story-viewer',
  templateUrl: './story-viewer.component.html',
  styleUrls: ['./story-viewer.component.scss']
})
export class StoryViewerComponent implements OnInit {
  public synth = window.speechSynthesis;

  public funkyColors = ["#1770ff", "#17ff9e", "#ff2e17", "#6817ff"];

  public story: StoryItem[] = [{
    id: "001",
    ui_text: "hey",
    duration: 2,
    keywords: ["tree"]
  }, {
    id: "002",
    ui_text: "hi",
    duration: 1,
    keywords: ["mountain"]
  }, {
    id: "003",
    ui_text: "hello",
    duration: 1,
    keywords: ["baguette"]
  }];

  public activeStoryItem: number = 0;

  constructor(private activatedRoute: ActivatedRoute, public unsplash: UnsplashService) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      console.log(params.get("userId") +" " + params.get("storyItemId"));
    });
    this.nextStoryItem(this.story[0].duration);
  }

  public getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  private nextStoryItem(time: number) {
    this.synth.cancel();
    if (this.story[this.activeStoryItem].tts_text) {
      let utterance1 = new SpeechSynthesisUtterance(this.story[this.activeStoryItem].tts_text);
      utterance1.lang = 'en-US';
      this.synth.speak(utterance1);
    }
    setTimeout(() => {
      if (this.activeStoryItem < this.story.length - 1) {
        this.activeStoryItem++;
        this.nextStoryItem(this.story[this.activeStoryItem].duration);
      }
    }, time * 1000);
  }

}
