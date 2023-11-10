import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'colorUsername',
})
export class ColorUsernamePipe implements PipeTransform {
  transform(commentText: string): string {
    if (commentText) {
      const usernameMatch = commentText.match(/^@(\S+)/);
      if (usernameMatch) {
        const username = usernameMatch[1];
        const replacedText = commentText.replace(
          `@${username}`,
          `<span class="highlighted-username">@${username}</span>`
        );
        return `<span style="color: blue;">${replacedText}</span>`;
      }
    }
    return commentText;
  }
}
