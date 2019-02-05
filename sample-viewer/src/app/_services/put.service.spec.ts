import { TestBed } from '@angular/core/testing';

import { PutService } from './put.service';

describe('PutService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PutService = TestBed.get(PutService);
    expect(service).toBeTruthy();
  });
});
