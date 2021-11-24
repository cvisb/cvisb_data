import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DownloadBtnComponent } from './download-btn.component';

describe('DownloadBtnComponent', () => {
  let component: DownloadBtnComponent;
  let fixture: ComponentFixture<DownloadBtnComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadBtnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
