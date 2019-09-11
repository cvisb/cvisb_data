import { PatientPageModule } from './patient-page.module';

describe('PatientPageModule', () => {
  let patientPageModule: PatientPageModule;

  beforeEach(() => {
    patientPageModule = new PatientPageModule();
  });

  it('should create an instance', () => {
    expect(patientPageModule).toBeTruthy();
  });
});
