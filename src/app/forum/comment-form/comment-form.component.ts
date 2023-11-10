import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/_service/shared.service';
import { UserService } from 'src/app/_service/user.service';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss'],
})
export class CommentFormComponent implements OnInit, AfterViewInit {
  @Input() commentText: string;
  @Input() commentId: number;
  @Input() fromGarden: boolean;
  @Input() fromIMade: boolean;
  @Input() fromOther: boolean;
  @Input() fromRecipes: boolean;
  @Input() editMode: boolean;
  editedCommentText: string;

  @ViewChild('commentTextarea') commentTextarea: ElementRef;

  constructor(
    private userService: UserService,
    public sharedService: SharedService,
    private cdr: ChangeDetectorRef
  ) {
    this.editedCommentText = this.commentText;
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.setCursorToEnd();
  }

  editComment(editForm: NgForm): void {
    let editFunction;

    if (this.fromGarden) {
      editFunction = this.userService.editGardeningComent$;
    } else if (this.fromIMade) {
      editFunction = this.userService.editIMadeComent$;
    } else if (this.fromOther) {
      editFunction = this.userService.editOtherComent$;
    } else if (this.fromRecipes) {
      editFunction = this.userService.editRecipesComent$;
    } else {
      console.error('Unknown comment source');
      return;
    }
    editFunction(this.commentId, {
      comment_text: editForm.value.comment_text.trim(),
    }).subscribe({
      next: (response) => {
        this.sharedService.triggerEditEvent();
        console.log('Comment edited successfully', response);
        this.editMode = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error editing comment', error);
      },
    });
  }

  setCursorToEnd() {
    const textarea = this.commentTextarea.nativeElement as HTMLTextAreaElement;
    textarea.focus();
    textarea.setSelectionRange(textarea.value.length, textarea.value.length);
  }
}
