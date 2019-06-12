// TODO: auto-generate from schema yaml files
export abstract class SchemaDefs {
  static patientProperties: string[] = ["alternateIdentifier", "patientID", "cohort", "outcome", "infectionYear", "country.identifier", "gID", "sID"];
  static sampleProperties: string[] = ["sampleType", "location.lab", "species", "location.numAliquots", "sampleGroup"];
  static exptProperties: string[] = ["measurementTechnique"];
}
