export class RequestParam {
  field: string;
  value: any;

  constructor(field, value) {
    console.log('constructing: ' + field)
    this.field = field;
    this.value = value;
  }

  // collapse to ES syntax
  // https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html
  // Example compound query:http://18.235.94.96/api/sample/query?q=patient_id:("S024") location:KGH
  collapse() {
    if (Array.isArray(this.value)) {
      return (`${this.field}:\(\"${this.value.join('" "')}\"\)`)
    } else {
      return (`${this.field}:\"${this.value}\"`)
    }

  }
}
