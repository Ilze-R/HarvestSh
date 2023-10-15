import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/_service/shared.service';
import { UserService } from 'src/app/_service/user.service';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss'],
})
export class CommentFormComponent implements OnInit {
  @Input() commentText: string;
  @Input() commentId: number;
  @Input() fromGarden: boolean;
  @Input() fromImade: boolean;
  @Input() fromOther: boolean;
  @Input() fromRecipes: boolean;
  editedCommentText: string;

  constructor(
    private userService: UserService,
    public sharedService: SharedService,
    private router: Router
  ) {
    this.editedCommentText = this.commentText;
  }

  ngOnInit(): void {}

  editComment(editForm: NgForm): void {
    let editFunction;

    if (this.fromGarden) {
      editFunction = this.userService.editGardeningComent$;
    } else if (this.fromImade) {
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
      comment_text: editForm.value.comment_text,
    }).subscribe({
      next: (response) => {
        this.sharedService.triggerEditEvent();
        console.log('Comment edited successfully', response);
      },
      error: (error) => {
        console.error('Error editing comment', error);
      },
    });
  }

  // removeAutofocus(): void {
  //   const textarea = document.getElementById(
  //     'comment_text'
  //   ) as HTMLTextAreaElement;
  //   if (textarea) {
  //     textarea.removeAttribute('autofocus');
  //   }
  // }
}
