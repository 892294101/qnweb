import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({
    easing: 'ease', // 动画方式
    speed: 500, // 进度条速度
    showSpinner: true, // 是否显示加载icon
    trickleSpeed: 100, // 自动递增间隔
    minimum: 0.3, // 初始化时最小百分比
})

export default NProgress