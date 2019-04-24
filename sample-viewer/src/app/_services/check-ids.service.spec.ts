import { TestBed } from '@angular/core/testing';

import { CheckIdsService } from './check-ids.service';

describe('CheckIdsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CheckIdsService = TestBed.get(CheckIdsService);
    expect(service).toBeTruthy();
  });
});
