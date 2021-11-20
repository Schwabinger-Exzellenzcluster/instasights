import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UnsplashService {

  constructor(private http: HttpClient) { }

  public getImage(keywords: string[]) {
    this.http.get(`https://source.unsplash.com/featured/?${keywords.join(",")}`)
  }
}