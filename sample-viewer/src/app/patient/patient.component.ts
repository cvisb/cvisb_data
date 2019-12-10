import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Subscription } from 'rxjs';

import { GetPatientsService } from '../_services';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})

export class PatientComponent implements OnDestroy {
  titleSubscription: Subscription;

  constructor(
    // private router: Router,
    private patientSvc: GetPatientsService,
    private route: ActivatedRoute,
    private titleSvc: Title) {

    this.titleSubscription = this.route.data.subscribe(params => {
      // change the title of the page
      this.titleSvc.setTitle(params.title);
    });

    let params = new HttpParams().set("q", "cohort:Lassa AND outcome:survivor").set("experimentQuery", "includedInDataset:hla")

    // this.patientSvc.getPatientSummary(params).subscribe(x => {
    //   console.log("getPatientSummary response:")
    //   console.log(x)
    // })
    //
    // this.patientSvc.getPatientAssociatedData(["G13-398793", "G13-958672", "S-5886190", "G10-979431", "G13-963224", "S-0645510", "S-6605330", "S-6197110", "S-0500220", "G08-653127", "G15-345799", "G11-138551", "G11-284087", "S-6091480", "S-0017480", "S-3298240", "S-9075190", "S-1292620", "S-1663300", "S-0290770", "S-3374950", "S-7822270", "S-3346490", "S-3330660", "G10-637658", "G13-810129", "G13-438180", "G12-477578", "S-8185370", "S-9562190", "S-2010400", "S-8115360", "S-3451660", "S-2727790", "G13-574977", "G13-470743", "G15-802029", "G16-872376", "G11-916697", "G17-690959", "G17-834194", "S-3697730", "G16-404235", "G11-975355", "G13-391987", "S-2848950", "G12-383485", "G11-536458", "G12-044922", "S-1809100", "S-9166180", "S-3940450", "S-0089420", "S-3309190", "S-2077930", "S-8844860", "S-1688000", "G11-168979", "G11-453275", "G17-606085", "G18-496338", "G11-190872", "S-0279070", "S-6825070", "S-7730880", "S-0173430", "S-0237700", "S-7328310", "S-2553850", "G15-070384", "G12-744239", "S-4457190", "S-7703890", "S-5976610", "G10-454573", "G11-494658", "G13-291051", "G13-015029", "G15-328020", "S-7370480", "G13-130615", "G15-142546", "G13-001618", "G18-562660", "S-4073990", "S-1690570", "S-4232430", "S-3784080", "S-3225050", "G09-159259", "S-5513520", "G16-115173"]).subscribe(x => {
    //   console.log("getPatientAssociatedData response:")
    //   console.log(x)
    // })

    console.log("calling patient.component:getData")
    this.patientSvc.getPatientData(params, 0, 50, "age", "desc").subscribe(x => {
      console.log("getPatientData repsonse:")
      console.log(x)
    })

    this.patientSvc.getPatients(params, 0, 50, "age", "desc").subscribe(x => {
      console.log("getPatients response:")
      console.log(x)
    })

  }

  ngOnDestroy() {
    this.titleSubscription.unsubscribe();
  }

}
