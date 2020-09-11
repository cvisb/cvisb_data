import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EpiTimeComponent } from './epi-time.component';

describe('EpiTimeComponent', () => {
  let component: EpiTimeComponent;
  let fixture: ComponentFixture<EpiTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EpiTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpiTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
