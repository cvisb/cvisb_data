import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeerDatasetComponent } from './peer-dataset.component';

describe('PeerDatasetComponent', () => {
  let component: PeerDatasetComponent;
  let fixture: ComponentFixture<PeerDatasetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeerDatasetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeerDatasetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
