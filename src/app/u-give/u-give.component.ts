import { Component, OnInit } from '@angular/core';
import {
  Observable,
  BehaviorSubject,
  catchError,
  map,
  of,
  startWith,
} from 'rxjs';
import { DataState } from '../_enum/datastate.enum';
import { CustomHttpResponse, Profile } from '../_interface/appstates';
import { State } from '../_interface/state';
import { Give } from '../_interface/give';
import { UserService } from '../_service/user.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { GiveService } from '../_service/give.service';
import { SharedService } from '../_service/shared.service';

@Component({
  selector: 'app-u-give',
  templateUrl: './u-give.component.html',
  styleUrls: ['./u-give.component.scss'],
})
export class UGiveComponent implements OnInit {
  newGiveState$: Observable<State<CustomHttpResponse<Profile & Give>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Profile & Give>>(
    null
  );
  profileState$: Observable<State<CustomHttpResponse<Profile>>>;
  private dataProfileSubject = new BehaviorSubject<CustomHttpResponse<Profile>>(
    null
  );
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  readonly DataState = DataState;
  buttonValue: string = 'kg';
  msg: string = '';
  image_url: any;
  selectedImage: File;

  constructor(
    private userService: UserService,
    private giveService: GiveService,
    private sharedService: SharedService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.newGiveState$ = this.giveService.newGive$().pipe(
      map((response) => {
        console.log(response + 'rsponse from giveeeee');
        this.dataSubject.next(response);
        return { dataState: DataState.LOADED, appData: response };
      }),
      startWith({ dataState: DataState.LOADING }),
      catchError((error: string) => {
        return of({ dataState: DataState.ERROR, error });
      })
    );
    this.profileState$ = this.userService.profile$().pipe(
      map((response) => {
        console.log(response);
        this.dataProfileSubject.next(response);
        return { dataState: DataState.LOADED, appData: response };
      }),
      startWith({ dataState: DataState.LOADING }),
      catchError((error: string) => {
        return of({ dataState: DataState.ERROR, error });
      })
    );
  }

  newGive(newGiveForm: NgForm): void {
    this.dataSubject.next({ ...this.dataSubject.value, message: null });
    this.isLoadingSubject.next(true);
    const formData = new FormData();
    formData.append('image', this.selectedImage);
    formData.append('type', newGiveForm.value.type);
    formData.append('amount', newGiveForm.value.amount);
    formData.append('description', newGiveForm.value.description);
    formData.append('status', 'available');
    formData.append('amountType', this.buttonValue);
    formData.append('location', 'riga');
    formData.append('img_url', this.image_url);
    this.newGiveState$ = this.giveService
      .createGive$(this.dataSubject.value.data.user.id, formData)
      .pipe(
        map((response) => {
          console.log(response);
          newGiveForm.reset({ status: 'PENDING' });
          this.isLoadingSubject.next(false);
          this.dataSubject.next(response);
          console.log(this.dataSubject.value);
          this.router.navigate(['/give']);
          console.log(this.dataSubject.value);
          return {
            dataState: DataState.LOADED,
            appData: this.dataSubject.value,
          };
        }),
        startWith({
          dataState: DataState.LOADED,
          appData: this.dataSubject.value,
        }),
        catchError((error: string) => {
          this.isLoadingSubject.next(false);
          console.log(this.dataSubject.value);
          return of({ dataState: DataState.LOADED, error });
        })
      );
  }

  selectFile(event: any) {
    if (!event.target.files[0] || event.target.files[0].length == 0) {
      this.msg = 'You must select an image';
      return;
    }

    var mimeType = event.target.files[0].type;

    if (mimeType.match(/image\/*/) == null) {
      this.msg = 'Only images are supported';
      return;
    }

    const selectedFile = event.target.files[0];
    const maxSizeInBytes = 2000 * 1024 * 1024; // 2GB in bytes

    if (selectedFile.size > maxSizeInBytes) {
      this.msg = 'File size exceeds the allowed limit (2GB)';
      return;
    }

    this.selectedImage = event.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    reader.onload = (_event) => {
      this.msg = '';
      this.image_url = reader.result;
    };
  }

  setButton(value: string) {
    this.buttonValue = value;
  }
}
