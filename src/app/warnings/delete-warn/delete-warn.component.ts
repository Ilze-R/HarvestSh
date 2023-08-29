import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-warn',
  templateUrl: './delete-warn.component.html',
  styleUrls: ['./delete-warn.component.scss'],
})
export class DeleteWarnComponent {
  constructor(public dialogRef: MatDialogRef<DeleteWarnComponent>) {}

  public confirmMessage: string;
}
