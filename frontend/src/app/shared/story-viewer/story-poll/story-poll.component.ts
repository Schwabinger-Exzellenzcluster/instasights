import { formatNumber } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Answer, Poll } from 'src/app/services/story/story.model';
import { StoryService } from 'src/app/services/story/story.service';

@Component({
  selector: 'app-story-poll',
  templateUrl: './story-poll.component.html',
  styleUrls: ['./story-poll.component.scss']
})
export class StoryPollComponent implements OnInit, OnDestroy {
  @Input() storyItemId: string;

  poll: Poll;
  storyItemSub: Subscription;

  answered = false;

  constructor(private storyService: StoryService) { }

  ngOnInit(): void {
    this.storyItemSub = this.storyService.getStoryItems().subscribe((storyItems) => {
      this.poll = storyItems.find(item => item.id === this.storyItemId)?.poll;
    });
  }

  ngOnDestroy(): void {
    if (this.storyItemSub) {
      this.storyItemSub.unsubscribe();
    }
  }

  getAnswerText(answer: Answer) {
    if (this.answered) {
      return `${formatNumber(this.getAnswerPercent(answer.votes), "en", "1.0-0")}%`;
    } else {
      return answer.text;
    }
  }

  getAnswerWidth(answer: Answer) {
    if (!this.answered) {
      return "100%";
    } else {
      const diffFromFifty = this.getAnswerPercent(answer.votes) - 50;
      console.log(diffFromFifty);
      return `${100 + diffFromFifty}%`;
    }
  }

  private getAnswerPercent(votes: number) {
    return (votes / (this.poll.answerA.votes + this.poll.answerB.votes)) * 100;
  }

  answer(answer: Answer): void {
    if (this.answered) {
      return;
    }
    this.answered = true;
    answer.votes += 1;
  }
}
