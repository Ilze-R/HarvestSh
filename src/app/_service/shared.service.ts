import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DataState } from '../_enum/datastate.enum';
import { LoginState } from '../_interface/appstates';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  showLoginComponent = false;
  showRegisterComponent = false;
  // fromGiveComponent = false;
  // fromHomeComponent = false;
  cretaAccount: boolean = false;
  toDelete: boolean = false;

  constructor() {}
}
