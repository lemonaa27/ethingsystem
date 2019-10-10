<template>
	<div class="container_box">
		<img src="../../../assets/img/login.png" style="z-index: -1; width: 100%; height: 100%;">
		<!--<div class="login_mask"></div>-->
		<div class="login_box">
			<p class="system">账号登录</p>
			<p class="welcome_text">欢迎来到好开业务后台管理系统</p>
			<form action="" class="form" style="position: relative;">
				<div class="item-box">
					<img src="../../../assets/img/user.png" alt="" />
					<input type="text" class="account" placeholder="用户名" v-model="Email" @blur="losePhone()" />
				</div>
				<div class="item-box item_psd">
					<img src="../../../assets/img/psdr.png" alt="" />
					<input type="password" class="psd" placeholder="密码" v-model="Password"  @blur="losePsd()"/>
				</div>
				<div class="clearfix" style="display: none">
					<div class="code-box">
						<img src="../../../assets/img/yzm.png" alt="" />
						<input type="text" class="yzm" placeholder="请输入验证码" />

					</div>
					<div class="fr">
						<img id="valid_code" width="110" height="40" />
					</div>
				</div>
				<!--<div class="check">
						<Checkbox v-model="single">下次自动登录</Checkbox>
					</div>-->
				<p style="color:red;font-size: 14px;position: absolute;bottom:60px;left: 130px;">{{errorMsg}}</p>
				<li class="btn" @click="submit_login()">登录</li>
			</form>
		</div>
		<p class="bottom_b">版权所有：北京易行互动科技有限公司 电话：010-85072077 ©️2016www.ething.net 京ICP证150082号 公网安备 11010802020186</p>
	</div>
</template>

<script>
//	import * as api from '../../../api/api.js';
	import baseUrl from '../common/baseUrl'
	export default {
		data: function() {
			return {
				Email: '', //邮箱
				Password: '', //密码
				errorMsg: ''

			}

		},
		created() {
		},
		methods: {
			//账号校验
			losePhone() {
				if(this.Email == "") {
					this.errorMsg = "请输入用户名";
					return false;
				} else if(!/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.Email)) {
					this.errorMsg = "必须是邮箱格式!";
					return false;
				} else {
					this.errorMsg = "";
					return true;
				}
			},
			//密码校验
			losePsd() {
				if(this.Password == "") {
					this.errorMsg = "请输密码";
					return false;
				} else if(!(this.Password.length>=6 && this.Password.length <=16)) {
					this.errorMsg = "密码长度在6-16之间";
					return false;
				} else {
					this.errorMsg = "";
					return true;
				}
			},
			submit_login() {
				if(this.losePhone() && this.losePsd()) {
					var params = new URLSearchParams();
					params.append('Email', this.Email);
					params.append('Password', this.Password);
					let uuid = this.uuid();
					this.$axios({
						method: 'POST',
						url: baseUrl + '/api/mgr_Login/mLogin',
						data: params,
						headers: {
							unique_identity: uuid
						}
					}).then(res => {
						if(res.data.success) {
							console.log(res.data.data)
							localStorage.setItem('token', res.data.data.token);
							localStorage.setItem('userName', res.data.data.userName);
							localStorage.setItem('functionId', res.data.data.functionId);
							var admin = {}
							admin.uuid = uuid;
							admin.token = res.data.data.token;
							window.localStorage.admin = JSON.stringify(admin);
							this.$router.push({
								path: res.data.data.src
							})
							this.$layer.msg(res.data.msg);
							
						} else {
							this.$layer.msg(res.data.msg);
						}
					}).catch(err => {
						console.log(err)
					})
				}
			},
			//设置uuid
			uuid() {
				var s = [];
				var hexDigits = "0123456789abcdef";
				for(var i = 0; i < 36; i++) {
					s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
				}
				s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
				s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
				s[8] = s[13] = s[18] = s[23] = "-";

				var uuid = s.join("");
				return uuid;
			}
		}
	}
</script>

<style scoped>
	.container_box {
		width: 100%;
		height: 100%;
		font-size: 16px;
		font-family: "微软雅黑";
	}
	
	.login_box {
		width: 600px;
		height: 470px;
		border-radius: 6px;
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		background: RGBA(255, 255, 255, 0.2);
	}
	
	.system {
		/*height: 80px;*/
		/*line-height: 80px;*/
		text-align: center;
		color: #ffff;
		font-size: 24px;
		margin-top: 52px;
	}
	
	.form {
		padding-top: 10px;
		padding-left: 22%;
	}
	
	.item-box,
	.btn {
		width: 340px;
		height: 42px;
		line-height: 42px;
		background: #fff;
		text-align: center;
		border-radius: 6px;
		margin-top: 25px;
	}
	
	.item-box>img {
		width: 8%;
		vertical-align: text-bottom;
		padding-left: 10px;
	}
	
	.item_psd {
		margin: 20px 0;
	}
	
	.account,
	.psd {
		width: 90%;
		height: 100%;
		outline: none;
		border: none;
		background: #fff;
	}
	
	.btn {
		overflow: hidden;
		background: rgba(240, 124, 0, 1);
		color: #FFFFFF;
		list-style: none;
		margin-top: 50px;
		margin-bottom: 20px;
		font-size: 18px;
		cursor: pointer;
	}
	
	.tel,
	.work_time {
		font-size: 14px;
		color: #ccc;
		padding-left: 10%;
	}
	
	.tel>.word {
		font-size: 26px;
		color: #Fff;
	}
	
	.welcome_text {
		color: #fff;
		font-size: 20px;
		text-align: center;
		/*line-height: 60px;*/
		margin-top: 45px;
	}
	/*验证码*/
	
	.clearfix {
		width: 100%;
	}
	
	.code-box {
		float: left;
		width: 50%;
		height: 40px;
		line-height: 40px;
		background: #fff;
		border-radius: 2px;
		padding: 2px;
	}
	
	.code-box>img {
		width: 12%;
		vertical-align: text-bottom;
	}
	
	.yzm {
		width: 85%;
		height: 95%;
		outline: none;
		border: none;
	}
	
	.fr {
		float: right;
		width: 40%;
	}
	
	.check {
		margin-left: 14px;
		margin-top: 20px;
	}
	
	.bottom_b {
		width: 100%;
		height: 40px;
		line-height: 40px;
		background: #000;
		font-size: 12px;
		color: #fff;
		text-align: center;
		position: fixed;
		bottom: 0;
	}
</style>