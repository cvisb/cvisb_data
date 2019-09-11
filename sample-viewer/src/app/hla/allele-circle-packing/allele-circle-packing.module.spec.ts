import { AlleleCirclePackingModule } from './allele-circle-packing.module';

describe('AlleleCirclePackingModule', () => {
  let alleleCirclePackingModule: AlleleCirclePackingModule;

  beforeEach(() => {
    alleleCirclePackingModule = new AlleleCirclePackingModule();
  });

  it('should create an instance', () => {
    expect(alleleCirclePackingModule).toBeTruthy();
  });
});
