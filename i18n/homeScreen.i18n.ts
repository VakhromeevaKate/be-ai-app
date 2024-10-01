import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';

const i18n = new I18n({
    en: {
        today: 'Today',
        welcome: 'Welcome to Be.AI!',
        carbohydrates: 'Carbohydrates, %',
        fats: 'Fats, %',
        proteins: 'Proteins, %',
        fiber: 'Fiber, %',
        cup: 'cup',
        addMeal: 'Add Meal'
    },
    ru: {
        today: 'Сегодня',
        welcome: 'Добро пожаловать в Be.AI!',
        carbohydrates: 'Углеводы, %',
        fats: 'Жиры, %',
        proteins: 'Белки, %',
        fiber: 'Клетчатка, %',
        cup: 'стакан',
        addMeal: 'Добавить еду'
    },
  });

// get device locale with fallback to en:
i18n.locale = getLocales()[0].languageCode || 'en';

export {i18n};