import { TestBed } from '@angular/core/testing';

import { FilterTimepointsService } from './filter-timepoints.service';

describe('FilterTimepointsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FilterTimepointsService = TestBed.get(FilterTimepointsService);
    expect(service).toBeTruthy();
  });
});
