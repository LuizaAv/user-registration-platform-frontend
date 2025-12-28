export interface Language {
  name: string;
  proficiency: string;
}

export interface PreferencesState {
  careerGoals: string[];
  companySize: string[];
  availabilityDate: string;
  timezone: string;
  languages: Language[];
  newsletterSubscriptions: {
    weeklyDigest: boolean;
    productUpdates: boolean;
    industryNews: boolean;
  };
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
      languages: [],
      newsletterSubscriptions: {
        weeklyDigest: false,
        productUpdates: false,
        industryNews: false,
      },
      touched: {},
      errors: {},
    };
  }
  const stored = localStorage.getItem('preferences');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
    }
  }
  return {
    careerGoals: [],
    companySize: [],
    availabilityDate: '',
    timezone: '',
    languages: [],
    newsletterSubscriptions: {
      weeklyDigest: false,
      productUpdates: false,
      industryNews: false,
    },
    touched: {},
    errors: {},
  };
})();