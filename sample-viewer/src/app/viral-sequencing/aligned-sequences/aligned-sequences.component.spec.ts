import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlignedSequencesComponent } from './aligned-sequences.component';

describe('AlignedSequencesComponent', () => {
  let component: AlignedSequencesComponent;
  let fixture: ComponentFixture<AlignedSequencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlignedSequencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlignedSequencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
