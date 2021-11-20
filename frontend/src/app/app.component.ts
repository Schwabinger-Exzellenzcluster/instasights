import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('wrapper') wrapper: ElementRef;

  title = 'frontend';

  public ngAfterViewInit(): void {
    let height = this.wrapper.nativeElement.offsetHeight;
    this.wrapper.nativeElement.style.maxWidth = height * 16/9 + "px";
  }
}
