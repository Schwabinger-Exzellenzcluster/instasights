import { Component, OnInit } from '@angular/core';
import { Poll } from 'src/app/services/story/story.model';

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

  answerA(): void {
    console.log("Answered a");
    this.answered = true;
    this.poll.answerA.votes += 1;
  }

  answerB(): void {
    this.answered = false;
    this.poll.answerB.votes += 1;
  }

}
