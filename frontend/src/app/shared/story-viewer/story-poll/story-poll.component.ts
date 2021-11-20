import { formatNumber } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Answer, Poll } from 'src/app/services/story/story.model';

@Component({
  selector: 'app-story-poll',
  templateUrl: './story-poll.component.html',
  styleUrls: ['./story-poll.component.scss']
})
export class StoryPollComponent implements OnInit {

  poll: Poll = {
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

  answered = false;

  constructor() { }

  ngOnInit(): void {
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
