import { Component, OnInit } from '@angular/core';
import {
  Observable,
  BehaviorSubject,
  startWith,
  catchError,
  map,
  of,
} from 'rxjs';
import { CustomHttpResponse, Profile } from '../_interface/appstates';
import { IMadePost } from '../_interface/imadepost';
import { State } from '../_interface/state';
import { DataState } from '../_enum/datastate.enum';
import { Router } from '@angular/router';
import { SharedService } from '../_service/shared.service';
import { UserService } from '../_service/user.service';
import { NgForm } from '@angular/forms';
import { PostService } from '../_service/post.service';

@Component({
  selector: 'app-u-imadepost',
  templateUrl: './u-imadepost.component.html',
  styleUrls: ['./u-imadepost.component.scss'],
})
export class UImadepostComponent implements OnInit {
  newIMadePostState$: Observable<
    State<CustomHttpResponse<Profile & IMadePost>>
  >;
  private dataIMadeSubject = new BehaviorSubject<
    CustomHttpResponse<Profile & IMadePost>
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
    public postService: PostService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.newIMadePostState$ = this.postService.newPost$<IMadePost>().pipe(
      map((response) => {
        this.dataIMadeSubject.next(response);
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

  newIMadePost(postForm: NgForm): void {
    this.dataIMadeSubject.next({
      ...this.dataIMadeSubject.value,
      message: null,
    });
    this.isLoadingSubject.next(true);
    const formData = new FormData();
    formData.append('image', this.selectedImage);
    formData.append('title', postForm.value.title);
    formData.append('img_url', this.image_url);
    formData.append('description', postForm.value.description);
    this.newIMadePostState$ = this.postService
      .createPost$<IMadePost>(
        this.dataIMadeSubject.value.data.user.id,
        formData,
        'addimadepost/image'
      )
      .pipe(
        map((response) => {
          this.isLoadingSubject.next(false);
          this.dataIMadeSubject.next(response);
          this.router.navigate(['/account']);
          return {
            dataState: DataState.LOADED,
            appData: this.dataIMadeSubject.value,
          };
        }),
        startWith({
          dataState: DataState.LOADED,
          appData: this.dataIMadeSubject.value,
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
