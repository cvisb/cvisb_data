import { UploadDataModule } from './upload-data.module';

describe('UploadDataModule', () => {
  let uploadDataModule: UploadDataModule;

  beforeEach(() => {
    uploadDataModule = new UploadDataModule();
  });

  it('should create an instance', () => {
    expect(uploadDataModule).toBeTruthy();
  });
});
