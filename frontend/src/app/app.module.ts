import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { StoryViewerComponent } from './shared/story-viewer/story-viewer.component';
import { BubbleComponent } from './shared/bubble/bubble.component';
import { StoryItemComponent } from './shared/story-viewer/story-item/story-item.component';
import { IonicModule } from '@ionic/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryPollComponent } from './shared/story-viewer/story-poll/story-poll.component';
import { ChartsModule } from 'ng2-charts';
import { ChartComponent } from './shared/chart/chart.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    StoryViewerComponent,
    BubbleComponent,
    StoryItemComponent,
    StoryPollComponent,
    ChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ChartsModule,
    IonicModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
