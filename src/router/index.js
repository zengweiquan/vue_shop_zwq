import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/home.vue'
import Welcome from '../components/Welcone.vue'
import Users from '../components/user/User.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    /* 登录页面*/
    { path: '/', redirect: '/login' },      /* 重定向到路径login */
    { path: '/login', component: Login },
    /* home 主页*/
    { path: '/home', component: Home , redirect: '/welcome',
    /* home 下面的子路由*/
      children: [
        {path:'/welcome' ,component:Welcome},
        {path:'/users' ,component:Users}
      ]
    }
  ]
})

// 挂载路由导航守卫

router.beforeEach((to,from,next) =>{
  //to 将要访问的路径
  //from代表从哪个路径跳转而来
  //next 是一个函数表示你放行
  if(to.path == '/login') return next();
  //获取token
  const tokenStr =window.sessionStorage.getItem('token')
  if(!tokenStr) return next('login')
  next()
})
export default router
