import { TestBed } from '@angular/core/testing';

import { GetPatientsService } from './get-patients.service';

describe('GetPatientsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetPatientsService = TestBed.get(GetPatientsService);
    expect(service).toBeTruthy();
  });
});
