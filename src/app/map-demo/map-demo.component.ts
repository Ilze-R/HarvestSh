import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';

@Component({
  selector: 'app-map-demo',
  templateUrl: './map-demo.component.html',
  styleUrls: ['./map-demo.component.scss'],
})
export class MapDemoComponent {
  apiLoaded!: Observable<boolean>;

  // constructor(httpClient: HttpClient) {
  //   this.apiLoaded = httpClient
  //     .jsonp(
  //       'https://maps.googleapis.com/maps/api/js?key=AIzaSyAJhkqnB-KuU-ygCh9cz50Nen-Bm7UWspE',
  //       'callback'
  //     )
  //     .pipe(
  //       map(() => true),
  //       catchError(() => of(false))
  //     );
  // }
}
