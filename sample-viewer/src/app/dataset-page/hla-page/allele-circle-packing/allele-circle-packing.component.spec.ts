import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlleleCirclePackingComponent } from './allele-circle-packing.component';

describe('AlleleCirclePackingComponent', () => {
  let component: AlleleCirclePackingComponent;
  let fixture: ComponentFixture<AlleleCirclePackingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlleleCirclePackingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlleleCirclePackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
