<template>
	<div class="table">
		<div class="handle-box">
			<div class="box">
				名称：
				<template>
					<i-input v-model="userName" placeholder="请输入名称" style="width: 170px; margin-right: 20px;"></i-input>
				</template>
			</div>
			<div class="box">
				角色：
				<template>
					<el-select v-model="RoleId" style="width:170px;margin-right: 20px;" placeholder="全部" @change="roleCount">
						<el-option v-for="item in roleList" :key="item.roleId" :label="item.roleName" :value="item.roleId">
						</el-option>
					</el-select>
				</template>
			</div>
			<div class="box">
				状态：
				<template>
					<el-select v-model="IsStatus" style="width:170px;margin-right: 20px;" placeholder="全部" @change="statusCount">
						<el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</template>
			</div>
			<div class="box box_end">
				<el-button type="primary" @click="searchDetail" style="width: 70px;">查询</el-button>
				<el-button type="primary" style="width: 70px;" @click="reset">重置</el-button>
				<el-button style="width: 116px;background: RGBA(240, 124, 0, 1);color: #fff;border: none;" @click="newUser()" v-show="creatShow" class="news">创建用户</el-button>
			</div>
		</div>

		<div class="table-content">
			<div class="frame">
				<el-table stripe :data="tableData" style="width: 100% !important">
					<el-table-column type="index" width="70" label="编号" :index="typeIndex">
					</el-table-column>
					<el-table-column prop="userName" label="名称">
					</el-table-column>
					<el-table-column prop="roleName" label="角色">
					</el-table-column>
					<el-table-column prop="IsEnable" label="状态" :formatter="formatter">
					</el-table-column>
					<el-table-column prop="email" label="邮箱">
					</el-table-column>
					<el-table-column prop="createDateText" label="创建时间">
					</el-table-column>
					<el-table-column label="操作" width="180">
						<template scope="scope">
							<el-button type="text" :current="PageNum" size="small" @click="detailUser(scope.$index, scope.row)">查看</el-button>
							<span style="color: #388BFF;">/</span>
							<el-button type="text" :current="PageNum" size="small" style="color: #F07C00;" @click="relation(scope.$index, scope.row)">关联</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div class="pagination">
				<template>
					<Page :total="totalSize" :current="PageNum" :page-size='20' show-elevator @on-change="page" v-if="pageTotal>1"></Page>
				</template>
			</div>
		</div>

		<!--创建新用户-->
		<div class="user_box" v-show="showUser">
			<!--标题-->
			<p class="found_box">
				<span class="found">创建新用户</span>
				<img src="../../../assets/img/close.png" alt="" @click="closeUser()" />
			</p>
			<!--部门名称-->
			<div class="name_box">
				<span class="name">用&ensp;户&ensp;名：</span>
				<i-input placeholder="请输入用户名" style="width: 300px" v-model="UserName"></i-input>
			</div>
			<!--邮箱-->
			<div class="name_box">
				<span class="name left">邮&ensp;&ensp;&ensp;&ensp;箱：</span>
				<i-input placeholder="请输入邮箱" style="width: 300px" v-model="Email"></i-input>
			</div>
			<!--所属部门-->
			<div class="depart">
				<span class="name xiala left">部&ensp;&ensp;&ensp;&ensp;门：</span>
				<template v-if="this.user.isAdmin">
					<el-select v-model="deptId" style="width:200px;" placeholder="全部" @change="department">
						<el-option v-for="item in deptList" :key="item.value" :label="item.deptName" :value="item.deptId">
						</el-option>
					</el-select>
				</template>
				<span v-else>{{user.deptName}}</span>
			</div>
			<!--角色-->
			<div class="state">
				<span style="vertical-align: middle;">角&ensp;&ensp;&ensp;&ensp;色：</span>
				<span v-if="this.user.isAdmin" class="satateList aa">
					<RadioGroup v-for="(items,index) in partList" :key="index" v-model="roleName" @on-change="role(items.roleId)">
					<Radio :label="items.roleName">
					</Radio>
				</RadioGroup>
				</span>
				<span class="satateList bb" v-else>
					<RadioGroup v-for="(items,index) in list" :key="index" v-model="roleName" @on-change="role(items.roleId)">
					<Radio :label="items.roleName">
					</Radio>
				</RadioGroup>
				</span>

			</div>
			<div class="btn">
				<el-button type="primary" style="width:100px;height:40px;font-size: 16px;" @click="createUser">确认</el-button>
			</div>
		</div>
		<!--修改用户-->
		<div class="user_box" v-show="modifyShow">
			<!--标题-->
			<p class="found_box">
				<span class="found">修改用户</span>
				<img src="../../../assets/img/close.png" alt="" @click="close()" />
			</p>
			<!--部门名称-->
			<div class="name_box">
				<span class="name">用&ensp;户&ensp;名：</span>
				<i-input placeholder="请输入用户名" style="width: 300px" v-model="details.userName"></i-input>
			</div>
			<!--邮箱-->
			<div class="name_box">
				<span class="name left">邮&ensp;&ensp;&ensp;&ensp;箱：</span>
				<i-input placeholder="请输入邮箱" style="width: 300px" v-model="details.email"></i-input>
			</div>
			<!--所属部门-->
			<div class="depart">
				<span class="name xiala left">部&ensp;&ensp;&ensp;&ensp;门：
					<template v-if="this.user.isAdmin">
					<el-select v-model="deptId" style="width:200px;" placeholder="全部" @change="department">
						<el-option v-for="item in deptList" :key="item.value" :label="item.deptName" :value="item.deptId">
						</el-option>
					</el-select>
				</template>
				</span>
				<span v-if="this.deptList.length=='1'">{{user.deptName}}</span>
			</div>
			<!--角色-->
			<div class="state">
				<span style="vertical-align: middle;">角&ensp;&ensp;&ensp;&ensp;色：</span>
				<div class="satateList">
					<RadioGroup v-for="(items,index) in partList" :key="index" v-model="roleName" @on-change="role(items.roleId)">
						<Radio :label="items.roleName">
						</Radio>
					</RadioGroup>
				</div>

			</div>
			<!--状态-->
			<div class="state">
				<span style="vertical-align: middle;">状&ensp;&ensp;&ensp;&ensp;态：</span>
				<RadioGroup v-model="isEnable">
					<Radio label="use">
						<span>使用</span>
					</Radio>
					<Radio label="close">
						<span>关闭</span>
					</Radio>
				</RadioGroup>
			</div>
			<div class="state">
				<span style="vertical-align: middle;">重设密码：</span>
				<button class="resetPsd" @click="resetPassword(details.userId)">重置</button>
			</div>

			<div class="btn">
				<el-button type="primary" style="width:100px;height:40px;font-size: 16px;" @click="usermod(details)">确认</el-button>
			</div>
		</div>
		<!--遮罩-->
		<div class="zhezhao" v-show="show"></div>
		<!--查看详情-->
		<div class="detail_box" v-show="detailShow">
			<!--标题-->
			<p class="found_box">
				<span class="found">查看信息</span>
				<img src="../../../assets/img/close.png" alt="" @click="close" />
			</p>

			<div class="account_box" style="padding-bottom: 35px;">
				<div class="name_box">
					<span class="name">用&ensp;户&ensp;名：{{details.userName}}</span>
				</div>
				<div class="name_box">
					<span class="name">邮&ensp;&ensp;&ensp;&ensp;箱：{{details.email}}</span>
				</div>
				<!--所属部门-->
				<div class="depart">
					<span class="name xiala left">部&ensp;&ensp;&ensp;&ensp;门：</span>
					<span class="name_right">{{details.deptName}}</span>
				</div>
				<!--角色-->
				<div class="state">
					<span style="vertical-align: middle;">角&ensp;&ensp;&ensp;&ensp;色：{{details.roleName}}</span>
				</div>
				<!--状态-->
				<div class="state">
					<span style="vertical-align: middle;">状&ensp;&ensp;&ensp;&ensp;态：</span>
					<span v-if="details.isEnable">使用</span>
					<span v-if="!details.isEnable">关闭</span>
				</div>
			</div>
		</div>
		<!--关联账号-->
		<div class="relation" v-show="relationShow">
			<div class="relation-top">
				前端账号关联
				<img src="../../../assets/img/close.png" @click="close" />
			</div>
			<div class="relation-bottom">
				<span style="float: left;margin-top: 5px;">手机号：</span>
				<template style="float: left;">
					<i-input placeholder="请输入要关联手机号" style="width: 440px; margin-right: 20px;" v-model="phone"></i-input>
				</template>
				<el-button type="primary" style="float: right;" @click="resetPhone">重置</el-button>
				<el-button type="primary" style="float: right; margin-right: 16px;" @click="searchPhone">查询</el-button>
				<div class="list">
					<div class="table-head">
						<span>名称</span>
						<span>角色</span>
						<span>状态</span>
						<span>手机</span>
						<span>创建时间</span>
						<span>操作</span>
					</div>
					<div class="table-body" v-for="item in phoneList">
						<span>{{item.userName}}</span>
						<span>{{item.accountTypeText}}</span>
						<span>
							<div v-if="item.isEnable">开启</div>
							<div v-else>关闭</div>
						</span>
						<span>{{item.phone}}</span>
						<span>{{item.createDateText}}</span>
						<span class="operation">
							<div style="color: #F70800; cursor: pointer;" v-if="item.isRelation" @click="relationAccount(item.userId,false)">解除关联</div>
							<div style="color: #F07C00; cursor: pointer;" @click="relationAccount(item.userId,true)"  v-else>关联账号</div>
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import baseUrl from '../common/baseUrl';
	import * as api from '../../../api/api.js'; //引入api.js文件
	export default {
		data() {
			return {
				phone: "", //关联的手机号
				relationShow: false, //创建关联
				lookShow: false, //修改信息
				creatShow: false, //创建用户
				addRoleId: "", // 创建用户角色id
				roleName: '', //创建用户角色绑定
				departmentVal: "", //部门内容
				departmentId: "", //部门id
				deptList: [], //部门列表
				isEnable: '',
				Email: "", //创建用户邮箱
				UserName: "", //创建用户名称
				partList: [], //查看信息的角色列表
				type: 'ResetPassWrok', //对客户端操作类型（重置密码）
				buttenType: "", //按钮类型
				functionId: "", //functionId
				buttonList: [], //按钮权限数组
				showUser: false, //创建新用户
				RoleId: "", //角色查询id
				modifyShow: false, //修改用户
				user: {}, //登录用户信息
				deptId: "", //用户id
				details: {}, // 查看详情
				userName: '', //用户名称
				IsEnable: '', //状态
				vertical: '',
				IsStatus: '', //状态重置
				PageNum: 1, //当前页
				PageSize: 20, //请求行数名称
				pageTotal: 0, //总页数
				totalSize: 0, //总条数
				show: false, //创建新用户
				detailShow: false, //查看详情是否显示
				roleList: [], //角色列表
				tableData: [], //内容列表数据
				//状态内容
				statusList: [{
						value: '',
						label: '全部'
					}, {
						value: true,
						label: '使用'
					},
					{
						value: false,
						label: '关闭'
					}
				],
				list: [], //除了管理员角色以外的角色列表
				functionId: "", //菜单id
				phoneUserId: "", //后台userId
				phoneList: [], //
			}
		},
		created() {
			this.getUserInfo();
			this.getData();
			this.getButtinList();
			this.getRoleList();
			this.getDeptList();
		},
		computed: {

		},
		methods: {
			//创建关联弹窗
			relation(index, row) {
				this.phoneList = []
				this.phoneUserId = row.userId;
				this.qianInformation();
				this.relationShow = true;
				this.show = true;

			},
			//账号操作 （关联或者取消关联）
			relationAccount(userId, boolean) {
				var url = api.RelationClient;
				var params = new URLSearchParams();
				params.append('mgrUserId', this.phoneUserId);
				params.append('clientUserId', userId);
				params.append('isAdd', boolean);
				this.$axios({
					method: "POST",
					url: url,
					data: params,
				}).then(res => {
					console.log(res.data)
					if(res.data.success) {
						if(boolean){
							this.$layer.msg("关联成功");
						}else{
							this.$layer.msg("解除成功");
						}
						for(var i = 0; i < this.phoneList.length; i++) {
							this.phoneList[i].isRelation = !this.phoneList[i].isRelation
						}
					} else {
						this.$layer.msg(res.data.msg);
					}
				}).catch(err => {
					console.log(err)
				})
			},
			////获取后台账号关联的前端信息
			qianInformation() {
				var url = api.GetMgrRelationClientInfo;
				this.$axios({
					method: "get",
					url: url,
					params: {
						mgrUserId: this.phoneUserId
					},
				}).then(res => {
					if(res.data.success) {
						this.phoneList = res.data.data
					}
				}).catch(err => {
					console.log(err)
				})
			},
			//前端关联账号重置
			resetPhone() {
				this.phone = "";
				this.qianInformation()
			},
			//前端手机号关联查询
			searchPhone() {
				var url = api.GetClientInfo;
				this.$axios({
					method: "get",
					url: url,
					params: {
						phone: this.phone,
						mgrUserId: this.phoneUserId
					},
				}).then(res => {
					if(res.data.success) {
						this.phoneList = res.data.data
					}
				}).catch(err => {
					console.log(err)
				})

			},
			//获取登录用户信息
			getUserInfo() {
				var url = api.GetUserInfo;
				this.$axios({
					method: "get",
					url: url
				}).then(res => {
					if(res.data.success) {
						this.user = res.data.data;
						if(!res.data.data.isAdmin) {
							var url = api.RoleListByDept;
							this.$axios({
								method: "get",
								url: url,
								params: {
									deptId: this.user.deptId
								}
							}).then(res => {
								if(res.data.success) {
									this.list = res.data.data;
									console.log(this.list)
								}
							}).catch(err => {
								console.log(err)
							})

						}

					}
				}).catch(err => {
					console.log(err)
				})
			},
			//获取按钮权限
			getButtinList() {
				if(this.functionId) {
					this.functionId = localStorage.getItem('functionId');
				} else {
					this.functionId = sessionStorage.getItem('functionid');
				}
				var url = api.QueryFunction
				this.$axios({
					method: "get",
					url: url,
					params: {
						functionId: this.functionId,
					}
				}).then(res => {
					if(res.data.success) {
						this.buttonList = res.data.data;
						this.creatShow = this.buttonList[0].isexist //创建用户权限
						this.lookShow = this.buttonList[2].isexist //修改信息
					}
				}).catch(err => {
					console.log(err)
				})
			},
			//获取内容列表数据
			getData() {
				var params = new URLSearchParams();
				params.append('PageNum', this.PageNum);
				params.append('PageSize', this.PageSize);
				this.$axios({
					method: 'POST',
					url: baseUrl + '/api/mgr/Role_Dept/UserMgrQueryList',
					data: params
				}).then(res => {
					this.tableData = res.data.rows;
					this.totalSize = res.data.totalSize;
					this.pageTotal = res.data.pageTotal;
				}).catch(err => {
					console.log(err)
				})

			},
			//编号
			typeIndex(index) {
				return index + (this.PageNum - 1) * 20 + 1;
			},
			//状态列表
			formatter(row, column) {
				if(row.isEnable == false) {
					return "关闭"
				} else {
					return "使用"
				}
			},
			//查询功能
			searchDetail() {
				this.PageNum = 1
				var params = new URLSearchParams();
				params.append('IsEnable', this.IsEnable);
				params.append('UserName', this.userName);
				params.append('RoleId', this.RoleId);
				params.append('PageSize', this.PageSize);
				this.$axios({
					method: 'POST',
					url: baseUrl + '/api/mgr/Role_Dept/UserMgrQueryList',
					data: params
				}).then(res => {
					if(res.data.success) {
						this.tableData = res.data.rows;
						this.totalSize = res.data.totalSize;
						this.pageTotal = res.data.pageTotal
					}
				}).catch(err => {
					console.log(err)
				})
			},
			//重置
			reset() {
				this.PageNum = 1;
				this.getData();
				this.userName = ""; //清空用户名称
				this.RoleId = ""; //清空角色
				this.IsStatus = ""; //清空状态
				this.IsEnable = ""; //清空

			},
			//角色查询
			roleCount(val) {
				this.RoleId = val
			},
			//状态查询
			statusCount(value) {
				this.IsEnable = Boolean(this.IsEnable)
				this.IsEnable = value
			},
			//打开创建新用户弹窗
			newUser() {
				this.getUserInfo();
				this.partList = [];
				this.addRoleId = "";
				this.roleName = "";
				this.departmentVal = "";
				this.UserName = "";
				this.Email = "";
				this.deptId = "";
				this.items = "";
				this.show = !this.show;
				this.showUser = true;
			},
			//关闭弹窗遮罩层
			close() {
				this.show = false;
				this.detailShow = false;
				this.showUser = false;
				this.modifyShow = false;
				this.showUser = false;
				this.relationShow = false;
				this.phoneShow = false;
				this.phone = "";
				this.searchDetail()
			},
			//关闭创建新用户弹窗
			closeUser() {
				this.partList = [];
				this.show = false;
				this.showUser = false;
				this.addRoleId = "";
				this.deptId = "";
				this.items = "";

			},
			//查看详情弹框
			detailUser(index, row) {
				this.partList = [];
				var that = this;
				this.deptId = row.deptId;
				this.roleName = "";
				if(row.isEnable) {
					this.isEnable = 'use';
				} else {
					this.isEnable = 'close';
				}
				this.getRoleListByDept(row.deptId);
				this.show = true;
				if(this.lookShow) {
					this.modifyShow = true;
				} else {
					this.detailShow = true;
				}
				that.details = row;
				setTimeout(function() {
					that.roleName = row.roleName
				}, 200);
			},
			//通过部门得到角色列表
			getRoleListByDept(deptId) {
				var url = api.RoleListByDept;
				this.$axios({
					method: "get",
					url: url,
					params: {
						deptId: this.deptId
					}
				}).then(res => {
					if(res.data.success) {
						this.partList = res.data.data;
					}
				}).catch(err => {
					console.log(err)
				})
			},
			//分页
			page(val) {
				this.PageNum = val;
				var params = new URLSearchParams();
				params.append('IsEnable', this.IsEnable);
				params.append('UserName', this.userName);
				params.append('RoleId', this.RoleId);
				params.append('PageNum', this.PageNum);
				params.append('PageSize', this.PageSize);
				this.$axios({
					method: 'POST',
					url: baseUrl + '/api/mgr/Role_Dept/UserMgrQueryList',
					data: params
				}).then(res => {
					if(res.data.success) {
						this.tableData = res.data.rows;
						this.totalSize = res.data.totalSize;
						this.pageTotal = res.data.pageTotal
					}
				}).catch(err => {
					console.log(err)
				})
			},
			//重置密码
			resetPassword(userId) {
				var url = api.ResetMgrPass
				this.$axios({
					method: "get",
					url: url,
					params: {
						userId: userId
					}
				}).then(res => {
					if(res.data.success) {
						this.$layer.msg('重置成功')
					}
				}).catch(err => {
					console.log(err)
				})

			},
			//获取当前账户的角色
			getRoleList() {
				var url = api.RoleList
				this.$axios({
					method: "get",
					url: url
				}).then(res => {
					if(res.data.success) {
						this.roleList = res.data.data
					}
				}).catch(err => {
					console.log(err)
				})
			},
			//获取部门
			getDeptList() {
				var url = api.DeptList;
				this.$axios({
					method: "get",
					url: url
				}).then(res => {
					if(res.data.success) {
						this.deptList = res.data.data;
					}
				}).catch(err => {
					console.log(err)
				})
			},
			//部门
			department(val) {
				this.partList = [];
				this.addRoleId = "";
				this.deptId = val;
				this.details.roleId = "";
				this.getRoleListByDept(val);
			},
			//角色
			role(val) {
				this.addRoleId = val;
				console.log(val)
			},
			//创建用户确认
			createUser() {
				let re = /^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/;
				if(!this.UserName) {
					this.$layer.msg("请输入用户名")
					return false;
				}
				if(!this.Email) {
					this.$layer.msg("请输入邮箱");
					return false;
				} else if(!re.test(this.Email)) {
					this.$layer.msg("请输入正确的邮箱格式");
					return false;
				}
				if(this.user.isAdmin) {
					if(!this.deptId) {
						this.$layer.msg("请选择部门");
						return false;
					}
				}
				if(!this.roleName) {
					this.$layer.msg("请选择角色");
					return false;
				}
				var url = api.AddUserMgr
				this.$axios({
					method: "get",
					url: url,
					params: {
						UserName: this.UserName,
						Email: this.Email,
						IsEnable: true,
						RoleId: this.addRoleId
					}
				}).then(res => {
					if(res.data.success) {
						this.showUser = false;
						this.show = false;
						this.$layer.msg(res.data.msg);
						this.addRoleId = "";
						this.getData();
					} else {
						this.$layer.msg(res.data.msg);
					}
				}).catch(err => {
					console.log(err)
				})
			},
			//修改用户确认
			usermod(details) {
				details = this.details
				console.log(this.details)
				if(this.isEnable == 'use') {
					details.isEnable = true;
				} else if(this.isEnable == 'close') {
					details.isEnable = false;
				}
				if(this.addRoleId) {
					details.roleId = this.addRoleId
				}
				if(this.partList.length == '0') {
					this.$layer.msg("请选择有效部门")
					return false;
				} else {
					if(!this.details.roleId) {
						this.$layer.msg("请选择角色")
						return false;
					}
				}
				var url = api.EditUserMgr
				this.$axios({
					method: "get",
					url: url,
					params: details
				}).then(res => {
					if(res.data.success) {
						this.$layer.msg(res.data.msg)
						this.modifyShow = false;
						this.show = false;
						this.addRoleId = "";
						this.searchDetail()
					} else {
						this.$layer.msg(res.data.msg);
					}
				}).catch(err => {
					console.log(err)
				})
			}

		}
	}
