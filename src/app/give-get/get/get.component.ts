import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/_service/shared.service';

@Component({
  selector: 'app-get',
  templateUrl: './get.component.html',
  styleUrls: ['./get.component.scss'],
})
export class GetComponent implements OnInit {
  constructor(public sharedService: SharedService) {}

  ngOnInit(): void {
    // this.sharedService.fromHomeComponent = false;
  }

  showRegister() {
    // this.sharedService.showRegisterComponent = true;
    // this.sharedService.fromGiveComponent = false;
    // this.sharedService.fromHomeComponent = false;
  }
}
