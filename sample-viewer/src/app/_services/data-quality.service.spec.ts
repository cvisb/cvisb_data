import { TestBed } from '@angular/core/testing';

import { DataQualityService } from './data-quality.service';

describe('DataQualityService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataQualityService = TestBed.get(DataQualityService);
    expect(service).toBeTruthy();
  });
});
