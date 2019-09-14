import { UploadPatientsModule } from './upload-patients.module';

describe('UploadPatientsModule', () => {
  let uploadPatientsModule: UploadPatientsModule;

  beforeEach(() => {
    uploadPatientsModule = new UploadPatientsModule();
  });

  it('should create an instance', () => {
    expect(uploadPatientsModule).toBeTruthy();
  });
});
