import Cookies from 'js-cookie'

const langKey = 'language'

export function setLang(lang) {
    return Cookies.set(langKey, lang, {
        expires: 1
    })
}

export function getLang() {
    return Cookies.get(langKey)
}