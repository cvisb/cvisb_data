import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileMetadataComponent } from './file-metadata.component';

describe('FileMetadataComponent', () => {
  let component: FileMetadataComponent;
  let fixture: ComponentFixture<FileMetadataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileMetadataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
