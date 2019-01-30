import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NovelAllelesComponent } from './novel-alleles.component';

describe('NovelAllelesComponent', () => {
  let component: NovelAllelesComponent;
  let fixture: ComponentFixture<NovelAllelesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NovelAllelesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NovelAllelesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
