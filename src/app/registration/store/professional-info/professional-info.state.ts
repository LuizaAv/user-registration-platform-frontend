export interface ProfessionalInfoState {
  jobTitle: string;
  industry: string;
  yearsOfExperience: number;
  employmentStartDate: string;
  employmentEndDate: string;
  currentlyEmployed: boolean;
  educationLevel: string;
  skills: string[];
  linkedinUrl: string;
  touched: Record<string, boolean>;
  errors: Record<string, string | null>;
}

export const initialProfessionalInfoState: ProfessionalInfoState = (() => {
  if (typeof window === 'undefined') {
    return {
      jobTitle: '',
      industry: '',
      yearsOfExperience: 0,
      employmentStartDate: '',
      employmentEndDate: '',
      currentlyEmployed: false,
      educationLevel: '',
      skills: [],
      linkedinUrl: '',
      touched: {},
      errors: {},
    };
  }
  const stored = localStorage.getItem('professionalInfo');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      // If parsing fails, use default
    }
  }
  return {
    jobTitle: '',
    industry: '',
    yearsOfExperience: 0,
    employmentStartDate: '',
    employmentEndDate: '',
    currentlyEmployed: false,
    educationLevel: '',
    skills: [],
    linkedinUrl: '',
    touched: {},
    errors: {},
  };
})();