/* eslint-disable id-length, max-lines, no-plusplus */
import { translateStr } from './locales.js';

(() => {
    // eslint-disable-next-line max-lines-per-function
    document.addEventListener('DOMContentLoaded', () => {
        const body = document.querySelector('.body');

        /** @type {HTMLElement[]} */
        const fixBlocks = Array.from(document.querySelectorAll('.fix-block'));

        /**
         * Disable Scroll (убираем прыжок при открытии меню или модального окна)
         * @returns {void}
         */
        const disableScroll = () => {
            const paddingOffset = `${window.innerWidth - document.body.offsetWidth}px`;

            body.classList.add('disable--scroll');

            fixBlocks.forEach((el) => {
                el.style.paddingRight = paddingOffset;
            });

            document.body.style.paddingRight = paddingOffset;
        };

        /**
         * Enable Scroll (убираем прыжок при открытии меню или модального окна)
         * @returns {void}
         */
        const enableScroll = () => {
            body.classList.remove('disable--scroll');

            fixBlocks.forEach((el) => {
                el.style.paddingRight = '0px';
            });

            document.body.style.paddingRight = '0px';
        };

        // Создаём анимацию на GSAP:
        const openMenu = gsap.timeline({
            paused: true,
            reversed: true,
        });
        const openPopup = gsap.timeline({
            paused: true,
            reversed: true,
        });

        openMenu.set('.overlay-menu', {
            top: 0,
        })
            .from('.overlay-menu__link', {
                duration: 0.7,
                opacity: 0,
            })
            .to('.overlay-menu__link', {
                duration: 0.7,
                width: '100%',
                ease: Power4.easeInOut,
            }, '-=.7')
            .from('.overlay-menu__link span', {
                duration: 0.7,
                opacity: 0,
                y: 25,
            });

        openPopup.from('.popup', {
            duration: 1.2,
            opacity: 0,
            ease: 'expo.out',
            y: -150,
        })
            .from('.popup', {
                duration: 0.5,
                scale: 0.85,
            }, '-=1');

        const menuBtn = document.querySelector('.menu-btn');
        const navMenu = document.querySelector('.overlay-menu');

        /**
         * Открытие навигационного меню
         * @returns {void}
         */
        const menuOpen = () => {
            disableScroll();
            body.classList.add('body--lock');
            navMenu.classList.add('overlay-menu--open');
            openMenu.play();
        };

        /**
         * Закрытие навигационного меню
         * @returns {void}
         */
        const menuClose = () => {
            navMenu.classList.remove('overlay-menu--open');
            openMenu.reverse();

            setTimeout(() => {
                body.classList.remove('body--lock');
                enableScroll();
            }, openMenu.duration() * 1000);
        };

        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('menu-btn--close');

            if (menuBtn.classList.contains('menu-btn--close')) {
                menuOpen();
            } else {
                menuClose();
            }
        });

        /**
         * Easing Function
         * @param {number} t
         * @param {number} b
         * @param {number} c
         * @param {number} d
         * @returns {number}
         */
        const easeInOutCubic = (t, b, c, d) => {
            // eslint-disable-next-line no-param-reassign
            t /= d / 2;

            // eslint-disable-next-line no-mixed-operators
            if (t < 1) return c / 2 * t * t * t + b;

            // eslint-disable-next-line no-param-reassign
            t -= 2;

            // eslint-disable-next-line no-mixed-operators
            return c / 2 * (t * t * t + 2) + b;
        };

        /**
         *
         * @param {HTMLElementEvent<HTMLAnchorElement>} event
         * @returns {void}
         */
        function smoothScroll(event) {
            event.preventDefault();
            const targetId = event.currentTarget.getAttribute('href') === '#'
                ? 'header'
                : event.currentTarget.getAttribute('href');
            /** @type {HTMLElement} */
            const targetElement = document.querySelector(targetId);
            const targetPosition = targetElement.offsetTop;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const duration = 1000;

            let start = null;

            function step(timestamp) {
                if (!start) start = timestamp;

                const progress = timestamp - start;

                setTimeout(() => window.scrollTo(
                    0,
                    easeInOutCubic(progress, startPosition, distance, duration),
                ), (openMenu.duration() * 1000));

                if (progress < duration) window.requestAnimationFrame(step);
            }

            window.requestAnimationFrame(step);
        }

        /**
         * Плавный скролл страницы
         * @param {HTMLElementEvent<HTMLAnchorElement>} event
         */
        const navLinkClick = (event) => {
            smoothScroll(event);

            if (navMenu.classList.contains('overlay-menu--open')) {
                menuClose();
                menuBtn.classList.remove('menu-btn--close');
            }
        };

        /** @type {NodeListOf<HTMLAnchorElement>} */
        const navLinks = document.querySelectorAll('.overlay-menu__link');

        for (let i = 0; i < navLinks.length; i++) {
            navLinks[i].addEventListener('click', navLinkClick);
        }

        /**
         * Закрыть все модальные окна
         * @returns {void}
         */
        const closeAllPopups = () => {
            const modals = document.querySelectorAll('.popups');

            modals.forEach((el) => {
                el.querySelector('.popup').classList.remove('popup--active');
            });
        };

        /**
         * Закрыть модальное окно
         * @param {HTMLElement} popup
         * @returns {void}
         */
        const popupClose = (popup) => {
            enableScroll();
            body.classList.remove('body--lock');
            openPopup.reverse();
            popup.classList.remove('popups__overlay_visible');
            closeAllPopups();
        };

        /**
         * Открыть модальное окно
         * @param {HTMLElement} popup
         * @param {string} icon
         * @param {string} message
         * @returns {void}
         */
        const popupOpen = (popup, icon, message) => {
            disableScroll();
            closeAllPopups();
            body.classList.add('body--lock');
            popup.parentElement.classList.add('popups__overlay_visible');

            popup.classList.add('popup--active');
            openPopup.play();

            if (popup.classList.contains('popup-email')) {
                popup.querySelector('.popup-email__img').setAttribute('src', icon);
                /** @type {HTMLElement} */
                const popupMessageElement = popup.querySelector('.popup-email__message');

                popupMessageElement.innerText = message;
            }
        };

        /** @type {HTMLElement} */
        const modalOverlay = document.querySelector('.popups__overlay');

        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) popupClose(modalOverlay);
        });

        const popupCloseBtn = document.querySelectorAll('.popup__close');

        popupCloseBtn.forEach((el) => {
            el.addEventListener('click', (e) => {
                popupClose(el.closest('.popups__overlay'));
                e.preventDefault();
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.keyCode === 27) {
                /** @type {HTMLElement} */
                const popupActive = document.querySelector('.popups__overlay_visible');

                popupClose(popupActive);
            }
        });

        // Обработка формы:
        const formBody = document.querySelector('.form');
        /** @type {HTMLFormElement} */
        const feedbackForm = formBody.querySelector('#feedback');

        /**
         * Добавить ошибку валидации на поле ввода
         * @param {HTMLInputElement | HTMLTextAreaElement} input
         * @returns {void}
         */
        const formAddError = (input) => {
            input.classList.add('error');
        };

        /**
         * Удалить ошибку валидации с поля ввода
         * @param {HTMLInputElement | HTMLTextAreaElement} input
         * @returns {void}
         */
        const formRemoveError = (input) => {
            input.classList.remove('error');
        };

        /**
         * Функция валидации поля для ввода E-mail
         * @param {HTMLInputElement | HTMLTextAreaElement} input
         * @returns {boolean}
         */
        const emailTest = (input) => !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,8})+$/.test(input.value);

        /**
         * Валидация полей формы
         * @param {HTMLFormElement} form
         * @returns {number} количество ошибок
         */
        const formValidate = (form) => {
            let error = 0;
            /** @type {NodeListOf<HTMLInputElement | HTMLTextAreaElement>} */
            const formReq = form.querySelectorAll('.required');

            for (let i = 0; i < formReq.length; i++) {
                const input = formReq[i];

                formRemoveError(input);

                if (input.classList.contains('feedback__input--email')) {
                    if (emailTest(input)) {
                        formAddError(input);
                        error++;
                    }
                } else if (
                    input instanceof HTMLInputElement
                    && input.getAttribute('type') === 'checkbox'
                    && input.checked === false
                ) {
                    formAddError(input);
                    error++;
                } else if (input.value === '') {
                    formAddError(input);
                    error++;
                }
            }

            return error;
        };

        /**
         * Отправка формы
         * @param {Event} e
         * @returns {Promise<void>}
         */
        async function formSend(e) {
            e.preventDefault();
            const error = formValidate(feedbackForm);
            const formData = new FormData(feedbackForm);
            /** @type {HTMLElement} */
            const popupEmail = document.querySelector('.popup-email');

            if (error === 0) {
                formBody.classList.add('form--sending');
                const response = await fetch('sendmail.php', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const result = await response.json();

                    popupOpen(popupEmail, './img/svg/mail.svg', translateStr('dataSendedMessage', result.message));
                    feedbackForm.reset();
                    formBody.classList.remove('form--sending');
                } else {
                    popupOpen(
                        popupEmail,
                        './img/svg/mail_err.svg',
                        translateStr('errorSubmitFormMessage', 'an error occurred while submitting the form'),
                    );
                    formBody.classList.remove('form--sending');
                }
            } else {
                popupOpen(
                    popupEmail,
                    './img/svg/mail_err.svg',
                    translateStr('fillAllRequiredFieldsMessage', 'fill all required fields'),
                );
            }
        }

        feedbackForm.addEventListener('submit', formSend);

        /**
         * Посчитать текущий возраст
         * @returns {number}
         */
        const getCurrentAge = () => {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const bday = new Date(1987, 5, 18);
            const bdaynow = new Date(today.getFullYear(), bday.getMonth(), bday.getDate());

            let age = today.getFullYear() - bday.getFullYear();

            if (today < bdaynow) {
                age -= 1;
            }

            return age;
        };

        /**
         * Установить текущий возраст на странице
         * @returns {void}
         */
        const setCurrentAge = () => {
            const currentAge = getCurrentAge();
            /** @type {HTMLElement} */
            const ageElement = document.querySelector('.about__text--my-age');

            ageElement.innerText = `${currentAge}`;
        };

        /**
         * Установить текущий год на странице в блоке Copyright
         * @returns {void}
         */
        const setYearInCopyrightElement = () => {
            const currentYear = new Date().getFullYear();
            /** @type {HTMLElement} */
            const copyrightYearElement = document.querySelector('.copyright__text-year');

            copyrightYearElement.innerText = `${currentYear}`;
        };

        /**
         * Установить состояние отображения снегопада на странице
         * @returns {void}
         */
        const setSnowFallVisibilityState = () => {
            const currentDate = new Date();
            const currentDay = currentDate.getDate();
            const currentMonth = currentDate.getMonth() + 1;

            const snowFallStartDay = 15;
            const snowFallStartMonth = 12;
            const snowFallEndDay = 15;
            const snowFallEndMonth = 1;

            const showFallElement = document.querySelector('.snow-fall');
            const isSnowShouldFalling = (currentMonth === snowFallStartMonth && currentDay >= snowFallStartDay)
                || (currentMonth === snowFallEndMonth && currentDay <= snowFallEndDay);

            if (showFallElement !== null && isSnowShouldFalling) {
                showFallElement.classList.remove('visually-hidden');
            }
        };

        setCurrentAge();
        setYearInCopyrightElement();
        setSnowFallVisibilityState();
    });
})();
