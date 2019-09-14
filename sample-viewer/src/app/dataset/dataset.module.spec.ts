import { DatasetModule } from './dataset.module';

describe('DatasetModule', () => {
  let datasetModule: DatasetModule;

  beforeEach(() => {
    datasetModule = new DatasetModule();
  });

  it('should create an instance', () => {
    expect(datasetModule).toBeTruthy();
  });
});
