import { TestBed } from '@angular/core/testing';

import { RequestParametersService } from './request-parameters.service';

describe('RequestParametersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RequestParametersService = TestBed.get(RequestParametersService);
    expect(service).toBeTruthy();
  });
});
