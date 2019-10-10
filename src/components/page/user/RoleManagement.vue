<template>
	<div class="table">
		<div class="handle-box">
			<div class="box">
				角色名称：
				<template>
					<i-input placeholder="请输入角色名称" v-model="RoleName" style="width: 170px; margin-right: 20px;" @on-change="changeIn"></i-input>
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
				<el-button type="primary" @click="searchList()" style="width: 70px;">查询</el-button>
				<el-button type="primary" style="width: 70px;" @click="reset()">重置</el-button>
				<el-button style="width: 116px;background: RGBA(240, 124, 0, 1);color: #fff;border: none;" @click="newRole()" class="news" v-show="this.cjRole.isexist">创建新角色</el-button>
			</div>
		</div>
		<div class="table-content">
			<div class="frame">
				<el-table :data="tableData" stripe style="width: 100% !important">
					<el-table-column type="index" width="70" label="编号" :index="typeIndex">
					</el-table-column>
					<el-table-column prop="roleName" label="角色名称">
					</el-table-column>
					<el-table-column prop="deptName" label="部门名称">
					</el-table-column>
					<el-table-column prop="isEnable" label="状态" :formatter="formatter">
					</el-table-column>
					<el-table-column prop="createDateText" label="创建时间">
					</el-table-column>
					<el-table-column label="操作" width="180">
						<template scope="scope">
							<el-button type="text" size="small" @click="detailRole(scope.$index, scope.row)">查看</el-button>
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
		<!--创建新角色-->
		<div class="newRole" v-show="show">
			<!--标题-->
			<p class="found_box">
				<span class="found">创建角色</span>
				<img src="../../../assets/img/close.png" alt="" @click="closeRole()" />
			</p>
			<div class="content_box">
				<!--角色名称-->
				<div class="name_box">
					<span class="name">角色名称：</span>
					<template>
						<i-input placeholder="请输入角色名称" v-model="inputa" style="width: 300px !important;"></i-input>
					</template>
				</div>
				<!--所属部门-->
				<div class="belong">
					<span class="belong_left">所属部门：</span>
					<span class="belong_right" v-if="this.roleUser1.deptId == 'f367e37a-a799-4af5-8364-547b96b2e436'">
						<el-select v-model="status1" style="width:250px;margin-right: 20px;" placeholder="请选择" @change="departCount">
							<el-option v-for="item in departList" :key="item.value" :label="item.deptName" :value="item.deptId">
							</el-option>
						</el-select>
					</span>
					<span v-model="status1" v-else>{{roleUser1.deptName}}</span>
				</div>
				<div style="height: 600px;margin-top: 15px;">
					<div class="user_l">
						角色权限:
					</div>
					<div class="user_r" v-if="this.roleUser1.isAdmin">
						<!--内容管理-->
						<el-tree :data="roleList" show-checkbox node-key="functionId"   @check='checkChange' :props="props">
						</el-tree>
					</div>
					<div class="user_r" v-else>
						<!--内容管理-->
						<el-tree :data="role_li" show-checkbox node-key="functionId"   @check='checkChange' :props="props">
						</el-tree>
					</div>
				</div>
			</div>
			<p class="btn">
				<el-button type="primary" style="font-size: 16px;width: 100px;height: 40px;" @click="sureRole()">确认</el-button>
			</p>
		</div>
		<!--遮罩-->
		<div class="zhezhao" v-show="show" @click="close"></div>
		<!--修改角色弹框-->
		<div class="detail_box" v-show="detailShow">
			<!--标题-->
			<p class="found_box">
				<span class="found"  v-if="this.modifyView.isexist">修改角色</span>
				<span class="found" v-else>查看角色</span>
				<img src="../../../assets/img/close.png" alt="" @click="closeModify()" />
			</p>
			<div class="content_box">

				<!--部门名称-->
				<div class="name_box"  v-if="this.modifyView.isexist">
					<span class="name">角色名称：</span>
					<el-input v-model="rowContent.roleName" placeholder="请输入角色名称" style="width: 80%;"></el-input>
				</div>
				<!--部门名称-->
				<div class="name_box" v-else>
					<span class="name">角色名称：</span>
					<span>{{rowContent.roleName}}</span>
				</div>
				<!--所属部门-->
				<div class="belong" >
					<span class="belong_left">所属部门：</span> 
					<!--v-if="this.modifyView.isexist"-->
					<span class="belong_right"  v-if="this.roleUser1.isAdmin">
						<el-select v-model="status" style="width:250px;margin-right: 20px;" placeholder="全部" @change="departCount1">
							<el-option v-for="item in departList" :key="item.value" :label="item.deptName" :value="item.deptId">
							</el-option>
						</el-select>
					</span>
					<span v-else>{{roleUser1.deptName}}</span>
				</div>
				<!--状态-->
				<div class="state" style="font-size: 16px;margin-bottom: 15px;"  v-if="this.modifyView.isexist">
					<span>状&ensp;&ensp;&ensp;&ensp;态：</span>
					<RadioGroup v-model="vertical2" @on-change="radio()">
						<Radio label='true'>
							<span style="font-size: 16px;">使用</span>
						</Radio>
						<Radio label='false'>
							<span style="font-size: 16px;">关闭</span>
						</Radio>
					</RadioGroup>
				</div>
				<!--状态-->
				<div class="state" style="font-size: 16px;margin-bottom: 15px;" v-else>
					<span>状&ensp;&ensp;&ensp;&ensp;态：</span>
					<span v-if="rowContent.isEnable">使用</span>
					<span v-else>关闭</span>
				</div>
				<div>
					<div class="user_left">角色权限:</div>
					<div class="user_right"  v-if="this.modifyView.isexist">
						<!--内容管理-->
						<el-tree :data="roleDetailList" show-checkbox node-key="functionId"   @check='checkModify' :props="props1" :default-expand-all=true :default-checked-keys="err">
						</el-tree>
					</div>
					<div class="user_right" v-else>
						<!--内容管理-->
						<el-tree :data="roleDetailList" show-checkbox node-key="functionId"   @check='checkModify' :props="props1" :default-expand-all=true :default-checked-keys="err">
						</el-tree>
					</div>
				</div>
			</div>
			<p class="btn">
				<el-button type="primary" style="font-size: 16px;width: 100px;height: 40px;" @click="role_detail()" v-show="this.modifyView.isexist">确认</el-button>
			</p>
		</div>

		<!--查看详情弹框-->
		<div class="detail_box" v-show="lookShow">
			<!--标题-->
			<p class="found_box">
				<span class="found">查看角色</span>
				<img src="../../../assets/img/close.png" alt="" @click="closeModify()" />
			</p>
			<div class="content_box">

				<!--部门名称-->
				<div class="name_box">
					<span class="name">角色名称：</span>
					<span>{{rowContent.roleName}}</span>
				</div>
				<!--所属部门-->
				<div class="belong">
					<span class="belong_left">所属部门：</span>
					<span v-model="status">{{rowContent.deptName}}</span>

				</div>
				<!--状态-->
				<div class="state" style="font-size: 16px;margin-bottom: 15px;">
					<span>状&ensp;&ensp;&ensp;&ensp;态：</span>
					<span v-if="rowContent.isEnable">使用</span>
					<span v-if="!rowContent.isEnable">关闭</span>
				</div>
				<div>
					<div class="user_left">角色权限:</div>
					<div class="user_right">
						<!--内容管理-->
						<el-tree :data="roleDetailList" :default-expand-all=true show-checkbox node-key="functionId"   @check='checkModify' :props="props1" :default-checked-keys="err">
						</el-tree>

					</div>
				</div>
			</div>
			<p class="btn">
				<el-button type="primary" style="font-size: 16px;width: 100px;height: 40px;" @click="role_detail()" v-show="this.modifyView.isexist">确认</el-button>
			</p>
		</div>
		<div class="zhezhao1" v-show="detailShow" @click="close"></div>
	</div>
