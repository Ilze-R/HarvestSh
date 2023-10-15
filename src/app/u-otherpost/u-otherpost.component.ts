import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
import { OtherPost } from '../_interface/otherpost';
import { State } from '../_interface/state';
import { SharedService } from '../_service/shared.service';
import { UserService } from '../_service/user.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-u-otherpost',
  templateUrl: './u-otherpost.component.html',
  styleUrls: ['./u-otherpost.component.scss'],
})
export class UOtherpostComponent implements OnInit {
  newOtherPostState$: Observable<
    State<CustomHttpResponse<Profile & OtherPost>>
  >;
  private dataOtherSubject = new BehaviorSubject<
    CustomHttpResponse<Profile & OtherPost>
  >(null);
  profileState$: Observable<State<CustomHttpResponse<Profile>>>;
  private dataProfileSubject = new BehaviorSubject<CustomHttpResponse<Profile>>(
    null
  );
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  readonly DataState = DataState;
  msg: string = '';
  image_url: any;
  selectedImage: File;

  constructor(
    private userService: UserService,
    public sharedService: SharedService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.newOtherPostState$ = this.userService.newOtherPost$().pipe(
      map((response) => {
        this.dataOtherSubject.next(response);
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

  newOtherPost(postForm: NgForm): void {
    this.dataOtherSubject.next({
      ...this.dataOtherSubject.value,
      message: null,
    });
    this.isLoadingSubject.next(true);
    const formData = new FormData();
    formData.append('image', this.selectedImage);
    formData.append('title', postForm.value.title);
    formData.append('img_url', this.image_url);
    formData.append('description', postForm.value.description);
    this.newOtherPostState$ = this.userService
      .createOtherPost$(this.dataOtherSubject.value.data.user.id, formData)
      .pipe(
        map((response) => {
          this.isLoadingSubject.next(false);
          this.dataOtherSubject.next(response);
          this.router.navigate(['/forum/other']);
          return {
            dataState: DataState.LOADED,
            appData: this.dataOtherSubject.value,
          };
        }),
        startWith({
          dataState: DataState.LOADED,
          appData: this.dataOtherSubject.value,
        }),
        catchError((error: string) => {
          this.isLoadingSubject.next(false);
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
}
