import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewDifferencesComponent } from './preview-differences.component';

describe('PreviewDifferencesComponent', () => {
  let component: PreviewDifferencesComponent;
  let fixture: ComponentFixture<PreviewDifferencesComponent>;

  beforeEach(async(() => {
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
