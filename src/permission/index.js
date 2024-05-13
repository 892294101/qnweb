
import api from "@/api/index.js"
import {ElMessage} from "element-plus";
import localStorage from "@/utils/storage.js"

async function getButtonPerm(value) {
    const {data: resButton} = await api.getButtonPermByRouter(value)
    return resButton
}

export default {getButtonPerm}