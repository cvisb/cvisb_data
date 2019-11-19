import { TestBed } from '@angular/core/testing';

import { DownloadDataService } from './download-data.service';

describe('DownloadDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DownloadDataService = TestBed.get(DownloadDataService);
    expect(service).toBeTruthy();
  });
});
