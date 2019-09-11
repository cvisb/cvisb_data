import { PatientTimepointsModule } from './patient-timepoints.module';

describe('PatientTimepointsModule', () => {
  let patientTimepointsModule: PatientTimepointsModule;

  beforeEach(() => {
    patientTimepointsModule = new PatientTimepointsModule();
  });

  it('should create an instance', () => {
    expect(patientTimepointsModule).toBeTruthy();
  });
});
