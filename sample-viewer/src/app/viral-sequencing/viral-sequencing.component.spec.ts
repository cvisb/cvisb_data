import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViralSequencingComponent } from './viral-sequencing.component';

describe('ViralSequencingComponent', () => {
  let component: ViralSequencingComponent;
  let fixture: ComponentFixture<ViralSequencingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViralSequencingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViralSequencingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
