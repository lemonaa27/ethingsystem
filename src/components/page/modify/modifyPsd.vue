<template>
	<div class="psd_box">
		<div class="center">
			<p>
				<span class="span">请输入旧密码:</span>
				<span class="in_frame">
					<input type="password" placeholder="请输入旧密码" class="oldPsd" v-model="oldPass" v-show="oldCipher" />
					<input type="text" placeholder="请输入旧密码" class="oldPsd" v-model="oldPass" v-show="!oldCipher"  />
					<img :src="see ? img1 : img2" alt="" @click="changeType" />
				</span>
				
			</p>
			<p>
				<span class="span">请输入新密码:</span>
				<span class="in_frame">
					<input type="password" v-model="newPass" placeholder="请输入新密码" class="newPsd" v-show="newCipher"  />
					<input type="text" placeholder="请输入新密码" class="oldPsd" v-model="newPass" v-show="!newCipher" />
					<img :src="see1 ? img1 : img2" alt="" @click="changeType1" />
				</span>
				<span style="font-size: 14px;color:#ccc;margin-right: 5px;">6-16位，英文、数字或常用字符</span>
				
			</p>

			<p>
				<span class="span">请再次输入新密码:</span>
				<span class="in_frame">
					<input type="password" placeholder="请再次输入新密码" class="againPsd" v-model="confirmPass" v-show="newCipher1"  />
					<input type="text" placeholder="请再次输入新密码" class="oldPsd" v-model="confirmPass" v-show="!newCipher1" />
					<img :src="see2 ? img1 : img2" alt="" @click="changeType2" />
				</span>

				<span class="notes"></span>
			</p>
			<button class="submission" @click="submission()">完成</button>
		</div>
		<div class="modify" v-show="modify">
			<div class="modify_box">
				<img src="../../../assets/img/yes.png" />
				<p class="success">密码修改成功</p>
				<p class="login" @click="exitOut">重新登录</p>
			</div>
		</div>
	</div>
</template>

<script>
	import * as api from '../../../api/api.js';
	export default {
		data() {
			return {
				modify: false, //修改成功之后
				confirmPass: "", //再次输入新密码
				newPass: '', //新密码
				oldPass: "", //旧密码
				oldCipher: true, //旧密码的输入框
				newCipher: true, //新密码的输入框
				newCipher1: true, //再次输入新密码的输入框
				img1: "static/img/eye1.png",
				img2: "static/img/eye.png",
				see: "",
				see1: "",
				see2: ""

			}
		},
		methods: {
			
			//修改密码提交
			submission() {
				if(this.oldPass == "") {
					this.$layer.msg('请输入旧密码');
					return false;
				}
				if(this.newPass == "") {
					this.$layer.msg('请输入新密码');
					return false;
				}
				if(this.confirmPass == "") {
					this.$layer.msg('请再次输入新密码');
					return false;
				}
				if(this.newPass != this.confirmPass) {
					$(".notes").html("两次密码输入不一致")
				}
				
				var url = api.UpdatePassWord
				var params = new URLSearchParams();
				params.append('oldPass', this.oldPass);
				params.append('newPass', this.newPass);
				params.append('confirmPass', this.confirmPass);
				this.$axios({
					method: "post",
					url: url,
					data: params
				}).then(res => {
					if(res.data.success) {
						this.$layer.msg(res.data.msg);
						this.modify = true;
						var that = this
						setTimeout(res => {
//							this.$router.push({
//								path: 'login'
//							})
							that.exitOut();
						}, 10);
						setTimeout(res => {
//							this.$router.push({
//								path: 'login'
//							})
							that.exitOut();
						}, 5000);
					} else {
						this.$layer.msg(res.data.msg)
					}

				}).catch(err => {
					console.log(err)
				});

			},
			//跟着小眼睛变化，密码框显示文本
			changeType() {
				this.see = !this.see;
				this.oldCipher = !this.oldCipher;
			},
			changeType1() {
				this.see1 = !this.see1;
				this.newCipher = !this.newCipher;
			},
			changeType2() {
				this.see2 = !this.see2;
				this.newCipher1 = !this.newCipher1;
			},
			//重新登录
			exitOut() {
				var url = api.LoginOuttest
				let admin = JSON.parse(window.localStorage.getItem('admin'))
				this.$axios({
					method: 'post',
					url: url
				}).then(res => {
					if(res.data.success) {
						window.localStorage.removeItem('admin');
						localStorage.clear();
						sessionStorage.clear();
						this.$layer.msg('退出成功');
						this.$router.push("/login")
					} else {
						this.$layer.msg("未登录，请重新登录")
						this.$router.push("/login")
					}
				})

			}
		}

	}
</script>

<style scoped="scoped">
	.psd_box {
		width: 100%;
		height: 100%;
		background: #fff;
		position: relative;
		padding-left: 75px;
		padding-top: 65px;
		line-height: 50px;
	}
	
	.in_frame {
		position: relative;
		display: inline-block;
		width: 490px;
		height: 36px;
	}
	
	.span {
		display: inline-block;
		width: 120px;
		height: auto;
		text-align: right;
		margin-right: 20px;
	}
	
	.notes {
		color: red;
	}
	
	input {
		width: 472px;
		height: 36px;
		outline: none;
		border: 1px solid #CCCCCC;
		border-radius: 5px;
		padding-left: 10px;
	}
	
	button {
		width: 96px;
		height: 32px;
		text-align: center;
		line-height: 32px;
		background: #559bfe;
		outline: none;
		border: 0;
		border-radius: 5px;
		font-size: 14px;
		color: #fff;
		margin-left: 235px;
		margin-top: 30px;
		cursor: pointer;
	}
	
	input::-webkit-input-placeholder,
	textarea::-webkit-input-placeholder {
		/* WebKit browsers */
		color: rgba(204, 204, 204);
	}
	
	input:-moz-placeholder,
	textarea:-moz-placeholder {
		/* Mozilla Firefox 4 to 18 */
		color: rgba(204, 204, 204);
	}
	
	input::-moz-placeholder,
	textarea::-moz-placeholder {
		/* Mozilla Firefox 19+ */
		color: rgba(204, 204, 204);
	}
	
	input:-ms-input-placeholder,
	textarea:-ms-input-placeholder {
		/* Internet Explorer 10+ */
		color: rgba(204, 204, 204);
	}
	
	.in_frame>img {
		width: 15px;
		height: 15px;
		display: inline-block;
		position: absolute;
		right: 25px;
		top: 15px;
	}
	/*修改成功*/
	
	.modify {
		width: 100%;
		height: 100%;
		text-align: center;
		position: absolute;
		background: #fff;
		z-index: 2;
		top: 0;
		left: 0;
	}
	
	.modify_box {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	
	.modify_box img {
		width: 166px;
		height: 166px;
	}
	
	.modify_box .success {
		color: RGBA(0, 0, 0, 1);
		font-size: 26px;
	}
	
	.modify_box .login {
		color: RGBA(56, 139, 255, 1);
		font-size: 20px;
		text-decoration: underline;
		cursor: pointer;
	}
</style>