import { TestBed } from '@angular/core/testing';

import { GetDatacatalogService } from './get-datacatalog.service';

describe('GetDatacatalogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetDatacatalogService = TestBed.get(GetDatacatalogService);
    expect(service).toBeTruthy();
  });
});
