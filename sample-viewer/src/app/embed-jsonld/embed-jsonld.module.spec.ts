import { EmbedJsonldModule } from './embed-jsonld.module';

describe('EmbedJsonldModule', () => {
  let embedJsonldModule: EmbedJsonldModule;

  beforeEach(() => {
    embedJsonldModule = new EmbedJsonldModule();
  });

  it('should create an instance', () => {
    expect(embedJsonldModule).toBeTruthy();
  });
});
