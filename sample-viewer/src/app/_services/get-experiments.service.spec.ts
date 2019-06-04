import { TestBed } from '@angular/core/testing';

import { GetExperimentsService } from './get-experiments.service';

describe('GetExperimentsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetExperimentsService = TestBed.get(GetExperimentsService);
    expect(service).toBeTruthy();
  });
});