</template>

<script>
	import baseUrl from '../common/baseUrl'
	export default {
		data() {
			return {
				err: [],
				props1: {
					children: 'children',
			        label: 'functionName'        
				}, //修改角色权限
				props: {
					children: 'children',
					label: 'functionName'        
				}, //创建角色权限
				buttenType: "", //按钮类型
				functionIdd: "", //functionId
				buttonList: [], //按钮权限数组
				rowContent: '', //查看后与内容列表相同
				roleId: '', //修改角色id
				roleName: '', //修改角色输入框
				vertical2: '', //修改角色状态
				ruleArry: [], //修改角色复选框push进去的数组
				roleDetailList: [], //修改角色内容
				roleUser1: '', //创建角色所属部门内容(用户信息的内容)
				status: '', //修改角色所属部门内容
				status1: '', //创建角色弹框中的状态
				departList: [], //创建部门弹框的所属部门列表
				roleArry: [], //创建角色复选框push进去的数组
				roleList: [], //创建角色列表
				DeptId: '', //列表部门id
				deptId: '', //创建角色部门id
				createDate: '', //创建时间
				deptName1: '', //部门名称
				IsEnable: '', //状态
				isEnable1: true, //创建角色的状态
				IsStatus: '', //重置状态
				RoleName: '', //角色名称
				PageNum: 1,
				PageSize: 20,
				pageTotal: 0,
				totalSize: 0,
				vertical: '',
				input: '', //修改角色输入框
				inputa: '', //创建角色输入框
				//创建新角色
				options: [{
					value: '选项1',
					label: '编辑'
				}, {
					value: '选项2',
					label: '产品'
				}, {
					value: '选项3',
					label: '技术'
				}, {
					value: '选项4',
					label: '运营'
				}],
				value: '',
				show: false,
				lookShow: false, //查看详情
				detailShow: false, //修改角色
				is_search: false,
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
				tableData: [], //获取内容列表
				funcId: "", //按钮权限的functionId
				cjRole: '', //创建角色按钮
				lookView: '', //查看信息按钮
				modifyView: '', //修改信息权限
				add_l: true,
				role_li: [] //创建角色权限

			}
		},
		created() {
			this.getData();
			this.getUser();
			this.getFuncId();
		},
		methods: {
			//获取按钮权限
			getFuncId() {
				if(!this.funcId){
					this.funcId=localStorage.getItem('functionId'); //登录
				}else{
					this.funcId = sessionStorage.getItem('functionid'); //列表
				}
				this.$axios({
					method: 'GET',
					url: baseUrl + '/api/mgr/Role_Dept/QueryFunction',
					params: {
						functionId: this.funcId
					}
				}).then(res => {
					this.cjRole = res.data.data[0] //创建角色按钮
					this.lookView = res.data.data[1] //查看信息按钮
					this.modifyView = res.data.data[2] //修改信息按钮
				})
			},
			changeIn(val) {
				console.log(val)
			},
			//获取内容列表
			getData() {
				var params = new URLSearchParams();
				params.append('PageNum', this.PageNum);
				params.append('PageSize', this.PageSize);
				params.append('DeptId', this.DeptId);
				params.append('RoleName', this.RoleName);
				params.append('deptName', this.deptName1);
				params.append('IsEnable', this.IsStatus);
				params.append('createDate', this.createDate);
				this.$axios({
					method: 'POST',
					url: baseUrl + '/api/mgr/Role_Dept/RoleQueryList',
					data: params
				}).then(res => {
					this.tableData = res.data.rows;
					this.pageTotal = res.data.pageTotal;
					this.totalSize = res.data.totalSize;
					this.totalSize = res.data.totalSize;
					this.pageTotal = res.data.pageTotal
				})
			},
			//获取个人用户信息
			getUser() {
				this.$axios({
					method: "GET",
					url: baseUrl + '/api/mgr/Role_Dept/GetUserInfo'
				}).then(res => {
					if(res.data.success) {
						this.roleUser1 = res.data.data;
						this.deptId1 = res.data.data.deptId;
						if(!this.roleUser1.isAdmin) {
							
							this.$axios({
								method: 'GET',
								url: baseUrl + '/api/mgr/function/menus',
								params: {
									DepartFunction: this.deptId,
									Add: this.add_l
								}
							}).then(res => {
								var cj_a = res.data.data;
								for(let j = 0; j < cj_a.length; j++) {
									var cj_b = cj_a[j].children;
									for(let k = 0; k < cj_b.length; k++) {
										if(!cj_b[k].isEnable) {
											cj_b.splice(k, 1)
										}
									}
								}
								this.role_li = cj_a;
							})
						}

					}

				})
			}, 
			//编号问题
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
			//分页
			page(value) {
				this.PageNum = value
				this.getData();
			},
			//查询
			searchList() {
				this.PageNum = 1;
				this.getData();
			},
			//状态查询
			statusCount(value) {
				this.IsEnable = Boolean(this.IsEnable)
				this.IsEnable = value
			},
			//重置
			reset() {
				this.page(1)
				this.PageNum = 1;
				this.RoleName = ""
				this.IsStatus = ""
				var params = new URLSearchParams();
				params.append('PageNum', this.PageNum);
				params.append('PageSize', this.PageSize);
				this.$axios({
					method: 'POST',
					url: baseUrl + '/api/mgr/Role_Dept/RoleQueryList',
					data: params
				}).then(res => {
					this.tableData = res.data.rows;
					this.pageTotal = res.data.pageTotal;
					this.totalSize = res.data.totalSize;
				})
			},
			//创建新角色
			newRole() {
				this.role_li = [];
				this.getUser();
				this.show = !this.show;
				this.deparList();
				this.inputa = "";
				this.status1 = "";
				this.roleList = [];
				this.deptId = "";
				this.roleArry = [];
			},
			//所属部门列表
			deparList() {
				this.$axios({
					method: 'GET',
					url: baseUrl + '/api/mgr/Role_Dept/DeptList'
				}).then(res => {
					this.departList = res.data.data
				})
			},
			//创建角色所属部门
			departCount(status) {
				console.log(this.status)
				this.jurisdiction(status)
			},
			//创建角色通过部门得到权限
			jurisdiction(deptId) {
				this.deptId = deptId;
				this.$axios({
					method: 'GET',
					url: baseUrl + '/api/mgr/function/menus',
					params: {
						DepartFunction: deptId,
						Add: this.add_l
					}
				}).then(res => {
					var cj_a = res.data.data;
					for(let j = 0; j < cj_a.length; j++) {
						var cj_b = cj_a[j].children;
						for(let k = 0; k < cj_b.length; k++) {
							if(!cj_b[k].isEnable) {
								cj_b.splice(k, 1)
							}
						}
					}
					this.roleList = cj_a;
				})
			},
			
			//复选框点击事件
			checkChange(e, val) {    
				var chlArry = val.checkedKeys;        
				var fatArry = val.halfCheckedKeys;        
				this.roleArry = [...chlArry, ...fatArry];
			},
			//点击创建角色的确认按钮
			sureRole() {
				if(!this.inputa) {
					this.$layer.msg("请输入角色名称");
					return false;
				}
				if(this.roleUser1.isAdmin) {
					if(!this.status1) {
						this.$layer.msg("请选择所属部门");
//						this.status1 = this.deptId1;
						return false;
					}
				}

				var check = this.roleArry.join(',');
				if(!check) {
					this.$layer.msg("请选择角色权限");
					return false;
				}
				if(!this.status1) {
					this.status1 = this.deptId1;
				}
				this.$axios({
					method: 'GET',
					url: baseUrl + '/api/mgr/Role_Dept/AddRole',
					params: {
						RoleName: this.inputa,
						FunctionString: check,
						DeptId: this.status1,
						IsEnable: this.isEnable1
					}
				}).then(res => {
					if(res.data.success) {
						this.$layer.msg(res.data.msg);
						this.show = false;
						this.zhezhao = false;
						this.getData();
						this.inputa = "";
						this.status1 = "";
						this.roleArry =[];
					} else {
						this.$layer.msg(res.data.msg);
					}

				})
			},
			//点击打开关闭弹框按钮
			jsOpen(items) {
				items.userShow = !items.userShow;
			},
			//关闭创建角色按钮
			closeRole() {
				this.show = false;
			},

			//查看详情弹框
			detailRole(index, row) {
				this.vertical2 = "";
				this.roleDetailList = [];
				this.rowContent = row;
				this.deparList();
				this.err = [];
				if(this.rowContent.isEnable) {
					this.vertical2 = 'true';
				} else {
					this.vertical2 = 'false';
				};
				if(this.buttenType == "1") {
					this.lookShow = true;
				} else {
					this.detailShow = true;
				};
				if(this.modifyView.isexist){
					var obj = {
						RoleId: row.roleId
					}
				}else{
					var obj = {
						RoleId: row.roleId,
						Add:true
					}
				};
				this.status = row.deptName
				this.$axios({
					method: 'GET',
					url: baseUrl + '/api/mgr/function/menus',
					params: obj
				}).then(res => {
					localStorage.setItem('row', row.roleId);
					var mo_a = res.data.data
					this.roleDetailList = res.data.data
					this.funString();
					for(let i = 0; i < this.roleDetailList.length; i++) {                        
						var father = this.roleDetailList[i].children                        
						for(let j = 0; j < father.length; j++) {                            
							var son = father[j].children                            
							for(let k = 0; k < son.length; k++) {                                
								if(son[k].isCheckOut) {                                    
									this.err.push(son[k].functionId)                                
								}                            
							}                        
						}                                            
					}
					for(let j = 0; j < mo_a.length; j++) {
						var mo_b = mo_a[j].children;
						for(let k = 0; k < mo_b.length; k++) {
							if(!mo_b[k].isEnable) {
								mo_b.splice(k, 1)
							}
						}
					}
					this.roleDetailList = mo_a;
				})

			},
			//修改角色所属部门
			departCount1(status) {
				console.log(this.status);
				this.jurisdiction1(status);
			},
			//修改角色通过部门得到权限
			jurisdiction1(deptId) {
				this.deptId = deptId;
				this.$axios({
					method: 'GET',
					url: baseUrl + '/api/mgr/function/menus',
					params: {
						DepartFunction: deptId,
						RoleId: this.rowContent.roleId
					}
				}).then(res => {
					var cj_a = res.data.data;
					for(let j = 0; j < cj_a.length; j++) {
						var cj_b = cj_a[j].children;
						for(let k = 0; k < cj_b.length; k++) {
							if(!cj_b[k].isEnable) {
								cj_b.splice(k, 1)
							}
						}
					}
					this.roleDetailList = cj_a;
				})
			},
			//获取修改角色的FunctionString权限
			funString() {
				this.$axios({
					method: 'GET',
					url: baseUrl + '/api/mgr/function/ReturnFunction',
					params: {
						//						deptId: this.rowContent.deptId,
						roleId: this.rowContent.roleId
					}
				}).then(res => {
					this.ruleArry = res.data.data.split(',');
				})
			},
			//复选框点击事件
			checkModify(e, val) {        
				var chlArry = val.checkedKeys;        
				var fatArry = val.halfCheckedKeys;        
				this.ruleArry = [...chlArry, ...fatArry];
			},
			//修改角色的单选框按钮
			radio() {
				console.log(this.vertical2);
			},
			//修改角色点击确认按钮
			role_detail() {
				if(this.vertical2 == 'true') {
					this.roleDetailList.isEnable = true
				} else {
					this.roleDetailList.isEnable = false
				}
				var check1 = this.ruleArry.join(',');
				if(!this.deptId) {
					this.deptId = this.rowContent.deptId
				}
				this.$axios({
					method: 'GET',
					url: baseUrl + '/api/mgr/Role_Dept/EditRole',
					params: {
						RoleName: this.rowContent.roleName,
						FunctionString: check1,
						DeptId: this.deptId,
						IsEnable: this.vertical2,
						RoleId: this.rowContent.roleId
					}
				}).then(res => {
					if(res.data.success) {
						this.deptId = "";
						this.$layer.msg(res.data.msg);
						this.detailShow = false;
						this.zhezhao1 = false;
						this.getData();
					} else {
						this.$layer.msg(res.data.msg);
					}


				})
			},

			//点击关闭查看详情弹框
			closeModify() {
				this.detailShow = false;
				this.lookShow = false;
				this.reset()
			},

			search() {
				this.is_search = true;
			},

			close() {
				this.closeRole();
				this.closeModify();

			}

		}
	}
