import { TestBed } from '@angular/core/testing';

import { GetFilesService } from './get-files.service';

describe('GetFilesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetFilesService = TestBed.get(GetFilesService);
    expect(service).toBeTruthy();
  });
});
