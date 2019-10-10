import Vue from 'vue';
import App from './App';
import router from './router';

//引入axios
import axios from 'axios';
Vue.prototype.$axios = axios;
//引入jquery
import $ from 'jquery'
//引入elementUI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

//引入拖拽排序组件awe-dnd
import VueDND from 'awe-dnd';
Vue.use(VueDND)

//引入iview
import iView from 'iview'; // 导入组件库
import 'iview/dist/styles/iview.css'; // 导入样式
//引入layer
import layer from 'vue-layer';
Vue.prototype.$layer = layer(Vue);

//引入ajax
import $ajax from "ajax"
Vue.use(iView);

//引入iconfont图标
import 'assets/font/iconfont.css'

new Vue({
	router,
	render: h => h(App)
}).$mount('#app');