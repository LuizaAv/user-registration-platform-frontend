export interface PreferencesState {
  careerGoals: string[];
  companySize: string[];
  availabilityDate: string;
  timezone: string;
  touched: Record<string, boolean>;
  errors: Record<string, string | null>;
}

export const initialPreferencesState: PreferencesState = (() => {
  if (typeof window === 'undefined') {
    return {
      careerGoals: [],
      companySize: [],
      availabilityDate: '',
      timezone: '',
      touched: {},
      errors: {},
    };
  }
  const stored = localStorage.getItem('preferences');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      // If parsing fails, use default
    }
  }
  return {
    careerGoals: [],
    companySize: [],
    availabilityDate: '',
    timezone: '',
    touched: {},
    errors: {},
  };
})();