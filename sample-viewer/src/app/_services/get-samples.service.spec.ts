import { TestBed } from '@angular/core/testing';

import { GetSamplesService } from './get-samples.service';

describe('GetSamplesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetSamplesService = TestBed.get(GetSamplesService);
    expect(service).toBeTruthy();
  });
});
