import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuratedAlignmentsComponent } from './curated-alignments.component';

describe('CuratedAlignmentsComponent', () => {
  let component: CuratedAlignmentsComponent;
  let fixture: ComponentFixture<CuratedAlignmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuratedAlignmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuratedAlignmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
