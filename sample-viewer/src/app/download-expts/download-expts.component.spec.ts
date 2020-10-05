import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadExptsComponent } from './download-expts.component';

describe('DownloadExptsComponent', () => {
  let component: DownloadExptsComponent;
  let fixture: ComponentFixture<DownloadExptsComponent>;

  beforeEach(async(() => {
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
