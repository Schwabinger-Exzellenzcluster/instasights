import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { StoryItem, Topic } from './story.model';

@Injectable({
  providedIn: 'root'
})
export class StoryService {
  private _storySubject: BehaviorSubject<StoryItem[]> = new BehaviorSubject(STORY_ITEMS);

  private apiUrl = 'http://192.168.2.122:5000/insights';
  private demoHosting = true;

  constructor(public http: HttpClient) {
    // this.apiUrl = 'http://192.168.2.126:5000'
  }

  getStoryItems() {
    if (this.demoHosting) {
      return this.http.get<StoryItem[]>("./assets/insights.json");
    } else {
      return this.http.get<StoryItem[]>(this.apiUrl);
    }
  }
}


const STORY_ITEMS: StoryItem[] = [{
  uuid: "001",
  impact: 1,
  topic: Topic.Sales,
  ui_text: [{text: "Sales are up", relevance: 0}, {text: "20%", relevance: 1}, {text: "this week", relevance: 0}],
  duration: 3,
  date: new Date(),
  voice_text: "hello Joe!",
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
  uuid: "002",
  impact: 0,
  topic: Topic.Sales,
  ui_text: [{text: "hi", relevance: 1}, {text: "was geht?", relevance: 0}],
  duration: 2,
  date: new Date()
}, {
  uuid: "003",
  impact: -1,
  topic: Topic.Sales,
  ui_text: [{text: "hello", relevance: 1}],
  duration: 1,
  date: new Date(),
  voice_text: "end",
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
  uuid: "004",
  topic: Topic.Sales,
  impact: -0.5,
  ui_text: [{text: "hello", relevance: 1}],
  duration: 1,
  date: new Date(),
  voice_text: "end",
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
}];

