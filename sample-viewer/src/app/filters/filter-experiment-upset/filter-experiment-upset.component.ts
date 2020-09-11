import { Component, AfterViewInit, ViewEncapsulation, ViewChild, ElementRef, Input } from '@angular/core';

import * as d3 from 'd3';

import { ExperimentObjectPipe } from '../../_pipes/experiment-object.pipe';

@Component({
  selector: 'app-filter-experiment-upset',
  templateUrl: './filter-experiment-upset.component.html',
  styleUrls: ['./filter-experiment-upset.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FilterExperimentUpsetComponent implements AfterViewInit {
  @ViewChild('exptupset', { static: false }) private chartContainer: ElementRef;
  data: any[];
  exptSummary: any[];

  // plot sizes
  private element: any;
  private margin: any = { top: 50, bottom: 60, left: 155, right: 25, separation: 5 };
  private width: number = 70;
  private height: number = 80;
  private spacing: number = 0.3;
  private icon_dy: number = 5;

  // --- Selectors ---
  private chart: any;
  private svg: any;
  private xAxis: any;
  private yAxis: any;
  private yDotsAxis: any;

  // --- Scales/Axes ---
  private x: any;
  private y: any;
  private y_dots: any;
  private colorScale: any;

  // from sequential calls to https://data.cvisb.org/api/patient/query?q=__all__&facets=patientID.keyword&size=0&facet_size=10000&experimentQuery=measurementTechnique:%22viral%20sequencing%22
  hla = {
    "facets": {
      "patientID.keyword": {
        "other": 0,
        "_type": "terms",
        "total": 330,
        "terms": [
          {
            "term": "C-5987502",
            "count": 1
          },
          {
            "term": "G08-163666",
            "count": 1
          },
          {
            "term": "G08-653127",
            "count": 1
          },
          {
            "term": "G09-159259",
            "count": 1
          },
          {
            "term": "G10-454573",
            "count": 1
          },
          {
            "term": "G10-637658",
            "count": 1
          },
          {
            "term": "G11-164586",
            "count": 1
          },
          {
            "term": "G11-280320",
            "count": 1
          },
          {
            "term": "G11-284087",
            "count": 1
          },
          {
            "term": "G11-392730",
            "count": 1
          },
          {
            "term": "G11-453275",
            "count": 1
          },
          {
            "term": "G11-493588",
            "count": 1
          },
          {
            "term": "G11-494658",
            "count": 1
          },
          {
            "term": "G11-496257",
            "count": 1
          },
          {
            "term": "G11-536458",
            "count": 1
          },
          {
            "term": "G11-801758",
            "count": 1
          },
          {
            "term": "G11-911002",
            "count": 1
          },
          {
            "term": "G11-916697",
            "count": 1
          },
          {
            "term": "G11-920323",
            "count": 1
          },
          {
            "term": "G11-935596",
            "count": 1
          },
          {
            "term": "G11-967503",
            "count": 1
          },
          {
            "term": "G11-977718",
            "count": 1
          },
          {
            "term": "G12-007753",
            "count": 1
          },
          {
            "term": "G12-020657",
            "count": 1
          },
          {
            "term": "G12-044922",
            "count": 1
          },
          {
            "term": "G12-068330",
            "count": 1
          },
          {
            "term": "G12-178978",
            "count": 1
          },
          {
            "term": "G12-259246",
            "count": 1
          },
          {
            "term": "G12-298872",
            "count": 1
          },
          {
            "term": "G12-330614",
            "count": 1
          },
          {
            "term": "G12-345672",
            "count": 1
          },
          {
            "term": "G12-347294",
            "count": 1
          },
          {
            "term": "G12-348903",
            "count": 1
          },
          {
            "term": "G12-373508",
            "count": 1
          },
          {
            "term": "G12-383485",
            "count": 1
          },
          {
            "term": "G12-477578",
            "count": 1
          },
          {
            "term": "G12-479977",
            "count": 1
          },
          {
            "term": "G12-508969",
            "count": 1
          },
          {
            "term": "G12-672513",
            "count": 1
          },
          {
            "term": "G12-675995",
            "count": 1
          },
          {
            "term": "G12-676831",
            "count": 1
          },
          {
            "term": "G12-683173",
            "count": 1
          },
          {
            "term": "G12-692192",
            "count": 1
          },
          {
            "term": "G12-696068",
            "count": 1
          },
          {
            "term": "G12-744239",
            "count": 1
          },
          {
            "term": "G12-765103",
            "count": 1
          },
          {
            "term": "G12-852209",
            "count": 1
          },
          {
            "term": "G12-884464",
            "count": 1
          },
          {
            "term": "G12-948714",
            "count": 1
          },
          {
            "term": "G13-001618",
            "count": 1
          },
          {
            "term": "G13-015029",
            "count": 1
          },
          {
            "term": "G13-029569",
            "count": 1
          },
          {
            "term": "G13-073319",
            "count": 1
          },
          {
            "term": "G13-099983",
            "count": 1
          },
          {
            "term": "G13-107821",
            "count": 1
          },
          {
            "term": "G13-123737",
            "count": 1
          },
          {
            "term": "G13-130615",
            "count": 1
          },
          {
            "term": "G13-158702",
            "count": 1
          },
          {
            "term": "G13-161048",
            "count": 1
          },
          {
            "term": "G13-161572",
            "count": 1
          },
          {
            "term": "G13-164269",
            "count": 1
          },
          {
            "term": "G13-173909",
            "count": 1
          },
          {
            "term": "G13-180952",
            "count": 1
          },
          {
            "term": "G13-195230",
            "count": 1
          },
          {
            "term": "G13-271038",
            "count": 1
          },
          {
            "term": "G13-290663",
            "count": 1
          },
          {
            "term": "G13-291051",
            "count": 1
          },
          {
            "term": "G13-326694",
            "count": 1
          },
          {
            "term": "G13-343939",
            "count": 1
          },
          {
            "term": "G13-358327",
            "count": 1
          },
          {
            "term": "G13-372053",
            "count": 1
          },
          {
            "term": "G13-380738",
            "count": 1
          },
          {
            "term": "G13-391987",
            "count": 1
          },
          {
            "term": "G13-398573",
            "count": 1
          },
          {
            "term": "G13-398793",
            "count": 1
          },
          {
            "term": "G13-405798",
            "count": 1
          },
          {
            "term": "G13-413244",
            "count": 1
          },
          {
            "term": "G13-423340",
            "count": 1
          },
          {
            "term": "G13-438180",
            "count": 1
          },
          {
            "term": "G13-442375",
            "count": 1
          },
          {
            "term": "G13-453214",
            "count": 1
          },
          {
            "term": "G13-470743",
            "count": 1
          },
          {
            "term": "G13-471949",
            "count": 1
          },
          {
            "term": "G13-483031",
            "count": 1
          },
          {
            "term": "G13-503867",
            "count": 1
          },
          {
            "term": "G13-505581",
            "count": 1
          },
          {
            "term": "G13-530719",
            "count": 1
          },
          {
            "term": "G13-534508",
            "count": 1
          },
          {
            "term": "G13-558286",
            "count": 1
          },
          {
            "term": "G13-560075",
            "count": 1
          },
          {
            "term": "G13-573478",
            "count": 1
          },
          {
            "term": "G13-574977",
            "count": 1
          },
          {
            "term": "G13-621276",
            "count": 1
          },
          {
            "term": "G13-667732",
            "count": 1
          },
          {
            "term": "G13-678177",
            "count": 1
          },
          {
            "term": "G13-684800",
            "count": 1
          },
          {
            "term": "G13-707984",
            "count": 1
          },
          {
            "term": "G13-731331",
            "count": 1
          },
          {
            "term": "G13-737076",
            "count": 1
          },
          {
            "term": "G13-753681",
            "count": 1
          },
          {
            "term": "G13-810129",
            "count": 1
          },
          {
            "term": "G13-810191",
            "count": 1
          },
          {
            "term": "G13-870565",
            "count": 1
          },
          {
            "term": "G13-889324",
            "count": 1
          },
          {
            "term": "G13-907157",
            "count": 1
          },
          {
            "term": "G13-951214",
            "count": 1
          },
          {
            "term": "G13-958672",
            "count": 1
          },
          {
            "term": "G13-963224",
            "count": 1
          },
          {
            "term": "G14-057241",
            "count": 1
          },
          {
            "term": "G14-130011",
            "count": 1
          },
          {
            "term": "G14-170725",
            "count": 1
          },
          {
            "term": "G14-887240",
            "count": 1
          },
          {
            "term": "G15-010711",
            "count": 1
          },
          {
            "term": "G15-070384",
            "count": 1
          },
          {
            "term": "G15-142546",
            "count": 1
          },
          {
            "term": "G15-181286",
            "count": 1
          },
          {
            "term": "G15-328020",
            "count": 1
          },
          {
            "term": "G15-345799",
            "count": 1
          },
          {
            "term": "G15-510176",
            "count": 1
          },
          {
            "term": "G15-674061",
            "count": 1
          },
          {
            "term": "G15-692688",
            "count": 1
          },
          {
            "term": "G15-756333",
            "count": 1
          },
          {
            "term": "G15-802029",
            "count": 1
          },
          {
            "term": "G15-951439",
            "count": 1
          },
          {
            "term": "G16-017324",
            "count": 1
          },
          {
            "term": "G16-062133",
            "count": 1
          },
          {
            "term": "G16-088096",
            "count": 1
          },
          {
            "term": "G16-115173",
            "count": 1
          },
          {
            "term": "G16-224993",
            "count": 1
          },
          {
            "term": "G16-373839",
            "count": 1
          },
          {
            "term": "G16-404235",
            "count": 1
          },
          {
            "term": "G16-560626",
            "count": 1
          },
          {
            "term": "G16-585805",
            "count": 1
          },
          {
            "term": "G16-731359",
            "count": 1
          },
          {
            "term": "G16-797430",
            "count": 1
          },
          {
            "term": "G16-872376",
            "count": 1
          },
          {
            "term": "G16-889151",
            "count": 1
          },
          {
            "term": "G17-483592",
            "count": 1
          },
          {
            "term": "G17-507936",
            "count": 1
          },
          {
            "term": "G17-511154",
            "count": 1
          },
          {
            "term": "G17-530014",
            "count": 1
          },
          {
            "term": "G17-585948",
            "count": 1
          },
          {
            "term": "G17-606085",
            "count": 1
          },
          {
            "term": "G17-609310",
            "count": 1
          },
          {
            "term": "G17-614631",
            "count": 1
          },
          {
            "term": "G17-678621",
            "count": 1
          },
          {
            "term": "G17-754701",
            "count": 1
          },
          {
            "term": "G17-761820",
            "count": 1
          },
          {
            "term": "G17-834194",
            "count": 1
          },
          {
            "term": "G17-909700",
            "count": 1
          },
          {
            "term": "G18-003580",
            "count": 1
          },
          {
            "term": "G18-069018",
            "count": 1
          },
          {
            "term": "G18-116127",
            "count": 1
          },
          {
            "term": "G18-118447",
            "count": 1
          },
          {
            "term": "G18-423089",
            "count": 1
          },
          {
            "term": "G18-496338",
            "count": 1
          },
          {
            "term": "G18-562660",
            "count": 1
          },
          {
            "term": "G18-731895",
            "count": 1
          },
          {
            "term": "G18-820249",
            "count": 1
          },
          {
            "term": "S-0021700",
            "count": 1
          },
          {
            "term": "S-0089420",
            "count": 1
          },
          {
            "term": "S-0173430",
            "count": 1
          },
          {
            "term": "S-0219160",
            "count": 1
          },
          {
            "term": "S-0237700",
            "count": 1
          },
          {
            "term": "S-0279070",
            "count": 1
          },
          {
            "term": "S-0500220",
            "count": 1
          },
          {
            "term": "S-0645510",
            "count": 1
          },
          {
            "term": "S-0937800",
            "count": 1
          },
          {
            "term": "S-0977350",
            "count": 1
          },
          {
            "term": "S-1195170",
            "count": 1
          },
          {
            "term": "S-1529690",
            "count": 1
          },
          {
            "term": "S-1640700",
            "count": 1
          },
          {
            "term": "S-1663300",
            "count": 1
          },
          {
            "term": "S-1688000",
            "count": 1
          },
          {
            "term": "S-1690570",
            "count": 1
          },
          {
            "term": "S-1809100",
            "count": 1
          },
          {
            "term": "S-1981550",
            "count": 1
          },
          {
            "term": "S-2010400",
            "count": 1
          },
          {
            "term": "S-2191100",
            "count": 1
          },
          {
            "term": "S-2193700",
            "count": 1
          },
          {
            "term": "S-2218440",
            "count": 1
          },
          {
            "term": "S-2362690",
            "count": 1
          },
          {
            "term": "S-2454370",
            "count": 1
          },
          {
            "term": "S-2827730",
            "count": 1
          },
          {
            "term": "S-2848950",
            "count": 1
          },
          {
            "term": "S-3200970",
            "count": 1
          },
          {
            "term": "S-3298240",
            "count": 1
          },
          {
            "term": "S-3309190",
            "count": 1
          },
          {
            "term": "S-3346490",
            "count": 1
          },
          {
            "term": "S-3374950",
            "count": 1
          },
          {
            "term": "S-3697730",
            "count": 1
          },
          {
            "term": "S-3784080",
            "count": 1
          },
          {
            "term": "S-3940450",
            "count": 1
          },
          {
            "term": "S-4069720",
            "count": 1
          },
          {
            "term": "S-4073990",
            "count": 1
          },
          {
            "term": "S-4279150",
            "count": 1
          },
          {
            "term": "S-4457190",
            "count": 1
          },
          {
            "term": "S-4846050",
            "count": 1
          },
          {
            "term": "S-5082340",
            "count": 1
          },
          {
            "term": "S-5164310",
            "count": 1
          },
          {
            "term": "S-5311660",
            "count": 1
          },
          {
            "term": "S-5376950",
            "count": 1
          },
          {
            "term": "S-5513520",
            "count": 1
          },
          {
            "term": "S-5651940",
            "count": 1
          },
          {
            "term": "S-5656880",
            "count": 1
          },
          {
            "term": "S-5792800",
            "count": 1
          },
          {
            "term": "S-5840770",
            "count": 1
          },
          {
            "term": "S-5976610",
            "count": 1
          },
          {
            "term": "S-5987500",
            "count": 1
          },
          {
            "term": "S-6015410",
            "count": 1
          },
          {
            "term": "S-6091480",
            "count": 1
          },
          {
            "term": "S-6394110",
            "count": 1
          },
          {
            "term": "S-6444640",
            "count": 1
          },
          {
            "term": "S-6605330",
            "count": 1
          },
          {
            "term": "S-6809170",
            "count": 1
          },
          {
            "term": "S-6825070",
            "count": 1
          },
          {
            "term": "S-6827870",
            "count": 1
          },
          {
            "term": "S-7155090",
            "count": 1
          },
          {
            "term": "S-7308250",
            "count": 1
          },
          {
            "term": "S-7370480",
            "count": 1
          },
          {
            "term": "S-7676060",
            "count": 1
          },
          {
            "term": "S-8115360",
            "count": 1
          },
          {
            "term": "S-8158490",
            "count": 1
          },
          {
            "term": "S-8185370",
            "count": 1
          },
          {
            "term": "S-8197950",
            "count": 1
          },
          {
            "term": "S-8436170",
            "count": 1
          },
          {
            "term": "S-8551230",
            "count": 1
          },
          {
            "term": "S-8939540",
            "count": 1
          },
          {
            "term": "S-9126840",
            "count": 1
          },
          {
            "term": "S-9166180",
            "count": 1
          },
          {
            "term": "S-9322630",
            "count": 1
          },
          {
            "term": "S-9478070",
            "count": 1
          },
          {
            "term": "S-9562190",
            "count": 1
          },
          {
            "term": "SM041W7",
            "count": 1
          },
          {
            "term": "SM0D057",
            "count": 1
          },
          {
            "term": "SM0STIK",
            "count": 1
          },
          {
            "term": "SM1531D",
            "count": 1
          },
          {
            "term": "SM1I3H3",
            "count": 1
          },
          {
            "term": "SM1K4NB",
            "count": 1
          },
          {
            "term": "SM23421",
            "count": 1
          },
          {
            "term": "SM274AB",
            "count": 1
          },
          {
            "term": "SM28YT5",
            "count": 1
          },
          {
            "term": "SM2AXQ7",
            "count": 1
          },
          {
            "term": "SM2DT2B",
            "count": 1
          },
          {
            "term": "SM2H41H",
            "count": 1
          },
          {
            "term": "SM316S6",
            "count": 1
          },
          {
            "term": "SM33OFA",
            "count": 1
          },
          {
            "term": "SM3AK66",
            "count": 1
          },
          {
            "term": "SM3DY5Y",
            "count": 1
          },
          {
            "term": "SM3X5K6",
            "count": 1
          },
          {
            "term": "SM40RL7",
            "count": 1
          },
          {
            "term": "SM45HS5",
            "count": 1
          },
          {
            "term": "SM4GCTO",
            "count": 1
          },
          {
            "term": "SM4H043",
            "count": 1
          },
          {
            "term": "SM4U4U5",
            "count": 1
          },
          {
            "term": "SM4YA0T",
            "count": 1
          },
          {
            "term": "SM52T72",
            "count": 1
          },
          {
            "term": "SM54X31",
            "count": 1
          },
          {
            "term": "SM57E8W",
            "count": 1
          },
          {
            "term": "SM57WN4",
            "count": 1
          },
          {
            "term": "SM581NY",
            "count": 1
          },
          {
            "term": "SM5IVXS",
            "count": 1
          },
          {
            "term": "SM5NW72",
            "count": 1
          },
          {
            "term": "SM63524",
            "count": 1
          },
          {
            "term": "SM65TJ4",
            "count": 1
          },
          {
            "term": "SM6M82B",
            "count": 1
          },
          {
            "term": "SM6PX46",
            "count": 1
          },
          {
            "term": "SM6YABY",
            "count": 1
          },
          {
            "term": "SM725P5",
            "count": 1
          },
          {
            "term": "SM73EL5",
            "count": 1
          },
          {
            "term": "SM7717E",
            "count": 1
          },
          {
            "term": "SM78321",
            "count": 1
          },
          {
            "term": "SM7FUNJ",
            "count": 1
          },
          {
            "term": "SM7FVAW",
            "count": 1
          },
          {
            "term": "SM7I50K",
            "count": 1
          },
          {
            "term": "SM7S03I",
            "count": 1
          },
          {
            "term": "SM7S6J3",
            "count": 1
          },
          {
            "term": "SM840KB",
            "count": 1
          },
          {
            "term": "SM888N1",
            "count": 1
          },
          {
            "term": "SM8BCI7",
            "count": 1
          },
          {
            "term": "SM8C68I",
            "count": 1
          },
          {
            "term": "SM8GQ85",
            "count": 1
          },
          {
            "term": "SM8RFH0",
            "count": 1
          },
          {
            "term": "SMASM53",
            "count": 1
          },
          {
            "term": "SMBU8H5",
            "count": 1
          },
          {
            "term": "SMC3C35",
            "count": 1
          },
          {
            "term": "SMDJORF",
            "count": 1
          },
          {
            "term": "SMES56G",
            "count": 1
          },
          {
            "term": "SMFN6FI",
            "count": 1
          },
          {
            "term": "SMG4307",
            "count": 1
          },
          {
            "term": "SMG55W1",
            "count": 1
          },
          {
            "term": "SMG80R7",
            "count": 1
          },
          {
            "term": "SMH02WW",
            "count": 1
          },
          {
            "term": "SMH4062",
            "count": 1
          },
          {
            "term": "SMH72NU",
            "count": 1
          },
          {
            "term": "SMHFRGT",
            "count": 1
          },
          {
            "term": "SMHWE28",
            "count": 1
          },
          {
            "term": "SMI080Q",
            "count": 1
          },
          {
            "term": "SMIVNJP",
            "count": 1
          },
          {
            "term": "SMJ0YWU",
            "count": 1
          },
          {
            "term": "SMJ23Y8",
            "count": 1
          },
          {
            "term": "SMKA1J3",
            "count": 1
          },
          {
            "term": "SMKH38R",
            "count": 1
          },
          {
            "term": "SMKIQN4",
            "count": 1
          },
          {
            "term": "SML3S6P",
            "count": 1
          },
          {
            "term": "SML41WT",
            "count": 1
          },
          {
            "term": "SMLKMJ3",
            "count": 1
          },
          {
            "term": "SMM3647",
            "count": 1
          },
          {
            "term": "SMMG1IP",
            "count": 1
          },
          {
            "term": "SMN48MN",
            "count": 1
          },
          {
            "term": "SMNS5S8",
            "count": 1
          },
          {
            "term": "SMO2I25",
            "count": 1
          },
          {
            "term": "SMOJC43",
            "count": 1
          },
          {
            "term": "SMQ36FW",
            "count": 1
          },
          {
            "term": "SMR55T6",
            "count": 1
          },
          {
            "term": "SMS7020",
            "count": 1
          },
          {
            "term": "SMS8M2K",
            "count": 1
          },
          {
            "term": "SMTNXV7",
            "count": 1
          },
          {
            "term": "SMU1HMG",
            "count": 1
          },
          {
            "term": "SMV21T2",
            "count": 1
          },
          {
            "term": "SMV6307",
            "count": 1
          },
          {
            "term": "SMV8GKI",
            "count": 1
          },
          {
            "term": "SMW015B",
            "count": 1
          },
          {
            "term": "SMWX500",
            "count": 1
          },
          {
            "term": "SMX3XAG",
            "count": 1
          },
          {
            "term": "SMXH7D2",
            "count": 1
          },
          {
            "term": "SMXMSHQ",
            "count": 1
          },
          {
            "term": "SMY4857",
            "count": 1
          },
          {
            "term": "SMY53QK",
            "count": 1
          },
          {
            "term": "SMY5RW5",
            "count": 1
          }
        ],
        "missing": 0
      }
    },
    "max_score": 0,
    "took": 14,
    "total": 330,
    "hits": []
  }

  viral = {
    "facets": {
      "patientID.keyword": {
        "terms": [
          {
            "term": "806387_GIN_1981",
            "count": 1
          },
          {
            "term": "806568_SLE_1979",
            "count": 1
          },
          {
            "term": "806593_NGA_1989",
            "count": 1
          },
          {
            "term": "807876_NGA_1981",
            "count": 1
          },
          {
            "term": "807978_LBR_1981",
            "count": 1
          },
          {
            "term": "807987_LBR_1981",
            "count": 1
          },
          {
            "term": "807988_GIN_1996",
            "count": 1
          },
          {
            "term": "808714_SLE_1980",
            "count": 1
          },
          {
            "term": "810801_NGA_1974",
            "count": 1
          },
          {
            "term": "811606_LBR_2010",
            "count": 1
          },
          {
            "term": "812285_NGA_1976",
            "count": 1
          },
          {
            "term": "812337_LBR_2014",
            "count": 1
          },
          {
            "term": "812673_LBR_2015",
            "count": 1
          },
          {
            "term": "BA366_GIN_2003",
            "count": 1
          },
          {
            "term": "Bamba_R114_MLI_2012",
            "count": 1
          },
          {
            "term": "G09-002060",
            "count": 1
          },
          {
            "term": "G09-057298",
            "count": 1
          },
          {
            "term": "G09-410640",
            "count": 1
          },
          {
            "term": "G09-877538",
            "count": 1
          },
          {
            "term": "G09-899973",
            "count": 1
          },
          {
            "term": "G10-234354",
            "count": 1
          },
          {
            "term": "G10-474786",
            "count": 1
          },
          {
            "term": "G10-522940",
            "count": 1
          },
          {
            "term": "G10-571750",
            "count": 1
          },
          {
            "term": "G10-888666",
            "count": 1
          },
          {
            "term": "G10-979431",
            "count": 1
          },
          {
            "term": "G11-020400",
            "count": 1
          },
          {
            "term": "G11-026455",
            "count": 1
          },
          {
            "term": "G11-121247",
            "count": 1
          },
          {
            "term": "G11-121422",
            "count": 1
          },
          {
            "term": "G11-138551",
            "count": 1
          },
          {
            "term": "G11-159975",
            "count": 1
          },
          {
            "term": "G11-240927",
            "count": 1
          },
          {
            "term": "G11-410189",
            "count": 1
          },
          {
            "term": "G11-473580",
            "count": 1
          },
          {
            "term": "G11-493588",
            "count": 1
          },
          {
            "term": "G11-493963",
            "count": 1
          },
          {
            "term": "G11-494658",
            "count": 1
          },
          {
            "term": "G11-639648",
            "count": 1
          },
          {
            "term": "G11-640117",
            "count": 1
          },
          {
            "term": "G11-793139",
            "count": 1
          },
          {
            "term": "G11-800402",
            "count": 1
          },
          {
            "term": "G11-801758",
            "count": 1
          },
          {
            "term": "G11-920323",
            "count": 1
          },
          {
            "term": "G11-951597",
            "count": 1
          },
          {
            "term": "G12-020657",
            "count": 1
          },
          {
            "term": "G12-031013",
            "count": 1
          },
          {
            "term": "G12-044922",
            "count": 1
          },
          {
            "term": "G12-077587",
            "count": 1
          },
          {
            "term": "G12-284015",
            "count": 1
          },
          {
            "term": "G12-345672",
            "count": 1
          },
          {
            "term": "G12-348903",
            "count": 1
          },
          {
            "term": "G12-351597",
            "count": 1
          },
          {
            "term": "G12-454900",
            "count": 1
          },
          {
            "term": "G12-475223",
            "count": 1
          },
          {
            "term": "G12-477578",
            "count": 1
          },
          {
            "term": "G12-493876",
            "count": 1
          },
          {
            "term": "G12-508969",
            "count": 1
          },
          {
            "term": "G12-509164",
            "count": 1
          },
          {
            "term": "G12-522643",
            "count": 1
          },
          {
            "term": "G12-551258",
            "count": 1
          },
          {
            "term": "G12-559901",
            "count": 1
          },
          {
            "term": "G12-676831",
            "count": 1
          },
          {
            "term": "G12-683173",
            "count": 1
          },
          {
            "term": "G12-692192",
            "count": 1
          },
          {
            "term": "G12-699175",
            "count": 1
          },
          {
            "term": "G12-716845",
            "count": 1
          },
          {
            "term": "G12-847773",
            "count": 1
          },
          {
            "term": "G12-852209",
            "count": 1
          },
          {
            "term": "G12-884464",
            "count": 1
          },
          {
            "term": "G12-948714",
            "count": 1
          },
          {
            "term": "G13-015029",
            "count": 1
          },
          {
            "term": "G13-112387",
            "count": 1
          },
          {
            "term": "G13-152298",
            "count": 1
          },
          {
            "term": "G13-173909",
            "count": 1
          },
          {
            "term": "G13-180732",
            "count": 1
          },
          {
            "term": "G13-180952",
            "count": 1
          },
          {
            "term": "G13-271038",
            "count": 1
          },
          {
            "term": "G13-290663",
            "count": 1
          },
          {
            "term": "G13-343939",
            "count": 1
          },
          {
            "term": "G13-380738",
            "count": 1
          },
          {
            "term": "G13-396713",
            "count": 1
          },
          {
            "term": "G13-405798",
            "count": 1
          },
          {
            "term": "G13-438180",
            "count": 1
          },
          {
            "term": "G13-442375",
            "count": 1
          },
          {
            "term": "G13-520690",
            "count": 1
          },
          {
            "term": "G13-707984",
            "count": 1
          },
          {
            "term": "G13-817024",
            "count": 1
          },
          {
            "term": "G13-870565",
            "count": 1
          },
          {
            "term": "IRR_001_NGA_2011",
            "count": 1
          },
          {
            "term": "IRR_001_NGA_2012",
            "count": 1
          },
          {
            "term": "IRR_001_NGA_2013",
            "count": 1
          },
          {
            "term": "IRR_001_NGA_2014",
            "count": 1
          },
          {
            "term": "IRR_001_NGA_2015",
            "count": 1
          },
          {
            "term": "IRR_001_NGA_2016",
            "count": 1
          },
          {
            "term": "IRR_001_NGA_2017",
            "count": 1
          },
          {
            "term": "IRR_001_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_002_NGA_2013",
            "count": 1
          },
          {
            "term": "IRR_002_NGA_2014",
            "count": 1
          },
          {
            "term": "IRR_002_NGA_2016",
            "count": 1
          },
          {
            "term": "IRR_003_NGA_2012",
            "count": 1
          },
          {
            "term": "IRR_003_NGA_2013",
            "count": 1
          },
          {
            "term": "IRR_003_NGA_2014",
            "count": 1
          },
          {
            "term": "IRR_003_NGA_2016",
            "count": 1
          },
          {
            "term": "IRR_004_NGA_2012",
            "count": 1
          },
          {
            "term": "IRR_004_NGA_2013",
            "count": 1
          },
          {
            "term": "IRR_004_NGA_2014",
            "count": 1
          },
          {
            "term": "IRR_004_NGA_2016",
            "count": 1
          },
          {
            "term": "IRR_004_NGA_2017",
            "count": 1
          },
          {
            "term": "IRR_005_NGA_2013",
            "count": 1
          },
          {
            "term": "IRR_005_NGA_2014",
            "count": 1
          },
          {
            "term": "IRR_005_NGA_2016",
            "count": 1
          },
          {
            "term": "IRR_006_NGA_2012",
            "count": 1
          },
          {
            "term": "IRR_006_NGA_2013",
            "count": 1
          },
          {
            "term": "IRR_006_NGA_2015",
            "count": 1
          },
          {
            "term": "IRR_006_NGA_2016",
            "count": 1
          },
          {
            "term": "IRR_006_NGA_2017",
            "count": 1
          },
          {
            "term": "IRR_006_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_007_NGA_2013",
            "count": 1
          },
          {
            "term": "IRR_007_NGA_2015",
            "count": 1
          },
          {
            "term": "IRR_007_NGA_2016",
            "count": 1
          },
          {
            "term": "IRR_008_NGA_2013",
            "count": 1
          },
          {
            "term": "IRR_008_NGA_2015",
            "count": 1
          },
          {
            "term": "IRR_008_NGA_2016",
            "count": 1
          },
          {
            "term": "IRR_008_NGA_2017",
            "count": 1
          },
          {
            "term": "IRR_008_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_009_NGA_2015",
            "count": 1
          },
          {
            "term": "IRR_009_NGA_2016",
            "count": 1
          },
          {
            "term": "IRR_009_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_010_NGA_2012",
            "count": 1
          },
          {
            "term": "IRR_010_NGA_2014",
            "count": 1
          },
          {
            "term": "IRR_010_NGA_2015",
            "count": 1
          },
          {
            "term": "IRR_010_NGA_2016",
            "count": 1
          },
          {
            "term": "IRR_010_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_011_NGA_2013",
            "count": 1
          },
          {
            "term": "IRR_011_NGA_2014",
            "count": 1
          },
          {
            "term": "IRR_011_NGA_2015",
            "count": 1
          },
          {
            "term": "IRR_011_NGA_2016",
            "count": 1
          },
          {
            "term": "IRR_011_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_012_NGA_2014",
            "count": 1
          },
          {
            "term": "IRR_012_NGA_2015",
            "count": 1
          },
          {
            "term": "IRR_012_NGA_2016",
            "count": 1
          },
          {
            "term": "IRR_013_NGA_2016",
            "count": 1
          },
          {
            "term": "IRR_013_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_014_NGA_2013",
            "count": 1
          },
          {
            "term": "IRR_014_NGA_2015",
            "count": 1
          },
          {
            "term": "IRR_014_NGA_2016",
            "count": 1
          },
          {
            "term": "IRR_014_NGA_2017",
            "count": 1
          },
          {
            "term": "IRR_014_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_015_NGA_2013",
            "count": 1
          },
          {
            "term": "IRR_015_NGA_2015",
            "count": 1
          },
          {
            "term": "IRR_015_NGA_2016",
            "count": 1
          },
          {
            "term": "IRR_015_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_016_NGA_2013",
            "count": 1
          },
          {
            "term": "IRR_016_NGA_2016",
            "count": 1
          },
          {
            "term": "IRR_017_NGA_2016",
            "count": 1
          },
          {
            "term": "IRR_017_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_018_NGA_2016",
            "count": 1
          },
          {
            "term": "IRR_019_NGA_2016",
            "count": 1
          },
          {
            "term": "IRR_020_NGA_2016",
            "count": 1
          },
          {
            "term": "IRR_020_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_021_NGA_2016",
            "count": 1
          },
          {
            "term": "IRR_021_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_022_NGA_2016",
            "count": 1
          },
          {
            "term": "IRR_022_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_023_NGA_2016",
            "count": 1
          },
          {
            "term": "IRR_024_NGA_2016",
            "count": 1
          },
          {
            "term": "IRR_024_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_025_NGA_2016",
            "count": 1
          },
          {
            "term": "IRR_025_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_026_NGA_2016",
            "count": 1
          },
          {
            "term": "IRR_027_NGA_2016",
            "count": 1
          },
          {
            "term": "IRR_028_NGA_2016",
            "count": 1
          },
          {
            "term": "IRR_029_NGA_2016",
            "count": 1
          },
          {
            "term": "IRR_030_NGA_2016",
            "count": 1
          },
          {
            "term": "IRR_031_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_032_NGA_2016",
            "count": 1
          },
          {
            "term": "IRR_033_NGA_2016",
            "count": 1
          },
          {
            "term": "IRR_033_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_034_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_035_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_036_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_037_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_042_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_044_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_046_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_047_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_048_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_050_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_051_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_052_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_054_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_057_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_060_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_061_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_063_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_064_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_065_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_066_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_071_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_072_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_073_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_074_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_075_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_077_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_082_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_084_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_085_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_086_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_092_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_095_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_099_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_100_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_101_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_103_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_106_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_110_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_114_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_115_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_117_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_119_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_120_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_121_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_126_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_131_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_135_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_136_NGA_2018",
            "count": 1
          },
          {
            "term": "IRR_141_NGA_2018",
            "count": 1
          },
          {
            "term": "ISTH_0009_NGA_2011",
            "count": 1
          },
          {
            "term": "ISTH_0009_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_0012_NGA_2011",
            "count": 1
          },
          {
            "term": "ISTH_0017_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_0035_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_0047_NGA_2011",
            "count": 1
          },
          {
            "term": "ISTH_0073_NGA_2011",
            "count": 1
          },
          {
            "term": "ISTH_0089_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_0097_NGA_2018",
            "count": 1
          },
          {
            "term": "ISTH_0104_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_0133_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_0141_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_0146_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_0176_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_0187_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_0199_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_0230_NGA_2011",
            "count": 1
          },
          {
            "term": "ISTH_0314_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_0419_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_0447_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_0531_NGA_2011",
            "count": 1
          },
          {
            "term": "ISTH_0541_NGA_2018",
            "count": 1
          },
          {
            "term": "ISTH_0543_NGA_2015",
            "count": 1
          },
          {
            "term": "ISTH_0543_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_0547_NGA_2015",
            "count": 1
          },
          {
            "term": "ISTH_0565_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_0572_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_0574_NGA_2015",
            "count": 1
          },
          {
            "term": "ISTH_0595_NGA_2011",
            "count": 1
          },
          {
            "term": "ISTH_0610_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_0621_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_0664_NGA_2018",
            "count": 1
          },
          {
            "term": "ISTH_0681_NGA_2015",
            "count": 1
          },
          {
            "term": "ISTH_0682_NGA_2015",
            "count": 1
          },
          {
            "term": "ISTH_0687_NGA_2015",
            "count": 1
          },
          {
            "term": "ISTH_0701_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_0702_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_0703_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_0717_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_0736_NGA_2015",
            "count": 1
          },
          {
            "term": "ISTH_0753_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_0759_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_0777_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_0779_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_0789_NGA_2015",
            "count": 1
          },
          {
            "term": "ISTH_0821_NGA_2015",
            "count": 1
          },
          {
            "term": "ISTH_0831_NGA_2015",
            "count": 1
          },
          {
            "term": "ISTH_0917_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_0919_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_0959_NGA_2018",
            "count": 1
          },
          {
            "term": "ISTH_0964_NGA_2011",
            "count": 1
          },
          {
            "term": "ISTH_1003_NGA_2011",
            "count": 1
          },
          {
            "term": "ISTH_1006_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_1024_NGA_2018",
            "count": 1
          },
          {
            "term": "ISTH_1026_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_1038_NGA_2011",
            "count": 1
          },
          {
            "term": "ISTH_1048_NGA_2011",
            "count": 1
          },
          {
            "term": "ISTH_1058_NGA_2011",
            "count": 1
          },
          {
            "term": "ISTH_1064_NGA_2011",
            "count": 1
          },
          {
            "term": "ISTH_1069_NGA_2011",
            "count": 1
          },
          {
            "term": "ISTH_1069_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_1070_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_1079_NGA_2018",
            "count": 1
          },
          {
            "term": "ISTH_1096_NGA_2012",
            "count": 1
          },
          {
            "term": "ISTH_1107_NGA_2012",
            "count": 1
          },
          {
            "term": "ISTH_1111_NGA_2011",
            "count": 1
          },
          {
            "term": "ISTH_1121_NGA_2012",
            "count": 1
          },
          {
            "term": "ISTH_1123_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_1129_NGA_2012",
            "count": 1
          },
          {
            "term": "ISTH_1137_NGA_2011",
            "count": 1
          },
          {
            "term": "ISTH_1150_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_1174_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_1177_NGA_2018",
            "count": 1
          },
          {
            "term": "ISTH_1207_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_1250_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_1306_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_1311_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_1375_NGA_2018",
            "count": 1
          },
          {
            "term": "ISTH_1381_NGA_2018",
            "count": 1
          },
          {
            "term": "ISTH_1392_NGA_2018",
            "count": 1
          },
          {
            "term": "ISTH_1398_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_1423_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_1462_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_1472_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_1474_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_1496_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_1541_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_1546_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_1568_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_1591_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_1604_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_1609_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_1610_NGA_2016",
            "count": 1
          },
          {
            "term": "ISTH_1643_NGA_2018",
            "count": 1
          },
          {
            "term": "ISTH_2010_NGA_2012",
            "count": 1
          },
          {
            "term": "ISTH_2016_NGA_2012",
            "count": 1
          },
          {
            "term": "ISTH_2020_NGA_2012",
            "count": 1
          },
          {
            "term": "ISTH_2025_NGA_2012",
            "count": 1
          },
          {
            "term": "ISTH_2031_NGA_2012",
            "count": 1
          },
          {
            "term": "ISTH_2037_NGA_2012",
            "count": 1
          },
          {
            "term": "ISTH_2042_NGA_2012",
            "count": 1
          },
          {
            "term": "ISTH_2046_NGA_2012",
            "count": 1
          },
          {
            "term": "ISTH_2050_NGA_2012",
            "count": 1
          },
          {
            "term": "ISTH_2057_NGA_2012",
            "count": 1
          },
          {
            "term": "ISTH_2061_NGA_2012",
            "count": 1
          },
          {
            "term": "ISTH_2064_NGA_2012",
            "count": 1
          },
          {
            "term": "ISTH_2065_NGA_2012",
            "count": 1
          },
          {
            "term": "ISTH_2066_NGA_2012",
            "count": 1
          },
          {
            "term": "ISTH_2069_NGA_2012",
            "count": 1
          },
          {
            "term": "ISTH_2094_NGA_2012",
            "count": 1
          },
          {
            "term": "ISTH_2121_NGA_2012",
            "count": 1
          },
          {
            "term": "ISTH_2129_NGA_2012",
            "count": 1
          },
          {
            "term": "ISTH_2217_NGA_2012",
            "count": 1
          },
          {
            "term": "ISTH_2271_NGA_2012",
            "count": 1
          },
          {
            "term": "ISTH_2304_NGA_2012",
            "count": 1
          },
          {
            "term": "ISTH_2312_NGA_2012",
            "count": 1
          },
          {
            "term": "ISTH_2316_NGA_2012",
            "count": 1
          },
          {
            "term": "ISTH_2334_NGA_2012",
            "count": 1
          },
          {
            "term": "ISTH_2358_NGA_2012",
            "count": 1
          },
          {
            "term": "ISTH_2376_NGA_2012",
            "count": 1
          },
          {
            "term": "Kak-428_NGA_2012",
            "count": 1
          },
          {
            "term": "Komina_R16_MLI_2012",
            "count": 1
          },
          {
            "term": "LASV003_NGA_2008",
            "count": 1
          },
          {
            "term": "LASV0065-ONDO-2017_NGA_2017",
            "count": 1
          },
          {
            "term": "LASV0066-EDO-2017_NGA_2017",
            "count": 1
          },
          {
            "term": "LASV0067-EDO-2017_NGA_2017",
            "count": 1
          },
          {
            "term": "LASV0068-ONDO-2017_NGA_2017",
            "count": 1
          },
          {
            "term": "LASV0069-EDO-2017_NGA_2017",
            "count": 1
          },
          {
            "term": "LASV006_NGA_2008",
            "count": 1
          },
          {
            "term": "LASV0070-ONDO-2017_NGA_2017",
            "count": 1
          },
          {
            "term": "LASV0071-EDO-2017_NGA_2017",
            "count": 1
          },
          {
            "term": "LASV0072-ONDO-2017_NGA_2017",
            "count": 1
          },
          {
            "term": "LASV0073-EDO-2017_NGA_2017",
            "count": 1
          },
          {
            "term": "LASV0074-EDO-2017_NGA_2017",
            "count": 1
          },
          {
            "term": "LASV0075-EDO-2017_NGA_2017",
            "count": 1
          },
          {
            "term": "LASV0076-EDO-2017_NGA_2017",
            "count": 1
          },
          {
            "term": "LASV0077-EDO-2017_NGA_2017",
            "count": 1
          },
          {
            "term": "LASV0078-ONDO-2017_NGA_2017",
            "count": 1
          },
          {
            "term": "LASV0079-EDO-2017_NGA_2017",
            "count": 1
          },
          {
            "term": "LASV0080-ONDO-2017_NGA_2017",
            "count": 1
          },
          {
            "term": "LASV0081-EDO-2017_NGA_2017",
            "count": 1
          },
          {
            "term": "LASV0082-EDO-2017_NGA_2017",
            "count": 1
          },
          {
            "term": "LASV0083-ONDO-2017_NGA_2017",
            "count": 1
          },
          {
            "term": "LASV0084-EDO-2017_NGA_2017",
            "count": 1
          },
          {
            "term": "LASV0085-EDO-2017_NGA_2017",
            "count": 1
          },
          {
            "term": "LASV0086-EDO-2017_NGA_2017",
            "count": 1
          },
          {
            "term": "LASV0088-EDO-2017_NGA_2017",
            "count": 1
          },
          {
            "term": "LASV0089-ONDO-2017_NGA_2017",
            "count": 1
          },
          {
            "term": "LASV0090-ONDO-2017_NGA_2017",
            "count": 1
          },
          {
            "term": "LASV0091-EDO-2017_NGA_2017",
            "count": 1
          },
          {
            "term": "LASV0092-EDO-2017_NGA_2017",
            "count": 1
          },
          {
            "term": "LASV0093-EDO-2017_NGA_2017",
            "count": 1
          },
          {
            "term": "LASV0094-KOGI-2017_NGA_2017",
            "count": 1
          },
          {
            "term": "LASV0095-EDO-2017_NGA_2017",
            "count": 1
          },
          {
            "term": "LASV0096-ONDO-2017_NGA_2017",
            "count": 1
          },
          {
            "term": "LASV0097-EDO-2017_NGA_2017",
            "count": 1
          },
          {
            "term": "LASV0098-EDO-2017_NGA_2017",
            "count": 1
          },
          {
            "term": "LASV0099-EDO-2017_NGA_2017",
            "count": 1
          },
          {
            "term": "LASV0100-EDO-2017_NGA_2017",
            "count": 1
          },
          {
            "term": "LASV0101-EDO-2017_NGA_2017",
            "count": 1
          },
          {
            "term": "LASV0102-ONDO-2017_NGA_2017",
            "count": 1
          },
          {
            "term": "LASV0103-EDO-2017_NGA_2017",
            "count": 1
          },
          {
            "term": "LASV0104-ONDO-2017_NGA_2017",
            "count": 1
          },
          {
            "term": "LASV0105-ONDO-2017_NGA_2017",
            "count": 1
          },
          {
            "term": "LASV0106-ONDO-2017_NGA_2017",
            "count": 1
          },
          {
            "term": "LASV0107-ONDO-2017_NGA_2017",
            "count": 1
          },
          {
            "term": "LASV0108-ONDO-2017_NGA_2017",
            "count": 1
          },
          {
            "term": "LASV0109-ONDO-2017_NGA_2017",
            "count": 1
          },
          {
            "term": "LASV0110-ONDO-2017_NGA_2017",
            "count": 1
          },
          {
            "term": "LASV0111-ONDO-2017_NGA_2017",
            "count": 1
          },
          {
            "term": "LASV0112-ONDO-2017_NGA_2017",
            "count": 1
          },
          {
            "term": "LASV0114-ONDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0115-ONDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0117-ONDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0118-EDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0119-EDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0119.2-EDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0120-ONDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0121-ONDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0122-ONDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0123-ONDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0124-UNKNOWN-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0125-EBONYI-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0126-EBONYI-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0127-EBONYI-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0128-ONDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0129-ONDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0130-EDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0131-ONDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0132-ONDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0133-EDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0135-ONDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0136-ONDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0137-ONDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0138-KOGI-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0139-NASARAWA-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0140-EDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0141-EDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0142-IMO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0144-ONDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0145-EDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0146-EDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0147-EDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0148-UNKNOWN-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0149-KOGI-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0151-EDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0153-EDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0154-TARABA-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0155-EDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0155.2-EDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0156-ONDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0157-ONDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0158-EDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0159-KOGI-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0160-KOGI-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0161-ONDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0162-ONDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0163-ONDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0164-ONDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0165-EBONYI-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0166-ONDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0167-ONDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0168-DELTA-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0169-ONDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0170-ONDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0172-ONDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0173-EDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0174-EDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0175-EDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0176-EDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0177-EDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0179-UNKNOWN-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0180-UNKNOWN-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0181-UNKNOWN-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0182-EDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0183-ONDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0184-ONDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0185-ONDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0186-UNKNOWN-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0188-ONDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0190-ONDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0191-ONDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0192-ONDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0192.2-ONDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0193-DELTA-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0193.2-DELTA-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0194-EDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0195-EBONYI-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0197-EDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0198-EDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0199-EDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0199.2-EDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0200-UNKNOWN-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0201-ONDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0202-EDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0206-EDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0207-ONDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0208-EDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0209-KOGI-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0210-EDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0212-EDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0213-EDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0214-KOGI-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0215-ONDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0216-EDO-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV0217-DELTA-2018_NGA_2018",
            "count": 1
          },
          {
            "term": "LASV035_NGA_2009",
            "count": 1
          },
          {
            "term": "LASV042_NGA_2009",
            "count": 1
          },
          {
            "term": "LASV045_NGA_2009",
            "count": 1
          },
          {
            "term": "LASV046_NGA_2009",
            "count": 1
          },
          {
            "term": "LASV049_NGA_2009",
            "count": 1
          },
          {
            "term": "LASV052_NGA_2008",
            "count": 1
          },
          {
            "term": "LASV056_NGA_2008",
            "count": 1
          },
          {
            "term": "LASV058_NGA_2008",
            "count": 1
          },
          {
            "term": "LASV063_NGA_2009",
            "count": 1
          },
          {
            "term": "LASV1000_NGA_2009",
            "count": 1
          },
          {
            "term": "LASV1008_NGA_2009",
            "count": 1
          },
          {
            "term": "LASV1011_NGA_2009",
            "count": 1
          },
          {
            "term": "LASV1015_NGA_2009",
            "count": 1
          },
          {
            "term": "LASV1016_NGA_2009",
            "count": 1
          },
          {
            "term": "LASV221_NGA_2010",
            "count": 1
          },
          {
            "term": "LASV224_NGA_2010",
            "count": 1
          },
          {
            "term": "LASV225_NGA_2010",
            "count": 1
          },
          {
            "term": "LASV229_NGA_2010",
            "count": 1
          },
          {
            "term": "LASV237_NGA_2010",
            "count": 1
          },
          {
            "term": "LASV239_NGA_2010",
            "count": 1
          },
          {
            "term": "LASV241_NGA_2011",
            "count": 1
          },
          {
            "term": "LASV242_NGA_2010",
            "count": 1
          },
          {
            "term": "LASV245_NGA_2011",
            "count": 1
          },
          {
            "term": "LASV246_NGA_2010",
            "count": 1
          },
          {
            "term": "LASV250_NGA_2011",
            "count": 1
          },
          {
            "term": "LASV251_NGA_2010",
            "count": 1
          },
          {
            "term": "LASV253_NGA_2011",
            "count": 1
          },
          {
            "term": "LASV254_NGA_2011",
            "count": 1
          },
          {
            "term": "LASV256_NGA_2010",
            "count": 1
          },
          {
            "term": "LASV263_NGA_2011",
            "count": 1
          },
          {
            "term": "LASV267_NGA_2010",
            "count": 1
          },
          {
            "term": "LASV271_NGA_2010",
            "count": 1
          },
          {
            "term": "LASV274_NGA_2010",
            "count": 1
          },
          {
            "term": "LASV711_NGA_2009",
            "count": 1
          },
          {
            "term": "LASV716_NGA_2009",
            "count": 1
          },
          {
            "term": "LASV719_NGA_2009",
            "count": 1
          },
          {
            "term": "LASV736_NGA_2009",
            "count": 1
          },
          {
            "term": "LASV737_NGA_2009",
            "count": 1
          },
          {
            "term": "LASV738_NGA_2009",
            "count": 1
          },
          {
            "term": "LASV746_NGA_2009",
            "count": 1
          },
          {
            "term": "LASV966_NGA_2009",
            "count": 1
          },
          {
            "term": "LASV967_NGA_2009",
            "count": 1
          },
          {
            "term": "LASV969_NGA_2009",
            "count": 1
          },
          {
            "term": "LASV971_NGA_2009",
            "count": 1
          },
          {
            "term": "LASV975_NGA_2009",
            "count": 1
          },
          {
            "term": "LASV976_NGA_2009",
            "count": 1
          },
          {
            "term": "LASV977_NGA_2009",
            "count": 1
          },
          {
            "term": "LASV978_NGA_2009",
            "count": 1
          },
          {
            "term": "LASV979_NGA_2009",
            "count": 1
          },
          {
            "term": "LASV981_NGA_2009",
            "count": 1
          },
          {
            "term": "LASV982_NGA_2009",
            "count": 1
          },
          {
            "term": "LASV988_NGA_2009",
            "count": 1
          },
          {
            "term": "LASV989_NGA_2009",
            "count": 1
          },
          {
            "term": "LASV990_NGA_2009",
            "count": 1
          },
          {
            "term": "LASV991_NGA_2009",
            "count": 1
          },
          {
            "term": "LASV992_NGA_2009",
            "count": 1
          },
          {
            "term": "LASV993_NGA_2009",
            "count": 1
          },
          {
            "term": "LF11003_LBR_2011",
            "count": 1
          },
          {
            "term": "LF11011_LBR_2011",
            "count": 1
          },
          {
            "term": "LF13006_LBR_2013",
            "count": 1
          },
          {
            "term": "LF13007_LBR_2013",
            "count": 1
          },
          {
            "term": "LF16004_LBR_2016",
            "count": 1
          },
          {
            "term": "LF16016_LBR_2016",
            "count": 1
          },
          {
            "term": "LF17001_LBR_2017",
            "count": 1
          },
          {
            "term": "LF17007_LBR_2017",
            "count": 1
          },
          {
            "term": "LF17013_LBR_2017",
            "count": 1
          },
          {
            "term": "LF17019_LBR_2017",
            "count": 1
          },
          {
            "term": "LF17020_LBR_2017",
            "count": 1
          },
          {
            "term": "LF18001_LBR_2018",
            "count": 1
          },
          {
            "term": "LF18002_LBR_2018",
            "count": 1
          },
          {
            "term": "LF18037_LBR_2018",
            "count": 1
          },
          {
            "term": "LF18040_LBR_2018",
            "count": 1
          },
          {
            "term": "LF18041_LBR_2018",
            "count": 1
          },
          {
            "term": "LF18042_LBR_2018",
            "count": 1
          },
          {
            "term": "LM032_SLE_2010",
            "count": 1
          },
          {
            "term": "LM222_SLE_2010",
            "count": 1
          },
          {
            "term": "LM395_SLE_2009",
            "count": 1
          },
          {
            "term": "LM765_SLE_2012",
            "count": 1
          },
          {
            "term": "LM771_SLE_2012",
            "count": 1
          },
          {
            "term": "LM774_SLE_2012",
            "count": 1
          },
          {
            "term": "LM776_SLE_2012",
            "count": 1
          },
          {
            "term": "LM778_SLE_2012",
            "count": 1
          },
          {
            "term": "LM779_SLE_2012",
            "count": 1
          },
          {
            "term": "Mad39_GIN_2014",
            "count": 1
          },
          {
            "term": "Mad41_GIN_2014",
            "count": 1
          },
          {
            "term": "Mad62_GIN_2014",
            "count": 1
          },
          {
            "term": "Mad63_GIN_2014",
            "count": 1
          },
          {
            "term": "Mad69_GIN_2014",
            "count": 1
          },
          {
            "term": "Mad83_GIN_2014",
            "count": 1
          },
          {
            "term": "NL_SLE_2000",
            "count": 1
          },
          {
            "term": "Nig08-04_NGA_2008",
            "count": 1
          },
          {
            "term": "Nig08-A18_NGA_2008",
            "count": 1
          },
          {
            "term": "Nig08-A19_NGA_2008",
            "count": 1
          },
          {
            "term": "Nig08-A37_NGA_2008",
            "count": 1
          },
          {
            "term": "Nig08-A41_NGA_2008",
            "count": 1
          },
          {
            "term": "Nig08-A47_NGA_2008",
            "count": 1
          },
          {
            "term": "Nig12-17_NGA_2012",
            "count": 1
          },
          {
            "term": "Nig13-04_NGA_2013",
            "count": 1
          },
          {
            "term": "Nig14-03_NGA_2014",
            "count": 1
          },
          {
            "term": "Nig14-04_NGA_2014",
            "count": 1
          },
          {
            "term": "Nig14-06_NGA_2014",
            "count": 1
          },
          {
            "term": "Nig14-09_NGA_2014",
            "count": 1
          },
          {
            "term": "Nig14-19_NGA_2014",
            "count": 1
          },
          {
            "term": "Nig16-02_NGA_2016",
            "count": 1
          },
          {
            "term": "Nig16-11_NGA_2016",
            "count": 1
          },
          {
            "term": "Nig16-13_NGA_2016",
            "count": 1
          },
          {
            "term": "Nig16-14_NGA_2016",
            "count": 1
          },
          {
            "term": "ONM-299_NGA_2011",
            "count": 1
          },
          {
            "term": "ONM-314_NGA_2011",
            "count": 1
          },
          {
            "term": "ONM-700_NGA_2012",
            "count": 1
          },
          {
            "term": "Soromba_R_MLI_2009",
            "count": 1
          },
          {
            "term": "Togo/2016/7082_TGO_2016",
            "count": 1
          },
          {
            "term": "Z0947_SLE_2011",
            "count": 1
          },
          {
            "term": "Z0948_SLE_2011",
            "count": 1
          },
          {
            "term": "pinneo_NGA_1969",
            "count": 1
          }
        ],
        "_type": "terms",
        "other": 0,
        "missing": 0,
        "total": 609
      }
    },
    "max_score": 0,
    "took": 25,
    "total": 609,
    "hits": []
  }


  constructor(private exptPipe: ExperimentObjectPipe) { }

  ngAfterViewInit() {
    let hla_data = this.getIDs(this.hla, "HLA sequencing");
    let viral_data = this.getIDs(this.viral, "viral sequencing");


    let combo = hla_data.concat(viral_data);


    this.data = d3.nest()
      .key((d: any) => d.patientID)
      .rollup(function(values: any): any {
        return {
          count: values.length,
          ids: values.map(x => x.patientID),
          expts: values.map(x => x.measurementTechnique),
          expt_string: values.map(x => x.measurementTechnique).sort().join("_")
        }
      })
      .entries(combo);



    this.exptSummary = d3.nest()
      .key((d: any) => d.value.expt_string)
      .rollup(function(values: any): any {
        return {
          count: values.length,
          ids: d3.map(values.flatMap(x => x.value.ids), (d: any) => d).keys(),
          expts: d3.map(values.flatMap(x => x.value.expts), (d: any) => d).keys()
        }
      })
      .entries(this.data);

    this.exptSummary.sort((a, b) => b.value.count - a.value.count);

    this.createPlot();
    this.updatePlot();

  }

  getIDs(data, measurementTechnique: string) {
    return (data.facets['patientID.keyword'].terms.map(function(d) {
      return ({ measurementTechnique: measurementTechnique, patientID: d.term })
    })
    )
  }

  createPlot() {
    this.element = this.chartContainer.nativeElement;

    this.svg = d3.select(this.element)
      .append('svg')
      .attr("class", "upset-plot")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom + this.margin.separation)
    // .style('background', 'yellow');

    this.chart = this.svg.append("g")
      .attr("id", "bars--expt-count")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

    // --- x & y axes --
    this.x = d3.scaleBand()
      .rangeRound([0, this.width])
      .paddingInner(this.spacing)
      .paddingOuter(0.2);

    this.y = d3.scaleLinear()
      .rangeRound([this.height, 0]);

    this.y_dots = d3.scaleBand()
      .rangeRound([0, this.margin.bottom])
      .paddingInner(0)
      .paddingOuter(0);



  }

  updatePlot() {
    // transition
    var t = d3.transition()
      .duration(1000);

    // --- axes ---
    this.x.domain(this.exptSummary.map(d => d.key));
    this.y.domain([0, <any>d3.max(this.exptSummary, (d: any) => d.value.count)]);
    this.y_dots.domain(d3.map(this.exptSummary.flatMap(d => d.value.expts), d => d).keys());

    this.xAxis = d3.axisBottom(this.x).tickSizeOuter(0);
    this.yAxis = d3.axisLeft(this.y);
    this.yDotsAxis = d3.axisLeft(this.y_dots);

    // --- Create axes ---
    this.svg.append('g')
      .attr('class', 'dots-axis axis--y')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top + this.height + this.margin.separation })`)
      .call(this.yDotsAxis);

    // this.svg.append('g')
    //   .attr('class', 'allelebar-axis axis--y')
    //   .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
    //   .call(this.yAxis);
    //
    this.svg.append('g')
      .attr('class', 'bargraph-axis axis--x')
      .attr('transform', `translate(${this.margin.left}, ${this.height + this.margin.top})`)
      .call(this.xAxis);

    // --- Create bars ---
    let bars_data = this.chart
      .attr("class", 'bars')
      .selectAll("rect")
      .data(this.exptSummary);

    bars_data.exit()
      .remove();

    bars_data.enter().append("rect")
      .merge(bars_data)
      .attr("id", (d: any) => d.key)
      .attr("x", (d: any) => this.x(d.key))
      .attr("y", this.y(0))
      .attr("class", d => `rect--count ${this.exptPipe.transform(d.key)['dataset_id']}-rect`)
      .attr("width", this.x.bandwidth())
      .transition(t)
      .attr("height", (d: any) => this.y(0) - this.y(d.value.count))
      .attr("y", (d: any) => this.y(d.value.count));

    // --- Create SVG icons ---
    let svgGroup = this.chart
      .attr("class", 'svgs')
      .selectAll(".svg-icons")
      .data(this.y_dots.domain());

    svgGroup.exit()
      .remove();

    let svgGroups = svgGroup
      .enter().append("g")
      .attr("class", "svg-icons")
      // .attr('transform', d => `translate(${this.x(d.key)}, ${-this.margin.top})`)
      // .attr('transform', d => `translate(${this.x(d.key)}, ${this.y(d.value.count) - this.x.bandwidth() - this.icon_dy*2})`)
      .attr('transform', d => `translate(${-this.margin.left}, ${this.y_dots(d) + this.height + this.margin.separation})`);
      // .selectAll(".icon")
      // .data((d: any) => d.value.expts)
      // .enter().append("g")
      // .attr('transform', (_, i) => `translate(0, ${i * this.x.bandwidth() + this.icon_dy * i})`)
      // .attr('transform', (_, i) => `translate(0, ${-i * this.x.bandwidth() - this.icon_dy * i})`)
      let svgContainer = svgGroups.append("svg")
      .attr("width", this.y_dots.bandwidth()*0.9)
      .attr("height", this.y_dots.bandwidth()*0.9);

    svgContainer.append("rect")
      .attr("width", "100%")
      .attr("height", "100%")
      .style("rx", "5px")
      .style("ry", "5px")
      .attr("class", d => `svg-background mat-shadow ${this.exptPipe.transform(d)['dataset_id']}-rect`)

    svgContainer.append("use")
      .attr("class", d => `${this.exptPipe.transform(d)['dataset_id']}`)
      .attr("width", "80%")
      .attr("height", "80%")
      .attr('transform', d => `translate(${this.x.bandwidth() * 0.1}, ${this.x.bandwidth() * 0.1})`)
      .attr("xlink:href", d => `/assets/icons/icon-defs.svg#${this.exptPipe.transform(d)['dataset_id']}`)


      svgGroups.append("text")
      .attr("x", this.width + this.margin.left)
      .attr("dx", 8)
      .attr("y", this.y_dots.bandwidth()/2)
      .style("dominant-baseline", "central")
      .attr("class", "checkbox select-experiment")
      .text((_,i) => i == 0 ? "\uf14a" : "\uf0c8");

    // --- Create dots ---
    let dotGroup = this.chart
      .append("g")
      .attr('transform', d => `translate(${0}, ${this.height + this.y_dots.bandwidth()/2 + this.margin.separation})`)
      .attr("class", 'dot-group')
      .selectAll(".dots")
      .data(this.exptSummary);

    dotGroup.exit()
      .remove();

    dotGroup
      .enter().append("g")
      .attr("class", "dot-stack--all")
      .attr('transform', d => `translate(${this.x(d.key) + this.x.bandwidth() / 2}, ${0})`)
      .selectAll(".circle--all")
      .data(this.y_dots.domain())
      .enter().append("circle")
      .attr("class", "circle--all")
      .attr("r", Math.min(this.x.bandwidth() * 0.5, 10))
      .attr("cx", 0)
      .attr("cy", d => this.y_dots(d))

    dotGroup
      .enter().append("g")
      .attr("class", "dot-stack--selected")
      .attr('transform', d => `translate(${this.x(d.key) + this.x.bandwidth() / 2}, ${0})`)
      .selectAll(".circle--selected")
      .data((d: any) => d.value.expts)
      .enter().append("circle")
      .attr("class", d => `circle--selected ${this.exptPipe.transform(d)['dataset_id']}`)
      .attr("r", Math.min(this.x.bandwidth() * 0.5, 10))
      .attr("cx", 0)
      .attr("cy", d => this.y_dots(d))


      dotGroup.enter().append("text")
      .attr("x", d => this.x(d.key) + this.x.bandwidth() / 2)
      .attr("dx", 0)
      .attr("y", 0)
      .style("dominant-baseline", "central")
      .attr("class", "checkbox select-experiment")
      .text((_,i) => i == 0 ? "\uf14a" : "\uf0c8");


  }

}
