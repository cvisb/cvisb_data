import { SampleModule } from './sample.module';

describe('SampleModule', () => {
  let sampleModule: SampleModule;

  beforeEach(() => {
    sampleModule = new SampleModule();
  });

  it('should create an instance', () => {
    expect(sampleModule).toBeTruthy();
  });
});
