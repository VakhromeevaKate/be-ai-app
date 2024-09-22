import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';

const i18n = new I18n({
    en: {
        pickAnImage: "Pick an image from gallery",
        recognizeImage: "Recognize image",
        takePhoto: "Take photo from camera",
        cancel: "Cancel",
        saveMeal: "Save meal"
    },
    ru: {
        pickAnImage: "Выберите фото из галереи",
        recognizeImage: "Распознать",
        takePhoto: "Сфотографировать",
        cancel: "Отмена",
        saveMeal: "Сохранить прием пищи"
    },
  });

// get device locale with fallback to en:
i18n.locale = getLocales()[0].languageCode || 'en';

export {i18n};