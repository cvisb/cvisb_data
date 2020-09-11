import { TestBed } from '@angular/core/testing';

import { GetAlignedSequencesService } from './get-aligned-sequences.service';

describe('GetAlignedSequencesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetAlignedSequencesService = TestBed.get(GetAlignedSequencesService);
    expect(service).toBeTruthy();
  });
});
