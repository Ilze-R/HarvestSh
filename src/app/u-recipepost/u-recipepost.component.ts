import { Component, OnInit } from '@angular/core';
import {
  Observable,
  BehaviorSubject,
  catchError,
  map,
  of,
  startWith,
} from 'rxjs';
import { CustomHttpResponse, Profile } from '../_interface/appstates';
import { RecipePost } from '../_interface/recipepost';
import { State } from '../_interface/state';
import { Router } from '@angular/router';
import { SharedService } from '../_service/shared.service';
import { UserService } from '../_service/user.service';
import { DataState } from '../_enum/datastate.enum';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-u-recipepost',
  templateUrl: './u-recipepost.component.html',
  styleUrls: ['./u-recipepost.component.scss'],
})
export class URecipepostComponent implements OnInit {
  newRecipePostState$: Observable<
    State<CustomHttpResponse<Profile & RecipePost>>
  >;
  private dataRecipeSubject = new BehaviorSubject<
    CustomHttpResponse<Profile & RecipePost>
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
    this.newRecipePostState$ = this.userService.newRecipePost$().pipe(
      map((response) => {
        this.dataRecipeSubject.next(response);
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

  newRecipePost(postForm: NgForm): void {
    this.dataRecipeSubject.next({
      ...this.dataRecipeSubject.value,
      message: null,
    });
    this.isLoadingSubject.next(true);
    const formData = new FormData();
    formData.append('image', this.selectedImage);
    formData.append('title', postForm.value.title);
    formData.append('img_url', this.image_url);
    formData.append('description', postForm.value.description);
    this.newRecipePostState$ = this.userService
      .createRecipePost$(this.dataRecipeSubject.value.data.user.id, formData)
      .pipe(
        map((response) => {
          this.isLoadingSubject.next(false);
          this.dataRecipeSubject.next(response);
          this.router.navigate(['/forum/recipes']);
          return {
            dataState: DataState.LOADED,
            appData: this.dataRecipeSubject.value,
          };
        }),
        startWith({
          dataState: DataState.LOADED,
          appData: this.dataRecipeSubject.value,
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
