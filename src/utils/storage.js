const env = import.meta.env
import {useCookies} from "vue3-cookies";

const {cookies} = useCookies();


export default {
    getStorage() {
        return JSON.parse(window.localStorage.getItem(import.meta.env.VUE_APP_NAME_SPACE) || "{}")
    },
    setItem(key, val) {
        let storage = this.getStorage()
        storage[key] = val
        window.localStorage.setItem(import.meta.env.VUE_APP_NAME_SPACE, JSON.stringify(storage))
    },
    getItem(key) {
        return this.getStorage()[key]
    },
    clearItem(key) {
        let storage = this.getStorage()
        delete storage[key]
        window.localStorage.setItem(import.meta.env.VUE_APP_NAME_SPACE, JSON.stringify(storage))
    },
    clearAll() {
        window.localStorage.clear()
    },

    setVCookie(key, value) {
        cookies.set(key, value, '72h')
    },

    getVCookie(key) {
        return cookies.get(key)
    },

    deleteVCookie(key) {
        cookies.set(key, '', '0s')
    }


}