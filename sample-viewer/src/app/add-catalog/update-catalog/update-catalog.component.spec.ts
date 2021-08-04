import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCatalogComponent } from './update-catalog.component';

describe('UpdateCatalogComponent', () => {
  let component: UpdateCatalogComponent;
  let fixture: ComponentFixture<UpdateCatalogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateCatalogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
