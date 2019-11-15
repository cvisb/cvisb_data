import { SerologyModule } from './serology.module';

describe('SerologyModule', () => {
  let serologyModule: SerologyModule;

  beforeEach(() => {
    serologyModule = new SerologyModule();
  });

  it('should create an instance', () => {
    expect(serologyModule).toBeTruthy();
  });
});
