import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProvenanceComponent } from './provenance.component';

describe('ProvenanceComponent', () => {
  let component: ProvenanceComponent;
  let fixture: ComponentFixture<ProvenanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
