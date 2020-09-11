import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlignedSequencesFiltersComponent } from './aligned-sequences-filters.component';

describe('AlignedSequencesFiltersComponent', () => {
  let component: AlignedSequencesFiltersComponent;
  let fixture: ComponentFixture<AlignedSequencesFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlignedSequencesFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlignedSequencesFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
