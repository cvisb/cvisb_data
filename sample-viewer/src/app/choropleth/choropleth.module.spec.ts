import { ChoroplethModule } from './choropleth.module';

describe('ChoroplethModule', () => {
  let choroplethModule: ChoroplethModule;

  beforeEach(() => {
    choroplethModule = new ChoroplethModule();
  });

  it('should create an instance', () => {
    expect(choroplethModule).toBeTruthy();
  });
});
