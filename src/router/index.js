import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router'
//引入axios
import axios from 'axios';
Vue.prototype.axios = axios;
Vue.use(VueRouter)

import baseUrl from '../components/page/common/baseUrl'
const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
if (to.path === '/login') {
    window.localStorage.removeItem('admin')
    next()
    return
}
let admin = JSON.parse(window.localStorage.getItem('admin'))
if (!admin && to.path !== '/login') { // 无登录信息访问业务界面,拦截返回登录页
    next({path: '/login'})
    return
}

if (admin && to.path !== '/login') { // 无登录信息访问业务界面,拦截返回登录页
		//判断登录超时返回登录页
		axios({
			method: "GET",
			url: baseUrl + '/api/mgr/Role_Dept/GetUserInfo'
		}).then(res=>{
			console.log(res.data)
			if(res.data.success == false){
				next({path: '/login'})
			}else{
				 next()
			}
		})
    return
}

})
export default router
