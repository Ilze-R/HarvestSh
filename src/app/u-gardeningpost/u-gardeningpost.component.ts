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
import { Router } from '@angular/router';
import { UserService } from '../_service/user.service';
import { GardeningPost } from '../_interface/gardeningost';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-u-gardeningpost',
  templateUrl: './u-gardeningpost.component.html',
  styleUrls: ['./u-gardeningpost.component.scss'],
})
export class UGardeningpostComponent implements OnInit {
  newGardeningPostState$: Observable<
    State<CustomHttpResponse<Profile & GardeningPost>>
  >;
  private dataSubject = new BehaviorSubject<
    CustomHttpResponse<Profile & GardeningPost>
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

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.newGardeningPostState$ = this.userService.newGardeningPost$().pipe(
      map((response) => {
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

  newGardeningPost(newGardeningForm: NgForm): void {
    this.dataSubject.next({ ...this.dataSubject.value, message: null });
    this.isLoadingSubject.next(true);
    const formData = new FormData();
    formData.append('image', this.selectedImage);
    formData.append('title', newGardeningForm.value.title);
    formData.append('img_url', this.image_url);
    formData.append('description', newGardeningForm.value.description);
    this.newGardeningPostState$ = this.userService
      .createGardeningPost$(this.dataSubject.value.data.user.id, formData)
      .pipe(
        map((response) => {
          this.isLoadingSubject.next(false);
          this.dataSubject.next(response);
          this.router.navigate(['/dashboard']);
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
