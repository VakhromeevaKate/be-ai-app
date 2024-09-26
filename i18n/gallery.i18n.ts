import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';

const i18n = new I18n({
    en: {
        pickAnImage: "Pick an image from gallery",
        recognizeImage: "Recognize image",
        takePhoto: "Take photo from camera",
        cancel: "Cancel",
        saveMeal: "Save meal",
        Dairy: "Dairy",
        Fruits: "Fruits",
        Grains: "Grains",
        Protein: "Protein",
        Vegetables: "Vegetables",
    },
    ru: {
        pickAnImage: "Выберите фото из галереи",
        recognizeImage: "Распознать",
        takePhoto: "Сфотографировать",
        cancel: "Отмена",
        saveMeal: "Сохранить прием пищи",
        Dairy: "Молочные продукты",
        Fruits: "Фрукты",
        Grains: "Крупы",
        Protein: "Белки",
        Vegetables: "Овощи",
    },
  });

// get device locale with fallback to en:
i18n.locale = getLocales()[0].languageCode || 'en';

export {i18n};