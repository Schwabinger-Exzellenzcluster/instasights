import { Component, OnInit } from '@angular/core';
import { UnsplashService } from '../services/unsplash/unsplash.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public unsplash: UnsplashService) { }

  ngOnInit(): void {
  }

}
