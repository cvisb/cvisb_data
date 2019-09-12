import { ViralSequencingModule } from './viral-sequencing.module';

describe('ViralSequencingModule', () => {
  let viralSequencingModule: ViralSequencingModule;

  beforeEach(() => {
    viralSequencingModule = new ViralSequencingModule();
  });

  it('should create an instance', () => {
    expect(viralSequencingModule).toBeTruthy();
  });
});
