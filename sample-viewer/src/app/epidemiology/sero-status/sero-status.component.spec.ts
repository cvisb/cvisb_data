import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeroStatusComponent } from './sero-status.component';

describe('SeroStatusComponent', () => {
  let component: SeroStatusComponent;
  let fixture: ComponentFixture<SeroStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeroStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeroStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
