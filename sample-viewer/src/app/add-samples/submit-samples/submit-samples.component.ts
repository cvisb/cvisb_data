import { Component, OnInit, Input} from '@angular/core';

import { ApiService } from '../../_services';
import { nest } from 'd3';

@Component({
  selector: 'app-submit-samples',
  templateUrl: './submit-samples.component.html',
  styleUrls: ['./submit-samples.component.scss']
})
export class SubmitSamplesComponent implements OnInit {
  uploadResponse: string;
  errorMsg: string;
  errorObj: Object[];
  @Input() data: Object[];

  constructor(private apiSvc: ApiService,) {
  }

  ngOnInit() {
    console.log('on init')
  }

  ngOnChanges() {
    this.uploadResponse = "";
    this.errorMsg = "";
    this.errorObj = null;
  }

  submitData() {
    this.uploadResponse = "Attempting to submit data to database.";

    this.apiSvc.put("sample", this.data).subscribe(resp => {
      this.uploadResponse = `Success! ${resp}`;
      console.log(resp)
      // Call sample service to update the samples.
      // this.sampleSvc.getSamples();
    }, err => {
      this.uploadResponse = "Uh oh. Something went wrong."
      this.errorMsg = err.error.error ? err.error.error : "Dunno why-- are you logged in? Check the developer console. Sorry :("

      this.errorObj = err.error.error_list;

      if (this.errorObj) {
        this.errorObj = this.tidyBackendErrors(this.errorObj)
        console.log(this.errorObj)
      }
      console.log(err)
    });
  }

  tidyBackendErrors(error_array) {
    let errs = [];

    // Reformat the errors
    error_array.forEach(document => document.error_messages.forEach(msg => errs.push({ message: msg.split("\n")[0], id: document.input_obj.sampleID, input: document.input_obj })))
    console.log(errs)

    // Group by error type
    let nested = nest()
      .key((d: any) => d.message)
      .rollup(function(values: any): any {
        return {
          count: values.length,
          ids: values.map(x => x.id),
          inputs: values.map(x => x.input)
        }
      }).entries(errs);

    console.log(nested)

    return (nested)
  }

}
