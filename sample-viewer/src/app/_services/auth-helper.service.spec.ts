import { TestBed } from '@angular/core/testing';

import { MyHttpClient } from './auth-helper.service';

describe('MyHttpClient', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MyHttpClient = TestBed.get(MyHttpClient);
    expect(service).toBeTruthy();
  });
});
