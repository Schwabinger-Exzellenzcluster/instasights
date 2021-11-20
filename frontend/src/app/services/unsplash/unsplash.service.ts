import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class UnsplashService {

  constructor(private http: HttpClient) { }

  /**
   * Example Usage: <img [src]="unsplash.getImageUrl(['business'])">
   */
  public getImageUrl(keywords: string[]): string {
    return `https://source.unsplash.com/featured/?${keywords.join(",")}`;
  }
}