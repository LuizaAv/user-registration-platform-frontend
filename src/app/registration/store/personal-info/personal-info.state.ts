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

export const initialPersonalInfoState: PersonalInfoState = {
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
