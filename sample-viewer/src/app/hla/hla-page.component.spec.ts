import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HlaPageComponent } from './hla-page.component';

describe('HlaPageComponent', () => {
  let component: HlaPageComponent;
  let fixture: ComponentFixture<HlaPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HlaPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HlaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
