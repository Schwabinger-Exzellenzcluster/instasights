import { Component, OnInit } from '@angular/core';
import { Story, StoryItem, UiText } from '../services/story/story.model';
import { UnsplashService } from '../services/unsplash/unsplash.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public funkyColors = ["#1770ff", "#17ff9e", "#ff2e17", "#6817ff"];

  public getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  public profile1 = {
    name: "HR",
    imageUrl: ""
  }

  public profile2 = {
    name: "Sales",
    imageUrl: ""
  }

  public profile3 = {
    name: "Accounting",
    imageUrl: ""
  }

  public story1: Story = {
    profile: this.profile1,
    items: [{
      id: "001",
      ui_text: [{text: "Sales are up", impact: 0}, {text: "20%", impact: 1}, {text: "this week", impact: 0}],
      duration: 3,
      keywords: ["tree"],
      date: new Date(),
      tts_text: "hello world!"
    }, {
      id: "002",
      ui_text: [{text: "hi", impact: 1}],
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
    }]
  }

  public story2: Story = {
    profile: this.profile2,
    items: [{
      id: "004",
      ui_text: [{text: "Sales are up", impact: 0}, {text: "20%", impact: 1}, {text: "this week", impact: 0}],
      duration: 3,
      keywords: ["tree"],
      date: new Date(),
      tts_text: "hello world!"
    }, {
      id: "005",
      ui_text: [{text: "hi", impact: 1}],
      duration: 1,
      keywords: ["mountain"],
      date: new Date()
    }]
  }

  public story3: Story = {
    profile: this.profile3,
    items: [{
      id: "004",
      ui_text: [{text: "Sales are up", impact: 0}, {text: "20%", impact: 1}, {text: "this week", impact: 0}],
      duration: 3,
      keywords: ["tree"],
      date: new Date(),
      tts_text: "hello world!"
    }, {
      id: "005",
      ui_text: [{text: "hi", impact: 1}],
      duration: 1,
      keywords: ["mountain"],
      date: new Date()
    }]
  }

  public stories: Story[] = [
    this.story1,
    this.story2,
    this.story3
  ];

  constructor(public unsplash: UnsplashService) { }

  ngOnInit(): void {
  }

  public toOneString(ui_texts: UiText[]): string {
    return ui_texts.flatMap(e => e.text).join(' ')
  }

}
