import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MdObjectComponent } from './md-object.component';

describe('MdObjectComponent', () => {
  let component: MdObjectComponent;
  let fixture: ComponentFixture<MdObjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MdObjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MdObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
