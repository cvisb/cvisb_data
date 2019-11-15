import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SerologyComponent } from './serology.component';

describe('SerologyComponent', () => {
  let component: SerologyComponent;
  let fixture: ComponentFixture<SerologyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SerologyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SerologyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
