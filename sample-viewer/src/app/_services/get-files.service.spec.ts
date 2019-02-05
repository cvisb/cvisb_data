import { TestBed } from '@angular/core/testing';

import { getDatasetsService } from './get-files.service';

describe('getDatasetsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: getDatasetsService = TestBed.get(getDatasetsService);
    expect(service).toBeTruthy();
  });
});
