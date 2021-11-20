import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { compareAsc } from 'date-fns';
import { Subscription } from 'rxjs';
import { StoryItem } from 'src/app/services/story/story.model';
import { StoryService } from 'src/app/services/story/story.service';
import { UnsplashService } from 'src/app/services/unsplash/unsplash.service';

@Component({
  selector: 'app-story-viewer',
  templateUrl: './story-viewer.component.html',
  styleUrls: ['./story-viewer.component.scss']
})
export class StoryViewerComponent implements OnInit, OnDestroy {
  public synth = window.speechSynthesis;

  public isPaused: boolean = false;

  public funkyColors = ["#1770ff", "#17ff9e", "#ff2e17", "#6817ff"];

  public isLoading: boolean = true;

  @ViewChild('image') image: ElementRef;

  public story: StoryItem[];
  private storySub: Subscription;

  public activeStoryItem: number = 0;
  public activeText: number = 0;

  private textTimeout: any;
  private storyTimeout: any;

  public showSummary: boolean = false;

  constructor(private activatedRoute: ActivatedRoute, public unsplash: UnsplashService, private storyService: StoryService) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.storySub = this.storyService.getStoryItems().subscribe((storyItems) => {
        this.story = storyItems.filter((storyItem) => {
          return storyItem.topic == params.get("topic");
        }).sort((a: StoryItem, b: StoryItem) => {
          return compareAsc(a.date, b.date)
        });

        this.activeStoryItem = this.story.findIndex((storyItem) => {
          return storyItem.uuid == params.get("storyItemId");
        })
      });
    });
  }

  ngAfterViewInit() {
    this.nextStoryItem();
  }

  ngOnDestroy(): void {
    this.synth.cancel();
    clearTimeout(this.textTimeout);
    clearTimeout(this.storyTimeout);
    if (this.storySub) {
      this.storySub.unsubscribe();
    }
  }

  private async nextStoryItem() {
    window.history.replaceState({}, '', `/stories/${this.story[this.activeStoryItem].topic}/${this.story[this.activeStoryItem].uuid}`);
    this.story[this.activeStoryItem].duration = this.story[this.activeStoryItem].ui_text.length * 1;

    this.isLoading = true
    this.activeText = 0;
    this.synth.cancel();
    this.image.nativeElement.src = ""
    let img = new Image()
    await new Promise((resolve, reject) => {
      img.src = this.unsplash.getImageUrl(this.story[this.activeStoryItem])
      img.onload = () => resolve(img)
      img.onerror = reject
    })
    this.image.nativeElement.src = img.src
    this.isLoading = false
    if (this.story[this.activeStoryItem].voice_text) {
      let utterance1 = new SpeechSynthesisUtterance(this.story[this.activeStoryItem].voice_text);
      utterance1.lang = 'en-US';
      this.synth.speak(utterance1);
    }
    this.nextText();
    this.storyTimeout = setTimeout(() => {
      if (this.activeStoryItem < this.story.length - 1 && !this.isPaused) {
        this.activeStoryItem++;
        this.nextStoryItem();
      }
    }, this.story[this.activeStoryItem].duration * 1000);
  }

  public nextText() {
    if (this.activeText < this.story[this.activeStoryItem].ui_text.length - 1) {
      this.textTimeout = setTimeout(() => {
        this.activeText++;
        this.nextText();
      }, (this.story[this.activeStoryItem].duration / (this.story[this.activeStoryItem].ui_text.length + 1)) * 1000);
    }
  }

  public getTimeInterval() {
    let val = this.story[this.activeStoryItem].duration / (this.story[this.activeStoryItem].ui_text.length + 1);
    return (this.story[this.activeStoryItem].duration / (this.story[this.activeStoryItem].ui_text.length + 1)/2) + "s"
  }

  public isNumber(_thing): boolean {
    let thing = _thing.replace("%", "")
    return !isNaN(thing) && !isNaN(parseFloat(thing))
  }

  public getIndicatorColor(impact: number) {
    const opacity = Math.abs(impact);
    if (impact < 0) {
      return `rgba(255, 102, 102, ${opacity})`
    } else if (impact > 0) {
      return `rgba(102, 255, 204, ${opacity})`
    } else {
      return "rgb(90, 142, 194)"
    }
  }

  public getTextColor(impact: number) {
    if (impact > 0) {
      return `rgb(255, 102, 102)`
    } else if (impact <= 0) {
      return `rgb(102, 255, 204)`
    } else {
      return "rgba(255, 102, 102"
    }
  }

  public togglePause() {
    if (this.isPaused) {
      this.nextStoryItem();
    } else {
      clearTimeout(this.textTimeout);
      clearTimeout(this.storyTimeout);
    }
    this.isPaused = !this.isPaused;
  }
}
