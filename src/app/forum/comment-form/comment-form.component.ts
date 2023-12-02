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
import { PostService } from 'src/app/_service/post.service';
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
    private postService: PostService,
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
      editFunction = this.postService.editGardeningComent$;
    } else if (this.fromIMade) {
      editFunction = this.postService.editIMadeComent$;
    } else if (this.fromOther) {
      editFunction = this.postService.editOtherComent$;
    } else if (this.fromRecipes) {
      editFunction = this.postService.editRecipesComent$;
    } else {
      console.error('Unknown comment source');
      return;
    }
    editFunction(this.commentId, {
      comment_text: editForm.value.comment_text.trim(),
    }).subscribe({
      next: (response) => {
        this.cdr.detectChanges();
        this.sharedService.doEdit = false;
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
