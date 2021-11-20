import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { StoryItem, Topic } from './story.model';

@Injectable({
  providedIn: 'root'
})
export class StoryService {
  public apiUrl = 'http://192.168.2.129:5000/insights';

  constructor(public http: HttpClient) {
    this.apiUrl = "http://localhost:5000/";
  }

  getStoryItems() {
    return this.http.get<StoryItem[]>(this.apiUrl);
  }
}


/*const STORY_ITEMS: StoryItem[] = [{
  id: "001",
  impact: 1,
  topic: Topic.Sales,
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
  impact: 0,
  topic: Topic.Sales,
  ui_text: [{text: "hi", impact: 1}, {text: "was geht?", impact: 0}],
  duration: 2,
  keywords: ["mountain"],
  date: new Date()
}, {
  id: "003",
  impact: -1,
  topic: Topic.Sales,
  ui_text: [{text: "hello", impact: 1}],
  duration: 1,
  keywords: ["baguette"],
  date: new Date(),
  tts_text: "end",
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
  id: "004",
  topic: Topic.Sales,
  impact: -0.5,
  ui_text: [{text: "hello", impact: 1}],
  duration: 1,
  keywords: ["french"],
  date: new Date(),
  tts_text: "end",
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
}];*/

