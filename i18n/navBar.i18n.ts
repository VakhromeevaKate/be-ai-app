import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';

const i18n = new I18n({
    en: {
        diary: "Diary",
        takePhoto: "Take photo",
        profile: "Profile"
    },
    ru: {
        diary: "Дневник",
        takePhoto: "Сделать фото",
        profile: "Профиль"
    },
  });

// get device locale with fallback to en:
i18n.locale = getLocales()[0].languageCode || 'en';

export {i18n};