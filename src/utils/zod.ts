import { z } from 'zod';

import toCapitalize from './toCapitalize';
import { matchIsValidTel } from './validation/match-is-valid-tel';

export const zodBaseString = z.string({ invalid_type_error: 'Geçerli değer girin' });

export const zodName = zodBaseString
  .trim()
  .min(2, 'Bu alan en az 2 karakter olabilir')
  .transform((x) => toCapitalize(x));

export const zodId = z.coerce.number().nonnegative();

export const zodEmail = zodBaseString.toLowerCase().email('Email adresi geçersiz');

export const zodPassword = zodBaseString.min(6, 'En az 6 karakter girin');

export const zodPhone = zodBaseString
  .refine((x) => matchIsValidTel(x), { message: 'Telefon numarası geçersiz' })
  .transform((x) => x.replace(' ', ''));

export const zodBoolean = zodBaseString
  .toLowerCase()
  .transform((x) => x === 'true')
  .pipe(z.boolean());

export const zodCapitalize = zodBaseString.trim().transform((arg) => toCapitalize(arg));

export const zodAutocomplete = zodBaseString
  .min(1, 'En az 1 karakter girin')
  .trim()
  .transform((x) => toCapitalize(x));

export const zodDateRange = z.object({
  start: z.coerce.date({ invalid_type_error: 'Geçerli değer girin' }).nullish(),
  end: z.coerce.date({ invalid_type_error: 'Geçerli değer girin' }).nullish(),
});

export const zodNumberRange = z.coerce
  .number({ invalid_type_error: 'Geçerli değer girin' })
  .array()
  .max(2, 'Geçerli değer girin');
