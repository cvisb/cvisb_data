import { ProvenanceModule } from './provenance.module';

describe('ProvenanceModule', () => {
  let provenanceModule: ProvenanceModule;

  beforeEach(() => {
    provenanceModule = new ProvenanceModule();
  });

  it('should create an instance', () => {
    expect(provenanceModule).toBeTruthy();
  });
});
