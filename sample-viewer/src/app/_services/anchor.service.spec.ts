import { TestBed } from '@angular/core/testing';

import { AnchorService } from './anchor.service';

describe('AnchorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnchorService = TestBed.get(AnchorService);
    expect(service).toBeTruthy();
  });
});
