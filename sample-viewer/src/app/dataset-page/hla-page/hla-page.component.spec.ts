import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HlaPageComponent } from './hla-page.component';

describe('HlaPageComponent', () => {
  let component: HlaPageComponent;
  let fixture: ComponentFixture<HlaPageComponent>;

  beforeEach(async(() => {
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
