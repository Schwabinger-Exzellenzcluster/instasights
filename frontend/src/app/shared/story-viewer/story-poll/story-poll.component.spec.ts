import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryPollComponent } from './story-poll.component';

describe('StoryPollComponent', () => {
  let component: StoryPollComponent;
  let fixture: ComponentFixture<StoryPollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoryPollComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoryPollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
