import { CountryObjectPipe } from './country-object.pipe';

describe('CountryObjectPipe', () => {
  it('create an instance', () => {
    const pipe = new CountryObjectPipe();
    expect(pipe).toBeTruthy();
  });
});
