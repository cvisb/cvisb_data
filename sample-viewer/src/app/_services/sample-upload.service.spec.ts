import { TestBed } from '@angular/core/testing';

import { SampleUploadService } from './sample-upload.service';

describe('SampleUploadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SampleUploadService = TestBed.get(SampleUploadService);
    expect(service).toBeTruthy();
  });
});
