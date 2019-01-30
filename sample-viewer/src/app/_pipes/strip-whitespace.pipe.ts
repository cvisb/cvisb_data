import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stripWhitespace'
})
export class StripWhitespacePipe implements PipeTransform {

  transform(value: string, replacement: string = '-'): string {
    return value.replace(/\s/g, replacement);
  }

}
