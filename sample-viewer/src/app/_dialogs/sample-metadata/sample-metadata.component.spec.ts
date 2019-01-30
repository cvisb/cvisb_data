import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleMetadataComponent } from './sample-metadata.component';

describe('SampleMetadataComponent', () => {
  let component: SampleMetadataComponent;
  let fixture: ComponentFixture<SampleMetadataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SampleMetadataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
