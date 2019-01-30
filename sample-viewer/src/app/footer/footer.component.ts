import { Component, OnInit, Input } from '@angular/core';

import { Organization } from '../_models';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})

export class FooterComponent implements OnInit {
  @Input() links: Object[];

  contactInfo: Organization = {
    "@context": "http://schema.org",
    "@type": "Organization",
    url: "https://cvisb.org/",
    name: "Center for Viral Systems Biology",
    alternateName: "CViSB",
    address: {
      "@type": "PostalAddress",
      streetAddress: "10550 North Torrey Pines Road, SGM-300",
      addressLocality: "La Jolla",
      addressRegion: "California",
      postalCode: "92037",
      addressCountry: {
        "@type": "Country",
        name: "United States",
        identifier: "US"
      }
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "info@cvisb.org",
      url: "https://cvisb.org/"
    },
    parentOrganization: {
      "@type": "Organization",
      name: "Scripps Research",
      url: "https://www.scripps.edu/"
    }
  }

  social_links: Object[] = [
    { name: "twitter", icon: "fa-twitter", url: "https://twitter.com/cvisb" },
    { name: "github", icon: "fa-github-alt", url: "https://github.com/cvisb" },
    { name: "instagram", icon: "fa-instagram", url: "https://www.instagram.com/cvisb" }
  ];

  dataUpdated: string = "2019-01-24";
  currentYear: number;


  constructor() { }

  ngOnInit() {
    let today = new Date();
    this.currentYear = today.getFullYear();


    // console.log(Object.getOwnPropertyNames(new Organization()))
  }
}
