import { HlaModule } from './hla.module';

describe('HlaModule', () => {
  let hlaModule: HlaModule;

  beforeEach(() => {
    hlaModule = new HlaModule();
  });

  it('should create an instance', () => {
    expect(hlaModule).toBeTruthy();
  });
});
