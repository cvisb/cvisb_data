export class RequestParam {
  field: string;
  value: any;

  constructor(field, value) {
    console.log('constructing: ' + field)
    this.field = field;
    this.value = value;
  }


}

export class RequestParamArray extends Array<RequestParam> {
  constructor(items) {
    super();
    this.push(...items)
  }
  // collapse(): any {
  //   console.log("collapsing")
  //   return('string')
  // }

}

// export class RequestParamArray extends Array<RequestParam> {
//   private constructor(items?: Array<RequestParam>) {
//     super(...items)
//     Object.setPrototypeOf(this, Object.create(RequestParamArray.prototype));
//   }
//
//   //   create(): RequestParamArray {
//   //     return Object.create(RequestParamArray.prototype);
//   // }
//
//
//   // collapse Object to ES syntax string
//   // https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html
//   // Example compound query:http://18.235.94.96/api/sample/query?q=patient_id:("S024") location:KGH
//   collapse(): any {
//     console.log('collapsing')
//     return (this);
//     // if (Array.isArray(this.value)) {
//     //   return (`${this.field}:\(\"${this.value.join('" "')}\"\)`)
//     // } else {
//     //   return (`${this.field}:\"${this.value}\"`)
//     // }
//
//   }
// }
