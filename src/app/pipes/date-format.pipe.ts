import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat',
})
export class DateFormatPipe implements PipeTransform {
  transform(value: string): string {
    const now = new Date();
    const date = new Date(value);
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000); // 1 minute = 60,000 milliseconds
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);

    if (weeks > 0) {
      return `${weeks}w`;
    } else if (days > 0) {
      return `${days}d`;
    } else if (minutes < 60) {
      return `${minutes}m`;
    } else {
      return `${hours}h`;
    }
  }
}
