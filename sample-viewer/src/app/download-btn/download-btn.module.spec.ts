import { DownloadBtnModule } from './download-btn.module';

describe('DownloadBtnModule', () => {
  let downloadBtnModule: DownloadBtnModule;

  beforeEach(() => {
    downloadBtnModule = new DownloadBtnModule();
  });

  it('should create an instance', () => {
    expect(downloadBtnModule).toBeTruthy();
  });
});
