import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PreviewAdditionsComponent } from './preview-additions.component';

describe('PreviewAdditionsComponent', () => {
  let component: PreviewAdditionsComponent;
  let fixture: ComponentFixture<PreviewAdditionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewAdditionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewAdditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
