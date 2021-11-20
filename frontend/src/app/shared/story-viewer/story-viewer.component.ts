import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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

  public isLoading: boolean = true;

  @ViewChild('image') image: ElementRef;

  public story: StoryItem[] = [{
    id: "001",
    ui_text: "hey",
    duration: 2,
    keywords: ["tree"],
    date: new Date()
  }, {
    id: "002",
    ui_text: "hi",
    duration: 1,
    keywords: ["mountain"],
    date: new Date()
  }, {
    id: "003",
    ui_text: "hello",
    duration: 1,
    keywords: ["baguette"],
    date: new Date()
  }];

  public activeStoryItem: number = 0;

  constructor(private activatedRoute: ActivatedRoute, public unsplash: UnsplashService) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      console.log(params.get("userId") + " " + params.get("storyItemId"));
    });
  }

  ngAfterViewInit() {
    this.nextStoryItem(this.story[0].duration);
  }

  public getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  private async nextStoryItem(time: number) {
    this.isLoading = true
    this.synth.cancel();
    if (this.story[this.activeStoryItem].tts_text) {
      let utterance1 = new SpeechSynthesisUtterance(this.story[this.activeStoryItem].tts_text);
      utterance1.lang = 'en-US';
      this.synth.speak(utterance1);
    }
    this.image.nativeElement.src = ""
    let img = new Image()
    await new Promise((resolve, reject) => {
      img.src = this.unsplash.getImageUrl(this.story[this.activeStoryItem].keywords)
      img.onload = () => resolve(img)
      img.onerror = reject
    })
    this.image.nativeElement.src = img.src
    this.isLoading = false
    setTimeout(() => {
      if (this.activeStoryItem < this.story.length - 1) {
        this.activeStoryItem++;
        this.nextStoryItem(this.story[this.activeStoryItem].duration);
      }
    }, time * 1000);
  }

  public doneLoading() {
    console.log(new Date());
  }

}
