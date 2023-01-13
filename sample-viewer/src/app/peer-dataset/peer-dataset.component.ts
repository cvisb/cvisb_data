import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { DownloadDataService } from "../_services/download-data.service";

@Component({
  selector: 'app-peer-dataset',
  templateUrl: './peer-dataset.component.html',
  styleUrls: ['./peer-dataset.component.scss']
})
export class PeerDatasetComponent implements OnInit {
  data: Object[];
  dateModified: String = "22 November 2022";
  dict: Object[];
  loading: boolean = true;

  constructor(private httpClient: HttpClient,
    private dwnldSvc: DownloadDataService) { }

  ngOnInit(): void {
    this.httpClient.get("assets/data/2023_PEER_HealthData_Public.json").subscribe((data: any) => {
      this.data = data;
      this.loading = false;
    })

    this.httpClient.get("assets/data/2023_PEER_HealthData_Public_dict.json").subscribe((data: any) => {
      this.dict = data;
    })
  }

  downloadData() {
    this.dwnldSvc.parseData(this.data, "custom", "PEER_HealthData_Public.csv")
  }

  downloadDict() {
    this.dwnldSvc.parseData(this.dict, "custom", "PEER_HealthData_Public_Data_Dictionary.csv")
  }

}
