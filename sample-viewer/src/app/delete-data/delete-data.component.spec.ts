import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DeleteDataComponent } from './delete-data.component';

describe('DeleteDataComponent', () => {
  let component: DeleteDataComponent;
  let fixture: ComponentFixture<DeleteDataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
