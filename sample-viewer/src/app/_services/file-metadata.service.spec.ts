import { TestBed } from '@angular/core/testing';

import { FileMetadataService } from './file-metadata.service';

describe('FileMetadataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FileMetadataService = TestBed.get(FileMetadataService);
    expect(service).toBeTruthy();
  });
});
