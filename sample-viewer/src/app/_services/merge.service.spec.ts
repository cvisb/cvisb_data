import { TestBed } from '@angular/core/testing';

import { MergeService } from './merge.service';

describe('MergeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MergeService = TestBed.get(MergeService);
    expect(service).toBeTruthy();
  });
});
