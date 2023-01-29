type HTMLElementEvent<T extends HTMLElement> = Event & {
    currentTarget: T;
}

type SupportedLocales = 'en' | 'ru';

type TranslationData = {
    [x in SupportedLocales]: string;
}

type LocalesData = {
    [x: string]: TranslationData;
}
