import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sloppyMarkdown'
})
export class SloppyMarkdownPipe implements PipeTransform {

  transform(value: string): string {
    let md: string;

    // embolden
    md = value.replace(/\*(.*?)\*/g, "<b class='markdown-bold'>$1</b>")

    // change links
    md = md.replace(/\[(.*?)\]\((.*?)\)/g, `<a href=$2 target='_blank' rel='noreferrer' class='markdown-link'>$1</a>`)

    return md;
  }

// findBold(str: string): string {
//   let new_str = ;
//   return(new_str);
// }

}
