import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MiniBarplotComponent } from './mini-barplot.component';

describe('MiniBarplotComponent', () => {
  let component: MiniBarplotComponent;
  let fixture: ComponentFixture<MiniBarplotComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MiniBarplotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiniBarplotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
