import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  showLoginComponent = false;
  showRegisterComponent = false;
  cretaAccount: boolean = false;
  toDelete: boolean = false;
  showUGiveComonent: boolean = false;
  currentFormType: string = 'Gardening';

  commentHasBeenEdited: boolean = false;

  private editEventSubject = new Subject<void>();
  editEvent$ = this.editEventSubject.asObservable();

  triggerEditEvent() {
    this.editEventSubject.next();
  }
}
