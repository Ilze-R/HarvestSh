import { Component } from '@angular/core';
import { SharedService } from '../_service/shared.service';

@Component({
  selector: 'app-forum-nav',
  templateUrl: './forum-nav.component.html',
  styleUrls: ['./forum-nav.component.scss'],
})
export class ForumNavComponent {
  constructor(public sharedService: SharedService) {}

  setActiveTab(tab: string): void {
    this.sharedService.setActiveTab(tab);
  }
}
