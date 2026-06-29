export type ValidationResult = { valid: true } | { valid: false; error: string };

export function validateRequired(value: unknown, fieldName: string): ValidationResult {
  if (value === null || value === undefined || value === '') {
    return { valid: false, error: `${fieldName} is required` };
  }
  return { valid: true };
}

export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email address' };
  }
  return { valid: true };
}

export function validatePositiveNumber(value: number, fieldName: string): ValidationResult {
  if (isNaN(value) || value < 0) {
    return { valid: false, error: `${fieldName} must be a positive number` };
  }
  return { valid: true };
}

export function validateMinLength(value: string, min: number, fieldName: string): ValidationResult {
  if (value.trim().length < min) {
    return { valid: false, error: `${fieldName} must be at least ${min} characters` };
  }
  return { valid: true };
}

export function validatePhoneNumber(phone: string): ValidationResult {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length < 7 || cleaned.length > 15) {
    return { valid: false, error: 'Invalid phone number format' };
  }
  return { valid: true };
}

export function collectErrors(results: ValidationResult[]): string[] {
  return results
    .filter((r): r is { valid: false; error: string } => !r.valid)
    .map(r => r.error);
}

export function validateCompanyInput(data: {
  company_name: string;
  tax_number: string;
  commercial_register: string;
}): string[] {
  return collectErrors([
    validateRequired(data.company_name, 'Company Name'),
    validateMinLength(data.company_name, 3, 'Company Name'),
    validateRequired(data.tax_number, 'Tax Number'),
    validateRequired(data.commercial_register, 'Commercial Register'),
  ]);
}
