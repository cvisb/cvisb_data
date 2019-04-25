import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewSamplesComponent } from './preview-samples.component';

describe('PreviewSamplesComponent', () => {
  let component: PreviewSamplesComponent;
  let fixture: ComponentFixture<PreviewSamplesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewSamplesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewSamplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
