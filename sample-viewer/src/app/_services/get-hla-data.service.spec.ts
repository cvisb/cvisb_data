import { TestBed } from '@angular/core/testing';

import { GetHlaDataService } from './get-hla-data.service';

describe('GetHlaDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetHlaDataService = TestBed.get(GetHlaDataService);
    expect(service).toBeTruthy();
  });
});
