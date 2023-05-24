import { Component, Input, OnInit } from '@angular/core';
import { SharedService } from '../_services/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  // @Input() showComponent!: boolean;

  constructor(public sharedService: SharedService) {}

  ngOnInit(): void {
    this.sharedService.fromHomeComponent = true;
    this.sharedService.fromGiveComponent = false;
  }
}
