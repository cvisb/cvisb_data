import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CombineDupesComponent } from './combine-dupes.component';

describe('CombineDupesComponent', () => {
  let component: CombineDupesComponent;
  let fixture: ComponentFixture<CombineDupesComponent>;

  beforeEach(waitForAsync(() => {
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
