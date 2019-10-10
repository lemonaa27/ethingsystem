// API访问地址
let baseUrl = 'http://47.93.223.40:8002'      //测试
//let baseUrl = 'http://39.107.106.204:8002'  //正式
export default baseUrl;

import axios from 'axios'
import router from '../../../router'
import { Loading, Notification } from 'element-ui'

// 加载层控制
let loading = {
    loading: null,
    open: function() {
        this.loading = Loading.service({
            lock: true,
            text: 'Loading...',
//          spinner: 'fa fa-spinner fa-4x fa-pulse',
			spinner: 'el-icon-loading',
			background:'rgba(0,0,0,.7)'
        })
    },
    close: function() {
        this.loading.close()
    }
};
function startLoading() {
	loading.open()
};

function endLoading() {
	loading.close()
};
let needLoadingRequestCount = 0

function showFullScreenLoading() {
	if(needLoadingRequestCount === 0) {
		startLoading()
	}
	needLoadingRequestCount++
};

function tryHideFullScreenLoading() {
	if(needLoadingRequestCount <= 0) return
	needLoadingRequestCount--
	if(needLoadingRequestCount === 0) {
		endLoading()
	}
}

// 请求拦截器：设置headers(添加身份校验参数)
axios.interceptors.request.use(function(config) {
	showFullScreenLoading();
	if(config.url != 'http://47.93.223.40:8002/api/mgr/function/ReturnFunction' && 'http://47.93.223.40:8002/api/mgr/Role_Dept/GetUserInfo'){
		loading.open()
	}
//	console.log(config.url)
        // 设置headers
        if(window.localStorage.getItem('admin')){
//      	console.log(window.localStorage.getItem('admin'))
        	let admin = JSON.parse(window.localStorage.getItem('admin'))
        	config.headers.unique_identity = admin.uuid
		    config.headers.token = admin.token
        }
//      if (admin !== null) {
//		        
//		    }
//  console.log(window.localStorage.getItem('admin'))
    
    return config
})

// 响应拦截器：统一处理异常情况
axios.interceptors.response.use(response => {
	tryHideFullScreenLoading();
//	if(response.data.success == false){
//		//判断登录超时返回登录页
//		 router.push({
//		 	path:'/login'
//		 })
//	}
//  loading.close(); // 关闭加载层
    return response
}, err => {
    loading.close() // 关闭加载层
//  Notification.error({
//      title: '错误提示',
//      message: '网络错误请稍后重试',
//      duration: 2000
//  })
    return Promise.reject(err)
})
