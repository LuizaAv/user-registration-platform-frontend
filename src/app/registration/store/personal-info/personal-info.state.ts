export interface PersonalInfoState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  avatar: string | null;
  bio: string;
  touched: Record<string, boolean>;
  errors: Record<string, string | null>;
}

export const initialPersonalInfoState: PersonalInfoState = (() => {
  if (typeof window === 'undefined') {
    return {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dob: '',
      gender: '',
      avatar: null,
      bio: '',
      touched: {},
      errors: {},
    };
  }
  const stored = localStorage.getItem('personalInfo');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      // If parsing fails, use default
    }
  }
  return {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    avatar: null,
    bio: '',
    touched: {},
    errors: {},
  };
})();
