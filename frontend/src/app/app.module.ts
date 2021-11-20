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

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    StoryViewerComponent,
    BubbleComponent,
    StoryItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    IonicModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
