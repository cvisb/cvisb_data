import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MiniDonutComponent } from './mini-donut.component';

describe('MiniDonutComponent', () => {
  let component: MiniDonutComponent;
  let fixture: ComponentFixture<MiniDonutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MiniDonutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiniDonutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
