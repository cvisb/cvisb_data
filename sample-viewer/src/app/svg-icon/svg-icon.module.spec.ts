import { SvgIconModule } from './svg-icon.module';

describe('SvgIconModule', () => {
  let svgIconModule: SvgIconModule;

  beforeEach(() => {
    svgIconModule = new SvgIconModule();
  });

  it('should create an instance', () => {
    expect(svgIconModule).toBeTruthy();
  });
});
