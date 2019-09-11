import { FormatCitationModule } from './format-citation.module';

describe('FormatCitationModule', () => {
  let formatCitationModule: FormatCitationModule;

  beforeEach(() => {
    formatCitationModule = new FormatCitationModule();
  });

  it('should create an instance', () => {
    expect(formatCitationModule).toBeTruthy();
  });
});
