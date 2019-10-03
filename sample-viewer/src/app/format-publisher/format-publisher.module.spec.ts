import { FormatPublisherModule } from './format-publisher.module';

describe('FormatPublisherModule', () => {
  let formatPublisherModule: FormatPublisherModule;

  beforeEach(() => {
    formatPublisherModule = new FormatPublisherModule();
  });

  it('should create an instance', () => {
    expect(formatPublisherModule).toBeTruthy();
  });
});
