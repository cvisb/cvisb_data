import { Component, OnDestroy } from '@angular/core';

import { ApiService, AuthService, } from '../_services/';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CvisbUser } from '../_models';
import { HttpParams } from '@angular/common/http';
import { pipe, Subscription } from 'rxjs';
import { map, pluck } from 'rxjs/operators';

@Component({
  selector: 'app-delete-data',
  templateUrl: './delete-data.component.html',
  styleUrls: ['./delete-data.component.scss']
})

export class DeleteDataComponent implements OnDestroy {
  user: CvisbUser;
  endpoint: FormControl = new FormControl(null, [Validators.required]);
  // server: FormControl = new FormControl(null, [Validators.required]);
  query: FormControl = new FormControl("__all__", [Validators.required]);
  // ids2Delete$: Observable<string[]>;
  ids2Delete: string[] = [];
  idSubscription: Subscription;

  deleteForm: FormGroup;


  constructor(
    private fb: FormBuilder,
    private apiSvc: ApiService,
    private authSvc: AuthService
  ) {
    authSvc.userState$.subscribe((user: CvisbUser) => {
      this.user = user;
    })

    this.deleteForm = this.fb.group({
      endpoint: this.endpoint,
      // server: this.server,
      query: this.query
    });

  }

  onSubmit() {
    let opts = this.deleteForm.value;
    let qParams = new HttpParams()
      .set('q', opts['query'].replace(/\s/g, ""))
      .set('fields', '_id');

    this.idSubscription = this.apiSvc.get(opts['endpoint'], qParams, 1000).pipe(
      pluck("hits"),
      map((ids: Object[]) => {
        return ids.map(d => d['_id']);
      })
    ).subscribe(ids => this.ids2Delete = ids)

  }

  ngOnDestroy() {
    this.idSubscription.unsubscribe();
  }

  getErrorMessage() {
    return this.query.hasError('required') ? 'You must enter a value. If you want everything, enter "__all__"' : '';
  }

  getRequiredMessage(controlller) {
    return controlller.hasError('required') ? 'You must enter a value.' : '';
  }

  deleteIDs() {
    console.log("attempting to delete objects from endpoint");

    let opts = this.deleteForm.value;

    this.ids2Delete.forEach(id => {
      this.apiSvc.deleteObject(opts['endpoint'], id);
    })
  }

}
