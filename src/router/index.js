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
    if (!tokenStr) {
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