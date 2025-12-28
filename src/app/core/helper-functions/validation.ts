export function isValidEmail(email: string): boolean {
  if (!email) return false;

  const basicRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  if (!basicRegex.test(email)) return false;

  const [, domain] = email.toLowerCase().split('@');

  if (domain.startsWith('gmail.')) {
    return domain === 'gmail.com';
  }

  return true;
}

export function isValidPhoneNumber(phone: string): boolean {
  if (!phone) return false;

  const phoneRegex = /^\+\d{1,4}[\s\-\(\)]*\d[\s\-\(\)\d]*$/;

  return phoneRegex.test(phone);
}

export function isValidLLinkedInUrl(url: string): string | null {
  if (!url) return null;

  const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/;
  if (!linkedinRegex.test(url)) {
    return 'Please enter a valid LinkedIn profile URL';
  }
  return null;
}

export function validateJobTitle(value: string): string | null {
  if (!value || value.trim().length === 0) {
    return 'Job title is required';
  }
  return null;
}

export function validateIndustry(value: string): string | null {
  if (!value || value.trim().length === 0) {
    return 'Please select an industry';
  }
  return null;
}

export function validateEducationLevel(value: string): string | null {
  if (!value || value.trim().length === 0) {
    return 'Please select your education level';
  }
  return null;
}

export function isValidName(name: string): boolean {
  if (!name) return false;
  const nameRegex = /^[\p{L} '-]{2,50}$/u;
  return nameRegex.test(name);
}
