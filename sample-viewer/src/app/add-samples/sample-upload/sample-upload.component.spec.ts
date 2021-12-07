import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SampleUploadComponent } from './sample-upload.component';

describe('SampleUploadComponent', () => {
  let component: SampleUploadComponent;
  let fixture: ComponentFixture<SampleUploadComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SampleUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
