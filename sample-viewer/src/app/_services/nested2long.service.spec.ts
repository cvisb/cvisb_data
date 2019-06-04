import { TestBed } from '@angular/core/testing';

import { Nested2longService } from './nested2long.service';

describe('Nested2longService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Nested2longService = TestBed.get(Nested2longService);
    expect(service).toBeTruthy();
  });
});
