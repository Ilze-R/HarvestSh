import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { State } from 'src/app/_interface/state';
import {
  Observable,
  BehaviorSubject,
  catchError,
  map,
  of,
  startWith,
} from 'rxjs';
import { CustomHttpResponse, Profile } from 'src/app/_interface/appstates';
import { Give } from 'src/app/_interface/give';
import { SharedService } from 'src/app/_service/shared.service';
import { DataState } from 'src/app/_enum/datastate.enum';
import { UserService } from 'src/app/_service/user.service';
import { GiveService } from 'src/app/_service/give.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeleteWarnComponent } from 'src/app/warnings/delete-warn/delete-warn.component';

@Component({
  selector: 'app-give',
  templateUrl: './give.component.html',
  styleUrls: ['./give.component.scss'],
})
export class GiveComponent implements OnInit {
  profileState$: Observable<State<CustomHttpResponse<Profile>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Profile>>(null);
  givesState$: Observable<
    State<CustomHttpResponse<{ user: Profile; give: Give[] }>>
  >;
  private dataGiveSubject = new BehaviorSubject<
    CustomHttpResponse<{ user: Profile; give: Give[] }>
  >(null);
  readonly DataState = DataState;
  dialogRef: MatDialogRef<DeleteWarnComponent>;

  constructor(
    private userService: UserService,
    public sharedService: SharedService,
    private giveService: GiveService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.sharedService.showUGiveComonent = true;
  }

  private loadData(): void {
    this.profileState$ = this.userService.profile$().pipe(
      map((response) => {
        console.log(response);
        this.dataSubject.next(response);
        return { dataState: DataState.LOADED, appData: response };
      }),
      startWith({ dataState: DataState.LOADING }),
      catchError((error: string) => {
        return of({ dataState: DataState.ERROR, error });
      })
    );

    this.givesState$ = this.giveService.gives$().pipe(
      map((response) => {
        const givesList: Give[] = response.data.give;
        const modifiedResponse = {
          ...response,
          data: { user: response.data.user, give: givesList },
        };
        this.dataGiveSubject.next(modifiedResponse);
        return { dataState: DataState.LOADED, appData: modifiedResponse };
      }),
      startWith({ dataState: DataState.LOADING }),
      catchError((error: string) => {
        return of({ dataState: DataState.ERROR, error });
      })
    );
  }

  deleteItem(id: number): void {
    this.dialogRef = this.dialog.open(DeleteWarnComponent, {
      disableClose: false,
    });
    this.dialogRef.componentInstance.confirmMessage =
      'Are you sure you want to delete?';
    this.dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // do confirmation actions
        this.giveService.delete$(id).subscribe({
          next: (response) => {
            console.log('Item deleted successfully', response);
            this.loadData();
          },
          error: (error) => {
            console.error('Error deleting item', error);
          },
        });
      }
      this.dialogRef = null;
    });
  }

  selectGive(id: number): void {
    this.router.navigate(['/give', id]);
  }

  newGiveForm(): void {
    this.router.navigate(['/gives']);
    this.sharedService.showUGiveComonent = true;
  }
}
