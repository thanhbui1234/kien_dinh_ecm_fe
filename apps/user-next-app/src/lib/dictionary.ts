import viDict from '../dictionaries/vi.json';
import enDict from '../dictionaries/en.json';
import { Locale } from './locale';

export type Dictionary = typeof viDict;

const dictionaries: Record<Locale, Dictionary> = {
  vi: viDict,
  en: enDict,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] || dictionaries.vi;
}