</script>

<style scoped>
	.handle-box {
		padding: 22px 10px;
		background: #fff;
		margin-bottom: 20px;
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
		width: 280px;
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
	/*创建新角色 */
	
	.newRole {
		width: 600px;
		height: 65%;
		overflow: hidden;
		border: 1px solid #ccc;
		background: #fff;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		z-index: 10;
	}
	
	.found_box {
		height: 44px;
		line-height: 44px;
		width: 100%;
		background: rgba(248, 248, 248, 1);
		border-bottom: 1px solid rgba(226, 226, 226, 1);
		font-size: 16px;
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
	
	.name {
		font-size: 16px;
	}
	
	.belong {
		font-size: 16px;
		margin-left: 5%;
		margin-top: 2%;
	}
	
	.user_l,
	.user_left {
		float: left;
		font-size: 16px;
		padding-left: 5%;
	}
	
	.user_r,
	.user_right {
		padding-left: 18%;
	}
	
	.role_check img {
		display: inline-block;
		width: 15px;
		height: 15px;
	}
	
	.role_bottom {
		padding-left: 5%;
		line-height: 28px;
	}
	
	.user {
		padding-left: 8%;
	}
	
	.depart {
		margin-left: 5%;
		font-size: 16px;
		margin-top: 5%;
	}
	
	.btn {
		text-align: center;
		margin: 3% 0;
		font-size: 16px;
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
	}
	
	.zhezhao,
	.zhezhao1 {
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
	/*查看详情*/
	
	.detail_box {
		width: 600px;
		height: 70%;
		overflow: hidden;
		border: 1px solid #ccc;
		background: #fff;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		z-index: 10;
	}
	
	.user_box {
		font-size: 16px;
		padding-left: 10%;
		margin-top: 2%;
		cursor: pointer;
	}
	
	.user_checkbox {
		padding-left: 11%;
	}
	
	.content_text {
		padding-left: 30px;
	}
	
	.content_list {
		padding: 5px 0;
		padding-left: 15px;
	}
	
	.content_list span {
		font-size: 14px;
	}
	
	.user_checkbox>p {
		height: 28px;
		line-height: 28px;
	}
	
	.state {
		margin-left: 5%;
		margin-top: 3%;
		font-size: 16px;
	}
	
	.content_list img {
		display: inline-block;
		width: 15px;
		height: 15px;
	}
	
	.circular {
		width: 6px;
		height: 6px;
		vertical-align: middle;
		background: RGBA(113, 113, 113, 1);
		display: inline-block;
		border-radius: 50%;
	}
	
	span {
		vertical-align: middle;
	}
	
	.content_box {
		height: 485px;
		overflow-y: auto;
	}
	.news:hover{
		background: #d87000 !important;
		border: 1px solid #d87000;
	}
</style>