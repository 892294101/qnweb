import {createPinia, defineStore} from 'pinia'
import piniaPluginPersistedState from "pinia-plugin-persistedstate"
import {ElMessage} from "element-plus";
import api from "@/api/index.js"

const pinia = createPinia()

export const useDataStore = defineStore({
    id: 'MenuSet',
    persist: true,
    state: () => {
        return {
            ParentMenu: [],
            storageTime: 0,
        }
    },
    actions: {
        async fetchData() {
            const currentTimeInSeconds = Math.floor(Date.now() / 1000);
            const defTime = currentTimeInSeconds - this.$state.storageTime
            if (defTime > 60 || this.$state.ParentMenu.length === 0) {
                try {
                    const {data: res} = await api.reqParentMenu()
                    if (res.code !== 200) {
                        console.error(res.message)
                    } else {
                        console.log("数据库提取菜单")
                        this.$state.ParentMenu = null
                        this.$state.ParentMenu = res.data.ParentMenu
                        this.$state.storageTime = currentTimeInSeconds
                    }
                } catch (e) {
                    console.error(e)
                }
            }
        }
    }
})


pinia.use(piniaPluginPersistedState)
export default pinia