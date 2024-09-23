import { AsYouType, isValidPhoneNumber } from 'libphonenumber-js';

export function matchIsValidTel(text: string): boolean {
  const phone = new AsYouType();
  phone.input(text);
  const country = phone.getCountry();

  if (!country) {
    return false;
  }

  return isValidPhoneNumber(text);
}
