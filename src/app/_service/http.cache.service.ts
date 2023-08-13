import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HttpCacheService {
  // the key is an array because i store multiple keys with their Response
  private httpResponseCache: { [key: string]: HttpResponse<any> } = {};

  put = (key: string, httpResponse: HttpResponse<any>): void => {
    this.httpResponseCache[key] = httpResponse;
  };

  get = (key: string): HttpResponse<any> | null | undefined =>
    this.httpResponseCache[key];

  // evict = (key: string): boolean => (this.httpResponseCache[key] = null);
  evict = (key: string): boolean => delete this.httpResponseCache[key];

  evictAll = (): void => {
    console.log('Clearing entire cache');
    this.httpResponseCache = {};
  };

  logCache = (): void => console.log(this.httpResponseCache);
}
