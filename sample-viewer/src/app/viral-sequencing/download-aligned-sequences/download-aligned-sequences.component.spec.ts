import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadAlignedSequencesComponent } from './download-aligned-sequences.component';

describe('DownloadAlignedSequencesComponent', () => {
  let component: DownloadAlignedSequencesComponent;
  let fixture: ComponentFixture<DownloadAlignedSequencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadAlignedSequencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadAlignedSequencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
