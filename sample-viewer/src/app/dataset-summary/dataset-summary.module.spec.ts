import { DatasetSummaryModule } from './dataset-summary.module';

describe('DatasetSummaryModule', () => {
  let datasetSummaryModule: DatasetSummaryModule;

  beforeEach(() => {
    datasetSummaryModule = new DatasetSummaryModule();
  });

  it('should create an instance', () => {
    expect(datasetSummaryModule).toBeTruthy();
  });
});
