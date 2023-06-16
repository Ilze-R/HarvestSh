import { Component, Input, OnInit } from '@angular/core';
import { SharedService } from 'src/app/_services/shared.service';

@Component({
  selector: 'app-give',
  templateUrl: './give.component.html',
  styleUrls: ['./give.component.scss'],
})
export class GiveComponent implements OnInit {
  constructor(public sharedService: SharedService) {}

  ngOnInit(): void {
    this.sharedService.fromHomeComponent = false;
  }

  showRegister() {
    this.sharedService.showLoginComponent = false;
    this.sharedService.showRegisterComponent = true;
    // this.sharedService.cretaAccount = false;
    this.sharedService.fromGiveComponent = true;
    this.sharedService.fromHomeComponent = false;
  }
}
