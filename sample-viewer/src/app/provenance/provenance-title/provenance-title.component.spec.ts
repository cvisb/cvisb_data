import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvenanceTitleComponent } from './provenance-title.component';

describe('ProvenanceTitleComponent', () => {
  let component: ProvenanceTitleComponent;
  let fixture: ComponentFixture<ProvenanceTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvenanceTitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvenanceTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
