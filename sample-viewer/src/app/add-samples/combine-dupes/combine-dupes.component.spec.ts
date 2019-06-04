import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CombineDupesComponent } from './combine-dupes.component';

describe('CombineDupesComponent', () => {
  let component: CombineDupesComponent;
  let fixture: ComponentFixture<CombineDupesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CombineDupesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CombineDupesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
