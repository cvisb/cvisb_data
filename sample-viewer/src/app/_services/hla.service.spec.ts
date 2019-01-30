import { TestBed } from '@angular/core/testing';

import { HlaService } from './hla.service';

describe('HlaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HlaService = TestBed.get(HlaService);
    expect(service).toBeTruthy();
  });
});
