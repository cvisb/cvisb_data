export class Organization {
  public name;
  public alternateName?: string;
  public address?: PostalAddress;
  public contactPoint?: ContactPoint;
  public parentOrganization?: Organization;
  public url: string;
  public "@context"?: string;
  public "@type"?: string;

  constructor(
    name: string = null,
    alternateName: string = null,
    address: PostalAddress = null,
    contactPoint: ContactPoint = null,
    parentOrganization: Organization = null,
    url: string = null,
    context: string = null,
    type: string = null
  ) {
    this.name = name;
    this.alternateName = alternateName;
    this.address = address;
    this.contactPoint = contactPoint;
    this.parentOrganization = parentOrganization;
    this.url = url;
    this['@context'] = context;
    this['@type'] = type;
  }

}

// export class Organization {
//   name: string;
//   alternateName?: string;
//   address?: PostalAddress;
//   contactPoint?: ContactPoint;
//   parentOrganization?: Organization;
//   url?: URL;
//   "@context"?: URL;
//   "@type"?: string;
// }

export class PostalAddress {
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: Country;
  "@context"?: string;
  "@type"?: string;
}

export class ContactPoint {
  contactType: string;
  email: string;
  url: string;
  "@context"?: string;
  "@type"?: string;
}

export class Country {
  name?: string;
  identifier: string;
  "@context"?: string;
  "@type"?: string;
}
