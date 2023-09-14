import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shorten',
})
export class ShortenTextComponent implements PipeTransform {
  transform(val: string, length: number): string {
    return val.length > length ? `${val.substring(0, length)} ...` : val;
  }
}
