import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FormatPublisherComponent } from './format-publisher.component';

describe('FormatPublisherComponent', () => {
  let component: FormatPublisherComponent;
  let fixture: ComponentFixture<FormatPublisherComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FormatPublisherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatPublisherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
