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
    ui_text: [{text: "Sales are up", impact: 0}, {text: "20%", impact: 1}, {text: "this week", impact: 0}],
    duration: 3,
    keywords: ["tree"],
    date: new Date(),
    tts_text: "hello world!",
    poll: {
      question: "Does this require instant action?",
      answerA: {
        text: "Yes",
        votes: 2,
      },
      answerB: {
        text: "No",
        votes: 5,
      }
    }
  }, {
    id: "002",
    ui_text: [{text: "hi", impact: 1}, {text: "was geht?", impact: 0}],
    duration: 1,
    keywords: ["mountain"],
    date: new Date()
  }, {
    id: "003",
    ui_text: [{text: "hello", impact: 1}],
    duration: 1,
    keywords: ["baguette"],
    date: new Date(),
    tts_text: "end"
  }];

  public activeStoryItem: number = 0;
  public activeText: number = 0;

  constructor(private activatedRoute: ActivatedRoute, public unsplash: UnsplashService) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      console.log(params.get("userId") + " " + params.get("storyItemId"));
    });
  }

  ngAfterViewInit() {
    this.nextStoryItem(this.story[0].duration);
  }

  private async nextStoryItem(time: number) {
    this.isLoading = true
    this.activeText = 0;
    this.synth.cancel();
    this.image.nativeElement.src = ""
    let img = new Image()
    await new Promise((resolve, reject) => {
      img.src = this.unsplash.getImageUrl(this.story[this.activeStoryItem].keywords)
      img.onload = () => resolve(img)
      img.onerror = reject
    })
    this.image.nativeElement.src = img.src
    this.isLoading = false
    if (this.story[this.activeStoryItem].tts_text) {
      let utterance1 = new SpeechSynthesisUtterance(this.story[this.activeStoryItem].tts_text);
      utterance1.lang = 'en-US';
      this.synth.speak(utterance1);
    }
    this.nextText();
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

  public nextText() {
    if (this.activeText < this.story[this.activeStoryItem].ui_text.length - 1) {
      setTimeout(() => {
        this.activeText++;
        this.nextText();
      }, (this.story[this.activeStoryItem].duration / (this.story[this.activeStoryItem].ui_text.length + 1)) * 1000);
    }
  }
}
