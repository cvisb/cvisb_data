import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeeswarmComponent } from './beeswarm.component';

describe('BeeswarmComponent', () => {
  let component: BeeswarmComponent;
  let fixture: ComponentFixture<BeeswarmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeeswarmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeeswarmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
