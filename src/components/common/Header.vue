<template>
	<div class="header">
		<div class="logo">后台管理系统</div>
		<div class="heading">
			<span class="title">欢迎来到好开业务后台管理系统</span>
			<!--<span class="txt">{{subItem}}</span>-->
		</div>
		<div class="user-info">
			<span class="top_right">
				<div class="portrait">
					<img src="static/img/header.png"/>
				</div>
				<span class="welcome">{{userName}}</span>
			<i class="el-icon-arrow-down arrow" @click="reset()" style="cursor: pointer;"></i>
			</span>
			<!--修改密码/注销登录-->
			<div class="downList" v-show="show">
				<a class="resetPsd" @click="modifyPsd()"><img src="../../assets/img/shezhi.png" alt="" />修改密码</a>
				<a class="loginOff" @click="exitOut()"><img src="../../assets/img/cancellation.png" alt="" />注销登录</a>
			</div>
		</div>
	</div>
</template>
<script>
	import baseUrl from '../page/common/baseUrl'
	export default {
		data() {
			return {
				name: 'linxin',
				text: "",
				subItem: "",
				show: false,
				userName: ''
			}
		},
		computed: {
			username() {
				let username = localStorage.getItem('ms_username');
				return username ? username : this.name;
			}
		},
		watch: {
			$route(to, from) {
				if(sessionStorage.getItem("text") == null) {
					sessionStorage.setItem("text", "用户管理");
					sessionStorage.setItem("subItem", "部门管理");
				}
				this.text = sessionStorage.getItem("text");
				this.subItem = sessionStorage.getItem("subItem");
				//this.userName=sessionStorage.getItem("userName");
			}

		},
		created() {
			if(sessionStorage.getItem("text") == null) {
				sessionStorage.setItem("text", "用户管理");
				sessionStorage.setItem("subItem", "部门管理");
			}
			this.text = sessionStorage.getItem("text");
			this.subItem = sessionStorage.getItem("subItem");
			this.userName = localStorage.getItem("userName");
		},
		methods: {
			//修改密码
			modifyPsd() {
				this.$router.push("/Modify")
				this.show = false
			},
			//退出登录
			exitOut() {
				let admin = JSON.parse(window.localStorage.getItem('admin'))
				this.$axios({
					method: 'DELETE',
					url: baseUrl + '/api/mgr_Login/LoginOut'
				}).then(res => {
					if(res.data.success) {
						window.localStorage.removeItem('admin');
						localStorage.clear();
						sessionStorage.clear();
						this.$layer.msg(res.data.msg);
						this.$router.push("/login")
					} else {
						this.$layer.msg(res.data.msg)
						this.$router.push("/login")
					}
				})

			},
			//下拉图标
			reset() {
				this.show = !this.show
			},
		}
	}
</script>
<style scoped="scoped">
	.header {
		position: relative;
		box-sizing: border-box;
		width: 100%;
		height: 70px;
		font-size: 22px;
		line-height: 70px;
		border-bottom: 1px solid #f7f1f1;
		background-color: #fff;
	}
	
	.header .logo {
		float: left;
		width: 240px;
		background-color: RGBA(34, 36, 42, 1);
		text-align: center;
		color: #fff;
	}
	
	.user-info {
		float: right;
		/*padding-right: 50px;*/
		padding-left: 60px;
		font-size: 16px;
		margin-right: 50px;
		position: relative;
	}
	
	.user-info .arrow {
		color: #ccc;
		font-size: 12px;
		vertical-align: middle;
		padding: 0 5px;
	}
	
	.user-info .portrait {
		height: 32px;
		border-radius: 50%;
		vertical-align: middle;
		display: inline-block;
	}
	.user-info .portrait img{
		vertical-align: top;
	}
	
	
	.el-dropdown-menu__item {
		text-align: center;
	}
	
	.heading {
		margin-left: 10px;
		float: left;
	}
	
	.title {
		font-family: 微软雅黑;
		font-weight: 400;
		font-size: 16px;
		color: RGBA(51, 51, 51, 1);
	}
	
	.txt {
		font-family: "PingFang SC Bold", "PingFang SC";
		font-weight: 650;
		color: rgb(101, 101, 101);
	}
	/*修改密码注销登录*/
	
	.downList {
		width: 105px;
		height: 60px;
		border: 1px solid #ccc;
		background: #fff;
		position: absolute;
		z-index: 111;
		right: 0;
	}
	
	.downList a img {
		vertical-align: middle;
		margin-right: 10px;
		margin-top:-2px;
	}
	
	.resetPsd,
	.loginOff {
		display: block;
		line-height: 30px;
		text-align: center;
		cursor: pointer;
		color: #666;
		font-size: 16px;
	}
	
	.resetPsd {
		border-bottom: 1px solid #ccc;
	}
	
	.user {
		width: 40px;
		height: auto;
		padding-top: 10px;
		padding-right: 50px;
	}
	
	.welcome {
		vertical-align: middle;
		color: #666;
		font-size: 14px;
		font-weight: normal;
		font-family: 'Microsoft YaHei Regular', 'Microsoft YaHei';
		padding: 0 5px;
	}
	
	.el-icon-caret-bottom {
		display: inline-block;
		vertical-align: top;
		padding-top: 20px;
		cursor: pointer;
	}
</style>