</script>

<style scoped>
	.handle-box {
		padding: 22px 10px;
		background: rgba(244, 244, 244);
		margin-bottom: 20px;
		background: #fff;
	}
	
	.handle-select {
		width: 120px;
	}
	
	.handle-input {
		width: 300px;
		display: inline-block;
	}
	
	.box {
		display: inline-block;
		margin: 10px 0;
		width: 270px;
		white-space: nowrap;
	}
	
	.box_end {
		float: right;
		margin-right: 5%;
	}
	
	.table-content {
		display: flex;
		flex: 1;
		flex-direction: column;
		overflow: hidden;
		background: #fff;
	}
	
	.table-content .frame {
		-webkit-box-flex: 1;
		-webkit-flex: 1;
		-ms-flex: 1;
		flex: 1;
		display: -moz-box;
		display: -ms-flexbox;
		display: -webkit-box;
		display: -webkit-flex;
		display: box;
		display: flexbox;
		display: flex;
		-webkit-box-orient: inherit;
		-webkit-flex-direction: inherit;
		-ms-flex-direction: inherit;
		flex-direction: inherit;
		overflow-x: auto;
	}
	/*创建新用户*/
	
	.user_box {
		width: 600px;
		border: 1px solid #ccc;
		background: #fff;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		z-index: 10;
	}
	
	.found_box {
		height: 50px;
		line-height: 50px;
		width: 100%;
		background: rgba(248, 248, 248, 1);
		border-bottom: 1px solid rgba(226, 226, 226, 1);
		font-size: 18px;
	}
	
	.found {
		display: inline-block;
		padding-left: 2%;
	}
	
	.found_box>img {
		display: inline-block;
		float: right;
		width: 30px;
		height: 30px;
		cursor: pointer;
		padding-top: 10px;
		padding-right: 2%;
	}
	
	.name_box {
		width: 90%;
		margin: 0 auto;
		font-size: 16px;
		margin-top: 5%;
		color: #666;
	}
	
	.depart {
		margin-left: 5%;
		font-size: 16px;
		margin-top: 5%;
	}
	
	.zhezhao {
		width: 100%;
		height: 100%;
		background: #000;
		opacity: .3;
		position: fixed;
		top: 0;
		left: 0;
		/*display: none;*/
		z-index: 1;
	}
	
	.state {
		margin-left: 5%;
		margin-top: 5%;
		font-size: 16px;
	}
	
	.btn {
		text-align: center;
		margin: 5% 0;
		font-size: 16px;
	}
	/*查看详情*/
	
	.detail_box {
		width: 600px;
		border: 1px solid #ccc;
		background: #fff;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		z-index: 10;
		border-radius: 10px;
		overflow: hidden;
	}
	
	.content_box {
		font-size: 14px;
		padding-left: 10%;
		margin-top: 5%;
		cursor: pointer;
	}
	
	.user_checkbox {
		padding-left: 8%;
	}
	
	.user_checkbox>p {
		height: 28px;
		line-height: 28px;
	}
	
	.name {
		font-size: 16px;
	}
	
	.btn {
		text-align: center;
		margin: 5% 0;
		font-size: 16px;
	}
	
	.resetPsd {
		width: 96px;
		height: 40px;
		border: 1px solid RGBA(240, 124, 0, 1);
		color: RGBA(240, 124, 0, 1);
		border-radius: 5px;
		text-align: center;
		line-height: 40px;
		background: #fff;
		outline: none;
		cursor: pointer;
	}
	
	.satateList {
		display: inline-block;
		width: 67%;
		vertical-align: top;
	}
	
	.news:hover {
		background: #d87000 !important;
		border: 1px solid #d87000;
	}
	/*关联账号*/
	
	.relation {
		width: 800px;
		height: 315px;
		background: #fff;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border-radius: 5px;
		overflow: hidden;
		z-index: 10;
	}
	
	.relation-top {
		height: 50px;
		line-height: 50px;
		padding: 0 30px;
		background: #F5F5F5;
		border-bottom: 1px solid #dedede;
	}
	
	.relation-top img {
		float: right;
		margin-top: 15px;
		cursor: pointer;
	}
	
	.relation-bottom {
		height: 100%;
		width: 100%;
		padding-top: 20px;
		padding-left: 30px;
		padding-right: 30px;
	}
	
	.relation-bottom .list {
		width: 100%;
		height: 100%;
		padding-top: 30px;
	}
	
	.list .table-head {
		height: 60px;
		width: 100%;
		line-height: 60px;
		background: #E7E9EB;
	}
	
	.table-head span {
		display: inline-block;
		width: 16%;
		text-align: center;
	}
	
	.table-body {
		height: 60px;
		line-height: 60px;
		width: 100%;
	}
	
	.table-body span {
		display: inline-block;
		width: 16%;
		text-align: center;
	}
	
	.operation div {
		display: inline-block;
	}
</style>