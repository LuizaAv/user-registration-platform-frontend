export interface PersonalInfoState {
  firstName: string;
  lastName: string;
  email: string;
  emailValid: boolean;
  emailChecking: boolean;
  touched: Record<string, boolean>;
}
