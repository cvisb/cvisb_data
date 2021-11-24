import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PreviewDifferencesComponent } from './preview-differences.component';

describe('PreviewDifferencesComponent', () => {
  let component: PreviewDifferencesComponent;
  let fixture: ComponentFixture<PreviewDifferencesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewDifferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewDifferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
