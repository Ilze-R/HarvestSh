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

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.newGiveState$ = this.userService.newGive$().pipe(
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

  newGive(newGiveForm: NgForm, image: File): void {
    this.dataSubject.next({ ...this.dataSubject.value, message: null });
    this.isLoadingSubject.next(true);
    newGiveForm.value.status = 'available';
    newGiveForm.value.amountType = this.buttonValue;
    newGiveForm.value.location = 'daugavpils';
    newGiveForm.value.img_url = this.image_url;
    const formData = new FormData();
    formData.append('image', image);
    this.newGiveState$ = this.userService
      .createGive$(this.dataSubject.value.data.user.id, newGiveForm.value)
      .pipe(
        map((response) => {
          console.log(response);
          newGiveForm.reset({ status: 'PENDING' });
          this.isLoadingSubject.next(false);
          this.dataSubject.next(response);
          console.log(this.dataSubject.value);
          this.router.navigate(['/dashboard']);
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

  // newGive(newGiveForm: NgForm): void {
  //   this.dataSubject.next({ ...this.dataSubject.value, message: null });
  //   this.isLoadingSubject.next(true);
  //   newGiveForm.value.status = 'available';
  //   newGiveForm.value.amountType = this.buttonValue;
  //   const imageInput = newGiveForm.value.image;
  //   if (this.selectedImage) {
  //     this.newGiveState$ = this.userService
  //       .createGive$(
  //         this.dataSubject.value.data.user.id,
  //         newGiveForm.value,
  //         this.selectedImage
  //       )
  //       .pipe(
  //         map((response) => {
  //           console.log(response);
  //           newGiveForm.reset({ status: 'PENDING' });
  //           this.isLoadingSubject.next(false);
  //           this.dataSubject.next(response);
  //           console.log(this.dataSubject.value);
  //           this.router.navigate(['/dashboard']);
  //           console.log(this.dataSubject.value);
  //           return {
  //             dataState: DataState.LOADED,
  //             appData: this.dataSubject.value,
  //           };
  //         }),
  //         startWith({
  //           dataState: DataState.LOADED,
  //           appData: this.dataSubject.value,
  //         }),
  //         catchError((error: string) => {
  //           this.isLoadingSubject.next(false);
  //           console.log(this.dataSubject.value);
  //           return of({ dataState: DataState.LOADED, error });
  //         })
  //       );
  //   } else {
  //     console.log('No image selected');
  //   }
  // }

  // handleImageChange(event: any): void {
  //   const files = event.target.files;
  //   if (files && files.length > 0) {
  //     this.selectedImage = files[0]; // Store the selected image
  //   } else {
  //     this.selectedImage = null; // Reset the selected image if none is chosen
  //   }
  // }
  // private getFormData(image: File): FormData {
  //   const formData = new FormData();
  //   formData.append('image', image);
  //   return formData;
  // }

  selectFile(event: any) {
    //Angular 11, for stricter type
    if (!event.target.files[0] || event.target.files[0].length == 0) {
      this.msg = 'You must select an image';
      return;
    }

    var mimeType = event.target.files[0].type;

    if (mimeType.match(/image\/*/) == null) {
      this.msg = 'Only images are supported';
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    reader.onload = (_event) => {
      this.msg = '';
      this.image_url = reader.result;
    };
  }

  // onImageSelected(file: File): FormData {
  //   console.log('Image selected:', file);
  //   const formData = new FormData();
  //   formData.append('image', file);
  //   return formData;
  // }

  setButton(value: string) {
    this.buttonValue = value;
  }
}