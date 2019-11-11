import { Component, OnInit } from '@angular/core';

import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { GetDatacatalogService, getDatasetsService } from '../../_services';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-citation',
  templateUrl: './citation.component.html',
  styleUrls: ['./citation.component.scss']
})

export class CitationComponent implements OnInit {
  currentYear: Date = new Date();
  cvisbCatalog: Object;
  host_url: string = environment.host_url;

  patients = {
    sources: [
      {
        type: "publisher",
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "technical support",
          "email": "info@cvisb.org",
          "url": "https://cvisb.org/"
        },
        "name": "Center for Viral Systems Biology",
        "url": "https://cvisb.org/"
      }]
  }

  experiments = [{
    dataset_name: "HLA",
    includedInDataset: "hla",
    sources: [
      {
        type: "publisher",
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "technical support",
          "email": "info@cvisb.org",
          "url": "https://cvisb.org/"
        },
        "name": "Center for Viral Systems Biology",
        "url": "https://cvisb.org/"
      },
      {
        "type": "citation",
        "author": [
          {
            "familyName": "Andersen",
            "givenName": "Kristian G"
          },
          {
            "familyName": "Shapiro",
            "givenName": "B Jesse"
          },
          {
            "familyName": "Matranga",
            "givenName": "Christian B"
          },
          {
            "familyName": "Sealfon",
            "givenName": "Rachel"
          },
          {
            "familyName": "Lin",
            "givenName": "Aaron E"
          },
          {
            "familyName": "Moses",
            "givenName": "Lina M"
          },
          {
            "familyName": "Folarin",
            "givenName": "Onikepe A"
          },
          {
            "familyName": "Goba",
            "givenName": "Augustine"
          },
          {
            "familyName": "Odia",
            "givenName": "Ikponmwonsa"
          },
          {
            "familyName": "Ehiane",
            "givenName": "Philomena E"
          },
          {
            "familyName": "Momoh",
            "givenName": "Mambu"
          },
          {
            "familyName": "England",
            "givenName": "Eleina M"
          },
          {
            "familyName": "Winnicki",
            "givenName": "Sarah"
          },
          {
            "familyName": "Branco",
            "givenName": "Luis M"
          },
          {
            "familyName": "Gire",
            "givenName": "Stephen K"
          },
          {
            "familyName": "Phelan",
            "givenName": "Eric"
          },
          {
            "familyName": "Tariyal",
            "givenName": "Ridhi"
          },
          {
            "familyName": "Tewhey",
            "givenName": "Ryan"
          },
          {
            "familyName": "Omoniwa",
            "givenName": "Omowunmi"
          },
          {
            "familyName": "Fullah",
            "givenName": "Mohammed"
          },
          {
            "familyName": "Fonnie",
            "givenName": "Richard"
          },
          {
            "familyName": "Fonnie",
            "givenName": "Mbalu"
          },
          {
            "familyName": "Kanneh",
            "givenName": "Lansana"
          },
          {
            "familyName": "Jalloh",
            "givenName": "Simbirie"
          },
          {
            "familyName": "Gbakie",
            "givenName": "Michael"
          },
          {
            "familyName": "Saffa",
            "givenName": "Sidiki"
          },
          {
            "familyName": "Karbo",
            "givenName": "Kandeh"
          },
          {
            "familyName": "Gladden",
            "givenName": "Adrianne D"
          },
          {
            "familyName": "Qu",
            "givenName": "James"
          },
          {
            "familyName": "Stremlau",
            "givenName": "Matthew"
          },
          {
            "familyName": "Nekoui",
            "givenName": "Mahan"
          },
          {
            "familyName": "Finucane",
            "givenName": "Hilary K"
          },
          {
            "familyName": "Tabrizi",
            "givenName": "Shervin"
          },
          {
            "familyName": "Vitti",
            "givenName": "Joseph J"
          },
          {
            "familyName": "Birren",
            "givenName": "Bruce"
          },
          {
            "familyName": "Fitzgerald",
            "givenName": "Michael"
          },
          {
            "familyName": "McCowan",
            "givenName": "Caryn"
          },
          {
            "familyName": "Ireland",
            "givenName": "Andrea"
          },
          {
            "familyName": "Berlin",
            "givenName": "Aaron M"
          },
          {
            "familyName": "Bochicchio",
            "givenName": "James"
          },
          {
            "familyName": "Tazon-Vega",
            "givenName": "Barbara"
          },
          {
            "familyName": "Lennon",
            "givenName": "Niall J"
          },
          {
            "familyName": "Ryan",
            "givenName": "Elizabeth M"
          },
          {
            "familyName": "Bjornson",
            "givenName": "Zach"
          },
          {
            "familyName": "Milner",
            "givenName": "Danny A"
          },
          {
            "familyName": "Lukens",
            "givenName": "Amanda K"
          },
          {
            "familyName": "Broodie",
            "givenName": "Nisha"
          },
          {
            "familyName": "Rowland",
            "givenName": "Megan"
          },
          {
            "familyName": "Heinrich",
            "givenName": "Megan"
          },
          {
            "familyName": "Akdag",
            "givenName": "Marjan"
          },
          {
            "familyName": "Schieffelin",
            "givenName": "John S"
          },
          {
            "familyName": "Levy",
            "givenName": "Danielle"
          },
          {
            "familyName": "Akpan",
            "givenName": "Henry"
          },
          {
            "familyName": "Bausch",
            "givenName": "Daniel G"
          },
          {
            "familyName": "Rubins",
            "givenName": "Kathleen"
          },
          {
            "familyName": "McCormick",
            "givenName": "Joseph B"
          },
          {
            "familyName": "Lander",
            "givenName": "Eric S"
          },
          {
            "familyName": "Günther",
            "givenName": "Stephan"
          },
          {
            "familyName": "Hensley",
            "givenName": "Lisa"
          },
          {
            "familyName": "Okogbenin",
            "givenName": "Sylvanus"
          },
          {
            "familyName": "Viral Hemorrhagic Fever Consortium",
            "givenName": null
          },
          {
            "familyName": "Schaffner",
            "givenName": "Stephen F"
          },
          {
            "familyName": "Okokhere",
            "givenName": "Peter O"
          },
          {
            "familyName": "Khan",
            "givenName": "S Humarr"
          },
          {
            "familyName": "Grant",
            "givenName": "Donald S"
          },
          {
            "familyName": "Akpede",
            "givenName": "George O"
          },
          {
            "familyName": "Asogun",
            "givenName": "Danny A"
          },
          {
            "familyName": "Gnirke",
            "givenName": "Andreas"
          },
          {
            "familyName": "Levin",
            "givenName": "Joshua Z"
          },
          {
            "familyName": "Happi",
            "givenName": "Christian T"
          },
          {
            "familyName": "Garry",
            "givenName": "Robert F"
          },
          {
            "familyName": "Sabeti",
            "givenName": "Pardis C"
          }
        ],
        "datePublished": "2015-08-13",
        "doi": "10.1016/j.cell.2015.07.020",
        "identifier": "pmid:26276630",
        "issn": "0092-8674",
        "issueNumber": "4",
        "journalName": "Cell",
        "journalNameAbbrev": "Cell",
        "name": "Clinical Sequencing Uncovers Origins and Evolution of Lassa Virus",
        "pagination": "738-50",
        "pmid": "26276630",
        "url": "https://www.ncbi.nlm.nih.gov/pubmed/?term=26276630",
        "volumeNumber": "162"
      }
    ]
  }];

  constructor(
    private titleSvc: Title,
    private route: ActivatedRoute,
    private dataCatalogSvc: GetDatacatalogService,
    private datasetSvc: getDatasetsService
  ) {
    // set page title
    this.titleSvc.setTitle(this.route.snapshot.data.title);

    this.cvisbCatalog = this.dataCatalogSvc.cvisbCatalog;
  }

  ngOnInit() {
    this.datasetSvc.getDatasetSources().subscribe(sources => {
      console.log(sources)
    });
  }

}
