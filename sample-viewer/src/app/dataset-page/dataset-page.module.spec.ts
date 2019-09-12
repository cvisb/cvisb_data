import { DatasetPageModule } from './dataset-page.module';

describe('DatasetPageModule', () => {
  let datasetPageModule: DatasetPageModule;

  beforeEach(() => {
    datasetPageModule = new DatasetPageModule();
  });

  it('should create an instance', () => {
    expect(datasetPageModule).toBeTruthy();
  });
});
