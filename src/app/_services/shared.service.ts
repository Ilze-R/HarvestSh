import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  showLoginComponent = false;
  showRegisterComponent = false;
  fromGiveComponent = false;
  fromHomeComponent = false;
  cretaAccount: boolean = false;

  constructor() {}
}
