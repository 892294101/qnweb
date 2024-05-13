import api from "@/api/index.js"
import {ElMessage} from "element-plus";
import localStorage from "@/utils/storage.js"

export default {
    async beforeMount(el, binding, vNode) {
        const {value} = binding
        const reqPerm = value["TargetPerm"]
        const currentRouter = value["CurrentRouter"]

        const currentTimeInSeconds = Math.floor(Date.now() / 1000);
        const keepTime = localStorage.getItem(currentRouter + 'KeepTime') ?? 0
        const defTime = currentTimeInSeconds - keepTime

        const askKeepTime = 60

        if (keepTime > 0 && (currentTimeInSeconds - keepTime) < askKeepTime) {
            const permSet = localStorage.getItem(currentRouter)
            let mark = false
            // 从本地读取对象. 并判断是否存在权限.
            if (permSet !== null && permSet !== undefined) {
                for (let i = 0; i < permSet.length; i++) {
                    if (permSet[i]["url"] === reqPerm) {
                        mark = true
                        break
                    }
                }
            }


            // 如果不存在权限. 则删除元素子节点.
            if (!mark) {
                // 不起作用
                if (el.parentNode !== null) {
                    el.parentNode.removeChild(el)
                }
                // 如果存在子节点,则清除style属性
            } else {
                el.style.display = ''
                //el.removeAttribute('style')
            }
            return
        }

        const {data: res} = await api.getButtonPermByRouter(value)
        if (res.code !== 200) {
            ElMessage.error(res.message)
        } else {
            const currentTimeInSeconds = Math.floor(Date.now() / 1000);
            if (res.data !== null && res.data.length > 0) {
                localStorage.setItem(currentRouter, res.data)
                localStorage.setItem(currentRouter + 'KeepTime', currentTimeInSeconds)
            } else {
                localStorage.setItem(currentRouter, null)
                localStorage.setItem(currentRouter + 'KeepTime', currentTimeInSeconds)
            }

            let mark = false
            if (res.data !== null) {
                for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i]["url"] === reqPerm) {
                        mark = true
                        break
                    }
                }
            }
            if (!mark) {
                // 不起作用
                if (el.parentNode !== null) {
                    el.parentNode.removeChild(el)
                }
            } else {
                el.style.display = ''
                //el.removeAttribute('style')
            }
        }
    }
}

















