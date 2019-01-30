import { StripWhitespacePipe } from './strip-whitespace.pipe';

describe('StripWhitespacePipe', () => {
  it('create an instance', () => {
    const pipe = new StripWhitespacePipe();
    expect(pipe).toBeTruthy();
  });
});
