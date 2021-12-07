import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AboutDataComponent } from './about-data.component';

describe('AboutDataComponent', () => {
  let component: AboutDataComponent;
  let fixture: ComponentFixture<AboutDataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
