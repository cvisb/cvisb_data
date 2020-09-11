import { PiccoloModule } from './piccolo.module';

describe('PiccoloModule', () => {
  let piccoloModule: PiccoloModule;

  beforeEach(() => {
    piccoloModule = new PiccoloModule();
  });

  it('should create an instance', () => {
    expect(piccoloModule).toBeTruthy();
  });
});
