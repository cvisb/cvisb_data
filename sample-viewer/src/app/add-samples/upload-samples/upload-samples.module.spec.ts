import { UploadSamplesModule } from './upload-samples.module';

describe('UploadSamplesModule', () => {
  let uploadSamplesModule: UploadSamplesModule;

  beforeEach(() => {
    uploadSamplesModule = new UploadSamplesModule();
  });

  it('should create an instance', () => {
    expect(uploadSamplesModule).toBeTruthy();
  });
});
