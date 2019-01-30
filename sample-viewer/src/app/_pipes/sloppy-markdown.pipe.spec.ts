import { SloppyMarkdownPipe } from './sloppy-markdown.pipe';

describe('SloppyMarkdownPipe', () => {
  it('create an instance', () => {
    const pipe = new SloppyMarkdownPipe();
    expect(pipe).toBeTruthy();
  });
});
