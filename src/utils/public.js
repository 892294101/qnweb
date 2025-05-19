import {ElMessage} from "element-plus";
import useClipboard from 'vue-clipboard3';


/*
import qfs from "fs";
export const createWriteStream = (str) => {
    //  const path = qfs.join(process.cwd(), 'data', 'data.json')
    return qfs.createWriteStream(str)
}
*/


const {toClipboard} = useClipboard();


const copyToClipboard = async (text) => {
    if (text.length > 0) {
        try {
            await toClipboard(text)
            ElMessage.success({center: true, dangerouslyUseHTMLString: true, message: '文本<span style="color: red;">' + text + '</span>拷贝到剪贴板'})
        } catch (err) {
            ElMessage.error({center: true, message: "拷贝失败"})
        }
    }
}

export const CopyText = (row, column, event) => {
    switch (column.property) {
        case 'ProjectName':
            copyToClipboard(row.ProjectName);
            break
        case 'PlatformName':
            copyToClipboard(row.PlatformName);
            break
        case 'GroupName':
            copyToClipboard(row.GroupName);
            break
        case 'UserName.String':
            copyToClipboard(row.UserName.String);
            break
        case 'PassWord.String':
            copyToClipboard(row.PassWord.String);
            break
        case 'Address':
            copyToClipboard(row.Address);
            break
        case 'PostName':
            copyToClipboard(row.PostName);
            break
        case 'DeptName':
            copyToClipboard(row.DeptName);
            break
        case 'RoleName':
            copyToClipboard(row.RoleName);
            break
        case 'UserName':
            copyToClipboard(row.UserName);
            break
        case 'Email.String':
            copyToClipboard(row.Email.String);
            break
        case 'Phone.String':
            copyToClipboard(row.Phone.String);
            break
        case 'BusinessName':
            copyToClipboard(row.BusinessName);
            break
        default:

    }
};
