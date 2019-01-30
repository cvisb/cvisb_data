import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class FileMetadataService {
  private fileMD = new BehaviorSubject<Object>({'metadata': null, 'type': null});
  currentFileMD$ = this.fileMD.asObservable();

  private clickStatus = new BehaviorSubject<boolean>(false);
  fileClicked$ = this.clickStatus.asObservable();


  constructor() { }

  sendMetadata(md: Object, mdtype: string) {
    this.fileMD.next({metadata: md, type: mdtype});
  }

  clickFile(updateValue: boolean) {
    this.clickStatus.next(updateValue);
  }

}
