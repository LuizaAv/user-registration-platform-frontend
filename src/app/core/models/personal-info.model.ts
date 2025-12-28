export interface PersonalInfoState {
  firstName: string;
  lastName: string;
  email: string;
  emailValid: boolean;
  emailChecking: boolean;
  touched: Record<string, boolean>;
}

export interface EmailValidationResponse {
  available: boolean;
  message: string;
}

export interface ReferenceItem {
  id: string;
  name: string;
  category?: string;
}

export interface StepStatus {
  personalInfo: boolean;
  professional: boolean;
  preferences: boolean;
  verification: boolean;
  complete: boolean;
}