import { DotPlotModule } from './dot-plot.module';

describe('DotPlotModule', () => {
  let dotPlotModule: DotPlotModule;

  beforeEach(() => {
    dotPlotModule = new DotPlotModule();
  });

  it('should create an instance', () => {
    expect(dotPlotModule).toBeTruthy();
  });
});
