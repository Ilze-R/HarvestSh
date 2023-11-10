import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  showLoginComponent = false;
  showRegisterComponent = false;
  cretaAccount: boolean = false;
  toDelete: boolean = false;
  showUGiveComonent: boolean = false;
  commentHasBeenEdited: boolean = false;
  forumNavigation: string = 'Gardening';

  private editEventSubject = new Subject<void>();
  editEvent$ = this.editEventSubject.asObservable();

  triggerEditEvent() {
    this.editEventSubject.next();
  }

  setActiveTab(tab: string): void {
    this.forumNavigation = tab;
  }
}
