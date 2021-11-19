import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { StoryViewerComponent } from './shared/story-viewer/story-viewer.component';

const routes: Routes = [{
  path: '',
  component: HomeComponent
}, {
  path: 'stories',
  component: StoryViewerComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
