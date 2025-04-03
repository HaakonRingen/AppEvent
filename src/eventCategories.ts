import translations, { Language } from "./translations";

export const getEventCategories = (language: Language): string[] => {
  return Object.values(translations[language].eventCategories);
};
