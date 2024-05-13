import request from "@/utils/request"

export default {
    reqCaptcha() {
        return request({
            url: "/captcha",
            method: 'get'
        })
    },
    login(params) {
        return request({
            url: "/login",
            method: 'post',
            data: params,
        })
    },
    getButtonPermSets(data) {
        return request({
            url: "/index/getbuttonpermsets",
            method: 'post',
            data: data
        })
    },
    reqParentMenu() {
        return request({
            url: "/index/leftmenu",
            method: 'post',
            //data: params
        })
    },
    getPersonalInfo(params) {
        return request({
            url: "/personal/info",
            method: 'post',
            data: params
        })
    },
    editPersonal(params) {
        return request({
            url: "/personal/edit",
            method: 'post',
            data: params
        })
    },
    resetPersonal(params) {
        return request({
            url: "/personal/reset",
            method: 'post',
            data: params
        })
    },
    getButtonPermByRouter(params) {
        return request({
            url: "/index/getbuttonperms",
            method: 'post',
            data: params
        })
    },

    // *************************** 数据库 ************************** //
    getDBList(params) {
        return request({
            url: "/report/database",
            method: 'post',
            data: params
        })
    },
    addDBInfo(data) {
        return request({
            url: "/report/database/add",
            method: 'post',
            data: data
        })
    },
    editDBInfo(data) {
        return request({
            url: "/report/database/edit",
            method: 'post',
            data: data
        })
    },
    deleteDBInfo(data) {
        return request({
            url: "/report/database/delete",
            method: 'post',
            data: data
        })
    },

    // *************************** 项目 ************************** //
    getProject(data) {
        return request({
            url: "/report/project",
            method: 'post',
            data: data
        })
    },
    addProject(data) {
        return request({
            url: "/report/project/add",
            method: 'post',
            data: data
        })
    },
    editProject(data) {
        return request({
            url: "/report/project/edit",
            method: 'post',
            data: data
        })
    },
    deleteProject(data) {
        return request({
            url: "/report/project/delete",
            method: 'post',
            data: data
        })
    },
    getProjectDropDown() {
        return request({
            url: "/report/project/dropdown",
            method: 'post',
        })
    },

    // *************************** 平台 ************************** //
    getPlatform(data) {
        return request({
            url: "/report/platform",
            method: 'post',
            data: data
        })
    },
    getPlatformDropDown() {
        return request({
            url: "/report/platform/dropdown",
            method: 'post',
        })
    },
    addPlatform(data) {
        return request({
            url: "/report/platform/add",
            method: 'post',
            data: data
        })
    },
    editPlatform(data) {
        return request({
            url: "/report/platform/edit",
            method: 'post',
            data: data
        })
    },
    deletePlatform(data) {
        return request({
            url: "/report/platform/delete",
            method: 'post',
            data: data
        })
    },


    // *************************** 主机 ************************** //
    getHost(data) {
        return request({
            url: "/report/hosts",
            method: 'post',
            data: data
        })
    },
    addHost(data) {
        return request({
            url: "/report/hosts/add",
            method: 'post',
            data: data
        })
    },
    editHost(data) {
        return request({
            url: "/report/hosts/edit",
            method: 'post',
            data: data
        })
    },
    deleteHost(data) {
        return request({
            url: "/report/hosts/delete",
            method: 'post',
            data: data
        })
    },
    getHostDropDown() {
        return request({
            url: "/report/hosts/dropdown",
            method: 'post',
        })
    },


    // *************************** 主机组 ************************** //
    getHostGroup(data) {
        return request({
            url: "/report/hostgroup",
            method: 'post',
            data: data
        })
    },
    getHostGroupDetail(data) {
        return request({
            url: "/report/hostgroup/edit/getdetail",
            method: 'post',
            data: data
        })
    },
    addHostGroup(data) {
        return request({
            url: "/report/hostgroup/add",
            method: 'post',
            data: data
        })
    },
    editHostGroup(data) {
        return request({
            url: "/report/hostgroup/edit",
            method: 'post',
            data: data
        })
    },
    deleteHostGroup(data) {
        return request({
            url: "/report/hostgroup/delete",
            method: 'post',
            data: data
        })
    },
    getHostGroupDropDown(params) {
        return request({
            url: "/report/hostgroup/dropdown",
            method: 'post',
            data: params
        })
    },

    // *************************** 基本管理-用户 ************************** //
    getUser(data) {
        return request({
            url: "/base/user",
            method: 'post',
            data: data
        })
    },
    addUser(data) {
        return request({
            url: "/base/user/add",
            method: 'post',
            data: data
        })
    },
    editUser(data) {
        return request({
            url: "/base/user/edit",
            method: 'post',
            data: data
        })
    },
    deleteUser(data) {
        return request({
            url: "/base/user/delete",
            method: 'post',
            data: data
        })
    },
    resetUser(data) {
        return request({
            url: "/base/user/reset",
            method: 'post',
            data: data
        })
    },

    // *************************** 基本管理-角色 ************************** //
    getRole(data) {
        return request({
            url: "/base/role",
            method: 'post',
            data: data
        })
    },
    addRole(data) {
        return request({
            url: "/base/role/add",
            method: 'post',
            data: data
        })
    },
    editRole(data) {
        return request({
            url: "/base/role/edit",
            method: 'post',
            data: data
        })
    },
    deleteRole(data) {
        return request({
            url: "/base/role/delete",
            method: 'post',
            data: data
        })
    },
    saveAclMenuList(data) {
        return request({
            url: "/base/role/acl",
            method: 'post',
            data: data
        })
    },
    getRoleSetDropDown(data) {
        return request({
            url: "/base/role/dropdown",
            method: 'post',
            data: data
        })
    },

    // *************************** 基本管理-岗位 ************************** //
    getPost(data) {
        return request({
            url: "/base/post",
            method: 'post',
            data: data
        })
    },
    addPost(data) {
        return request({
            url: "/base/post/add",
            method: 'post',
            data: data
        })
    },
    editPost(data) {
        return request({
            url: "/base/post/edit",
            method: 'post',
            data: data
        })
    },
    deletePost(data) {
        return request({
            url: "/base/post/delete",
            method: 'post',
            data: data
        })
    },
    getPostSetDropDown(data) {
        return request({
            url: "/base/post/dropdown",
            method: 'post',
            data: data
        })
    },

    // *************************** 基本管理-部门 ************************** //
    getDept(data) {
        return request({
            url: "/base/dept",
            method: 'post',
            data: data
        })
    },
    addDept(data) {
        return request({
            url: "/base/dept/add",
            method: 'post',
            data: data
        })
    },
    editDept(data) {
        return request({
            url: "/base/dept/edit",
            method: 'post',
            data: data
        })
    },
    deleteDept(data) {
        return request({
            url: "/base/dept/delete",
            method: 'post',
            data: data
        })
    },
    getDeptSetDropDown(data) {
        return request({
            url: "/base/dept/dropdown",
            method: 'post',
            data: data
        })
    },
    // *************************** 菜单 ************************** //
    getAclMenuList(data) {
        return request({
            url: "/base/role/aclist",
            method: 'post',
            data: data
        })
    },


}