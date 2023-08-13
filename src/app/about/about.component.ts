import { Component } from '@angular/core';
import { SharedService } from '../_service/shared.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  constructor( public sharedService: SharedService){

  }

}
