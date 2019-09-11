import { FileListModule } from './file-list.module';

describe('FileListModule', () => {
  let fileListModule: FileListModule;

  beforeEach(() => {
    fileListModule = new FileListModule();
  });

  it('should create an instance', () => {
    expect(fileListModule).toBeTruthy();
  });
});
