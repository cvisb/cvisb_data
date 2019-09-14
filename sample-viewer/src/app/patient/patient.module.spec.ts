import { PatientModule } from './patient.module';

describe('PatientModule', () => {
  let patientModule: PatientModule;

  beforeEach(() => {
    patientModule = new PatientModule();
  });

  it('should create an instance', () => {
    expect(patientModule).toBeTruthy();
  });
});
