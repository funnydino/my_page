import { localesData } from './localesData.js';

/**
 * Получить текущую локаль страницы
 * @returns {string}
 */
const getCurrentPageLocale = () => document.documentElement.lang;

/**
 * Обновить aria-атрибут у кастомного Select'а
 * @param {Element} el
 * @returns {void}
 */
const updateCustomSelectAriaLabel = (el) => {
    const elementAriaLabel = el.getAttribute('aria-label');

    el.closest('.choices').setAttribute('aria-label', elementAriaLabel);
};

/**
 * Обработка кастомного Select'а choices.js
 * @returns {void}
 */
const customSelect = () => {
    const element = document.querySelector('.header__nav-select');
    // @ts-ignore
    // eslint-disable-next-line no-unused-vars, no-undef
    const choices = new Choices(element, {
        searchEnabled: false,
        itemSelectText: '',
    });

    updateCustomSelectAriaLabel(element);
};

/**
 * Перевести строку
 * @param {string} key
 * @param {string} [defVal]
 * @returns {string}
 */
export const translateStr = (key, defVal = '') => {
    const currentDocLang = getCurrentPageLocale();

    return localesData[key] !== undefined ? localesData[key][currentDocLang] : defVal;
};

/**
 * Изменить локаль сайта
 * @param {string} docLang
 * @returns {void}
 */
const changeSiteLocale = (docLang) => {
    if (docLang === 'en' || docLang === 'ru') {
        document.documentElement.lang = docLang;
        /** @type {HTMLMetaElement} */
        const documentDescription = document.querySelector('[name=description]');
        const elementsToTranslate = document.querySelectorAll('[data-translate]');
        const navMenuBtn = document.querySelector('.menu-btn');
        const languageSelect = document.querySelector('#select-language');
        const feedbackForm = document.querySelector('#feedback');

        documentDescription.content = localesData.siteDescr[docLang];
        document.title = localesData.siteTitle[docLang];
        navMenuBtn.ariaLabel = localesData.menu[docLang];
        languageSelect.ariaLabel = localesData.languageSelection[docLang];
        feedbackForm.ariaLabel = localesData.feedbackForm[docLang];

        updateCustomSelectAriaLabel(languageSelect);

        elementsToTranslate.forEach((element) => {
            /** @type {string} */
            const attributeValue = element.attributes['data-translate'].value;
            const attributeLocaleData = localesData[attributeValue];

            if (attributeLocaleData !== undefined) {
                if (element instanceof HTMLImageElement) {
                    // eslint-disable-next-line no-param-reassign
                    element.alt = attributeLocaleData[docLang];
                } else if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
                    // eslint-disable-next-line no-param-reassign
                    element.placeholder = attributeLocaleData[docLang];
                } else {
                    // eslint-disable-next-line no-param-reassign
                    element.innerHTML = attributeLocaleData[docLang];
                }
            }
        });
    }
};

(() => {
    document.addEventListener('DOMContentLoaded', () => {
        const currentDocLang = getCurrentPageLocale();

        if (currentDocLang !== 'en') changeSiteLocale(currentDocLang);

        /** @type {HTMLSelectElement} */
        const languageSelect = document.querySelector('#select-language');

        languageSelect.value = currentDocLang;
        languageSelect.addEventListener('change', (event) => {
            /** @type {string} */
            // @ts-ignore
            const selectedLanguage = event.target.value;

            changeSiteLocale(selectedLanguage);
        });

        customSelect();
    });
})();
