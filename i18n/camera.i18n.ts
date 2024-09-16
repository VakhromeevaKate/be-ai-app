import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';

const i18n = new I18n({
    en: {
        permissionTitle: "We need your permission to show the camera",
        permissionAction: "Grant permission",
    },
    ru: {
        permissionTitle: "Приложению требуется разрешение на использование камеры",
        permissionAction: "Разрешить",
    },
  });

// get device locale with fallback to en:
i18n.locale = getLocales()[0].languageCode || 'en';

export {i18n};