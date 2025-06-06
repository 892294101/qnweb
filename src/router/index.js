import NProgress from '@/config/nprogress'
import {createRouter, createWebHistory} from 'vue-router'
import storage from "@/utils/storage.js";

const routers = [
    {path: '/', redirect: '/index'},
    {path: '/login', component: () => import('@/views/login.vue')},
    {
        path: '/home',
        component: () => import("@/views/home.vue"),
        redirect: '/index',
        children: [
            {
                path: '/index',
                component: () => import('@/views/index.vue'),
                meta: {sTitle: '首页'}
            },
            {
                path: '/personal/info',
                component: () => import('@/views/personal.vue'),
                meta: {sTitle: '个人中心', tTitle: '个人信息'}
            },
            {
                path: '/base/user',
                component: () => import("@/views/base/User.vue"),
                meta: {sTitle: '基本管理', tTitle: '用户管理'}
            },
            {
                path: '/base/role',
                component: () => import("@/views/base/Role.vue"),
                meta: {sTitle: '基本管理', tTitle: '角色管理'}
            },
            {
                path: '/base/dept',
                component: () => import("@/views/base/Dept.vue"),
                meta: {sTitle: '基本管理', tTitle: '部门管理'}
            },
            {
                path: '/base/post',
                component: () => import("@/views/base/Post.vue"),
                meta: {sTitle: '基本管理', tTitle: '岗位管理'}
            },
            {
                path: '/report/project',
                component: () => import("@/views/report/project.vue"),
                meta: {sTitle: '信息管理', tTitle: '项目'}
            },
            {
                path: '/report/platform',
                component: () => import("@/views/report/platform.vue"),
                meta: {sTitle: '信息管理', tTitle: '平台'}
            },
            {
                path: '/report/hosts',
                component: () => import("@/views/report/hosts.vue"),
                meta: {sTitle: '信息管理', tTitle: '主机'}
            },
            {
                path: '/report/hostgroup',
                component: () => import("@/views/report/hostgroup.vue"),
                meta: {sTitle: '信息管理', tTitle: '主机组'}
            },
            {
                path: '/report/database',
                component: () => import("@/views/report/dblist.vue"),
                meta: {sTitle: '信息管理', tTitle: '数据库'}
            },
            {
                path: '/report/redis',
                component: () => import("@/views/report/redis.vue"),
                meta: {sTitle: '信息管理', tTitle: 'Redis'}
            },
            {
                path: '/cdr/day',
                component: () => import("@/views/cdr/day.vue"),
                meta: {sTitle: '话单报表', tTitle: '天统计'}
            },
            {
                path: '/cdr/month',
                component: () => import("@/views/cdr/month.vue"),
                meta: {sTitle: '话单报表', tTitle: '月统计'}
            },
            {
                path: '/cdr/state',
                component: () => import("@/views/cdr/state.vue"),
                meta: {sTitle: '话单报表', tTitle: '号码状态'}
            },
            {
                path: '/cdr/lack',
                component: () => import("@/views/cdr/lack.vue"),
                meta: {sTitle: '话单报表', tTitle: '号码缺失'}
            },
            {
                path: '/logs/loginlog',
                component: () => import("@/views/logs/LoginLog.vue"),
                meta: {sTitle: '日志管理', tTitle: '登陆日志'}
            },
            {
                path: '/logs/operatorlog',
                component: () => import("@/views/logs/OperatorLog.vue"),
                meta: {sTitle: '日志管理', tTitle: '操作日志'}
            }

        ]
    },
    {path: "/error/403", component: () => import("@/views/error/403.vue"), name: 'Not Perm 403'},
    {path: "/:catchAll(.*)", component: () => import("@/views/error/404.vue"), name: 'Not Found 404'},

]

const router = createRouter({
    history: createWebHistory(),
    routes: routers
})

router.beforeEach(async (to, form, next) => {
    // NProgress 开始
    NProgress.start()

    // 如果访问/login页面，直接调用next
    if (to.path === '/login') {
        return next()
    }

    // 如果不是访问的/login页面，先检查本地存储是否有token，如果没有，跳转到/login让用户登陆
    const tokenStr = storage.getVCookie("token")
    if (tokenStr !== null && tokenStr !== undefined && tokenStr !== "" ) {
        console.log("tokenStr: ", tokenStr)
        // 如果有token，继续判断
        try {
            if (typeof sessionStorage !== undefined) {
                sessionStorage.setItem("UserRedirect", to.path)
                console.log('Data stored successfully in sessionStorage: data: ',sessionStorage.getItem("UserRedirect"));
            } else {
                console.error('sessionStorage is not available.');
            }
        } catch (error) {
            console.error('Error storing data:', error);
        }
    }else{
        return next('/login')
    }

    next()
})

router.afterEach(() => {
    NProgress.done()
})

router.onError(error => {
    NProgress.done()
})

export default router