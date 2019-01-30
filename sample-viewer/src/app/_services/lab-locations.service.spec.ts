import { TestBed } from '@angular/core/testing';

import { LabLocationsService } from './lab-locations.service';

describe('LabLocationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LabLocationsService = TestBed.get(LabLocationsService);
    expect(service).toBeTruthy();
  });
});
