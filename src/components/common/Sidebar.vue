<template>
	<div class="sidebar">
		<el-menu :default-active="onRoutes" class="el-menu-vertical-demo" theme="dark" unique-opened router>
			<template v-for="item in items">
				<template v-if="item.children">
					<el-submenu :index="item.indexs">
						<template slot="title"><i :class="item.icon"></i><span class="text">{{item.functionName}}</span></template>
						<el-menu-item v-for="(subItem,i) in item.children"  :key="subItem.indexs" :index="subItem.url" @click="getFuncId(subItem.functionId)">{{ subItem.functionName }}
						</el-menu-item>
					</el-submenu>
				</template>
				<template v-else>
					<el-menu-item :index="item.indexs">
						<i :class="item.icon"></i>{{ item.functionName }}
					</el-menu-item>
				</template>
			</template>
		</el-menu>
	</div>
</template>

<script>
	import * as api from '../../api/api.js';
	export default {
		data() {
			return {
				items: [], //菜单列表
				functionId: "", //functionId
				userId: "", //用户id	
				roleId: ""
			}
		},
		created() {
			this.getUserInfo();
			if(this.items) {
				this.items = JSON.parse(sessionStorage.getItem('menuArray'));
			}

		},
		computed: {
			onRoutes() {
				return this.$route.path.replace('/', '');
			}
		},
		methods: {
			//获取登录用户信息
			getUserInfo() {
				var url = api.GetUserInfo;
				this.$axios({
					method: "get",
					url: url
				}).then(res => {
					if(res.data.success) {
						this.userId = res.data.data.userId;
						this.roleId = res.data.data.roleId;
						this.getMenusList()
					}
				}).catch(err => {
					console.log(err)
				})
			},
			//获取当前用户权限的菜单列表
			getMenusList() {
				var url = api.menusList;
				this.$axios({
					method: "get",
					url: url,
					//					params:{
					//						RoleId:this.roleId
					//					}
				}).then(res => {
					if(res.data.success) {
						var menuArray = JSON.stringify(res.data.data);
						sessionStorage.setItem('menuArray', menuArray);
						
						if(this.items == null) {
							this.items = res.data.data;
						}
					}
				}).catch(err => {
					console.log(err)
				})
			},
			//获取当前子菜单的functionid
			getFuncId(functionid) {
				sessionStorage.setItem('functionid', functionid);
//				console.log(functionid)
//				var url = api.QueryFunction
//				this.functionId = functionid;
//				this.$axios({
//					method: "get",
//					url: url,
//					params: {
//						functionId:this.functionId,
////						userId: this.userId,
//					}
//				}).then(res => {
//					if(res.data.success) {
//						var buttonList = JSON.stringify(res.data.data);
////						sessionStorage.setItem('buttonList', buttonList);
////						sessionStorage.setItem('functionid', functionid);
//					}
//				}).catch(err => {
//					console.log(err)
//				})
			}
		}
	}
</script>

<style scoped>
	.sidebar {
		display: block;
		position: absolute;
		width: 241px;
		left: 0;
		top: 70px;
		bottom: 0;
		background: #2E363F;
	}
	
	.sidebar>ul {
		height: 100%;
	}
	
	.text {
		display: inline-block;
		margin-left: 5px;
	}
</style>