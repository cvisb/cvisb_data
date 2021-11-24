import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DownloadExptsComponent } from './download-expts.component';

describe('DownloadExptsComponent', () => {
  let component: DownloadExptsComponent;
  let fixture: ComponentFixture<DownloadExptsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadExptsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadExptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
