<template>
	<div class="table">
		<div class="handle-box">
			<div class="box">
				部门名称：
				<template>
					<i-input placeholder="请输入部门名称" v-model="DeptName" style="width: 170px; margin-right: 20px;"></i-input>
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
				<el-button style="width: 116px;background: RGBA(240, 124, 0, 1);color: #fff;border: none;" @click="newDepartment()" class="news">创建部门</el-button>
			</div>

		</div>
		<div class="table-content">
			<div class="frame">
				<el-table stripe :data="tableData" style="width: 100% !important">
					<el-table-column type="index" width="70" label="编号" :index="typeIndex">
					</el-table-column>
					<el-table-column prop="deptName" label="部门">
					</el-table-column>
					<el-table-column prop="IsEnable" label="状态" :formatter="formatter">
					</el-table-column>
					<el-table-column prop="createDateText" label="创建时间">
					</el-table-column>
					<el-table-column label="操作" width="180">
						<template scope="scope">
							<el-button type="text" size="small" @click="detail(scope.$index, scope.row)">查看</el-button>
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

		<!--创建新部门-->
		<div class="newDepart" v-show="show">
			<!--标题-->
			<p class="found_box">
				<span class="found">创建部门</span>
				<img src="../../../assets/img/close.png" alt="" @click="closeNew()" />
			</p>
			<div class="content_box">
				<!--部门名称-->
				<div class="name_box">
					<span class="name">部门名称：</span>
					<i-input placeholder="请输入部门名称" style="width: 300px !important;height: 36px !important;" v-model="inputView"></i-input>
				</div>
				<div>
					<div class="user_l">
						部门权限:
					</div>
					<div class="user_r">
						<!--用户管理-->
						<el-tree :data="manageList" show-checkbox node-key="functionId"   @check='checkChange' :props="props">
						</el-tree>
					</div>
				</div>
			</div>
			<div class="btn">
				<el-button type="primary" style="width:100px;height:40px;font-size: 16px;" @click="sureFound()">确认</el-button>
			</div>

			</p>
		</div>
		<!--修改部门（查看详情）-->
		<div class="modifyDepart" v-show="modifyShow">
			<!--标题-->
			<p class="found_box">
				<span class="found">修改部门</span>
				<img src="../../../assets/img/close.png" alt="" @click="closeModify()" />
			</p>
			<div class="content_detailbox">
				<!--部门名称-->
				<div class="name_box">
					<span class="name">部门名称：</span>
					<i-input placeholder="请输入" style="width: 80%;height: 28px;" size="small" v-model="depart_detail.deptName"></i-input>
				</div>
				<!--状态-->
				<div class="state" style="font-size: 16px;margin-bottom: 15px;">
					<span>状&ensp;&ensp;&ensp;&ensp;&ensp;态：</span>
					<RadioGroup v-model="vertical" @on-change="radio()">
						<Radio label='true'>
							<span>使用</span>
						</Radio>
						<Radio label='false'>
							<span>关闭</span>
						</Radio>
					</RadioGroup>
				</div>
				<div>
					<div class="user_left">部门权限:</div>
					<div class="user_right">
						<!--内容管理-->
						<el-tree :data="modifyList" :default-expand-all=true :default-checked-keys="check_list" show-checkbox node-key="functionId"   @check='checkModify' :props="props1">
						</el-tree>
					</div>
				</div>
			</div>
			<p class="btn">
				<el-button type="primary" style="width:100px;height:40px;font-size: 16px;" @click="sure_modify()">确认</el-button>
			</p>
		</div>
		<!--遮罩-->
		<div class="zhezhao" v-show="show" @click="close()"></div>
		<div class="zhezhao1" v-show="modifyShow" @click="close()"></div>
	</div>
</template>

<script>
	import baseUrl from '../common/baseUrl'
	export default {
		data() {
			return {
				jsonList: '', //修改部门后台传的权限
				arrList: '', //修改部门isEnable不为0的时候显示
				check_list: [], //
				props1: {
					children: 'children',
					        label: 'functionName'        
				}, //修改部门权限
				props: {
					children: 'children',
					label: 'functionName'        
				}, //创建部门权限
				depart_detail: [], //修改部门的内容列表
				modifyArry: [], //修改部门选择框的数据
				ruleArry: [], //创建部门选择框的数组
				inputView: '', //创建部门时input输入框 
				deptId: '', //列表的部门ID
				deptName: '', //修改部门的input输入框
				functionId: '', //唯一标识
				status: true, //创建部门的状态
				IsEnable: '', //查询部门的状态
				isEnable: '',
				IsStatus: '', //查询状态
				DeptName: '', //部门名称
				PageNum: 1, //当前页
				PageSize: 20, //请求行数名称
				pageTotal: 0, //总页数
				totalSize: 0, //总条数
				manageList: [], //创建新部门列表
				modifyList: [], //修改部门列表
				vertical: '',
				show: false,
				userShow: true,
				modifyShow: false, //修改部门
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
				tableData: [] //内容列表

			}
		},
		created() {
			this.getData();
		},
		computed: {

		},
		methods: {
			//获取内容列表
			getData() {
				var params = new URLSearchParams();
				params.append('IsEnable', this.IsEnable);
				params.append('DeptName', this.DeptName);
				params.append('PageNum', this.PageNum);
				params.append('PageSize', this.PageSize);
				this.$axios({
					method: 'POST',
					url: baseUrl + '/api/mgr/Role_Dept/DepartQueryList',
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
			page(val) {
				this.PageNum = val;
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
				this.PageNum = 1;
				this.page(1);
				this.IsEnable = ''
				this.IsStatus = ""
				this.DeptName = ""
				this.getData();
			},
			//获取修改部门的FunctionString权限
			funString() {
				this.$axios({
					method: 'GET',
					url: baseUrl + '/api/mgr/function/ReturnFunction',
					params: {
						deptId: this.depart_detail.deptId
					}
				}).then(res => {
					//					console.log(res.data.data)
					this.modifyArry = res.data.data.split(',');
				})
			},
			//创建新部门
			newDepartment() {
				this.inputView = "";
				this.manageList = [];
				this.ruleArry = [];
				this.show = !this.show;
				this.$axios({
					method: 'GET',
					url: baseUrl + '/api/mgr/function/menus'
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
					this.manageList = cj_a;
				})
			},
			//关闭创建新部门按钮
			closeNew() {
				this.show = false;
			},
			//创建部门的点击用户管理按钮
			userChange(item) {
				item.userShow = !item.userShow;
			},
			//复选框点击事件
			checkChange(e, val) {        
				var chlArry = val.checkedKeys;       
				var fatArry = val.halfCheckedKeys;    
				this.ruleArry = [...chlArry, ...fatArry];
			},
			//创建部门点击确认
			sureFound() {
				if(!this.inputView) {
					this.$layer.msg("请输入部门名称");
					return false;
				}
				var check = this.ruleArry.join(',');
				if(!check) {
					this.$layer.msg("请选择部门权限");
					return false;
				}
				this.$axios({
					method: 'GET',
					url: baseUrl + '/api/mgr/Role_Dept/AddDepartment',
					params: {
						DepartmentName: this.inputView,
						FunctionString: check,
						IsEnable: this.status
					}
				}).then(res => {
					if(res.data.success) {
						this.$layer.msg(res.data.msg);
						this.show = false;
						this.zhezhao = false;
						this.getData();

					} else {
						this.$layer.msg(res.data.msg);
					}
				}).catch(err => {
					console.log(err)
				})
			},
			//修改部门的点击用户管理按钮
			user_change(item) {
				item.userShow = !item.userShow;
			},

			//修改部门(查看详情)
			detail(index, row) {
				this.vertical = "";
				this.modifyList = [];
				this.check_list = [];
				var that = this;
				setTimeout(function() {
					if(that.depart_detail.isEnable) {
						that.vertical = 'true';
					} else {
						that.vertical = 'false';
					}
				}, 100);

				this.$axios({
					method: 'GET',
					url: baseUrl + '/api/mgr/function/menus',
					params: {
						DepartFunction: row.deptId
					}
				}).then(res => {
					this.funString();
					var mo_a = res.data.data
					this.modifyList = res.data.data;

					//					for(let i = 0; i < this.modifyList.length; i++) {
					//						this.check_list.push(this.modifyList[i].functionId)
					//					};

					for(let i = 0; i < this.modifyList.length; i++) {                        
						var father = this.modifyList[i].children                        
						for(let j = 0; j < father.length; j++) {                            
							var son = father[j].children                            
							for(let k = 0; k < son.length; k++) {                                
								if(son[k].isCheckOut == true) {                                    
									this.check_list.push(son[k].functionId)                                
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
					this.modifyList = mo_a;
				});
				this.depart_detail = row;
				this.modifyShow = !this.modifyShow;
			},

			//复选框点击事件
			checkModify(e, val) {        
				var chlArry = val.checkedKeys;        
				var fatArry = val.halfCheckedKeys;
				this.modifyArry = [...chlArry, ...fatArry];
			},
			//修改部门的单选框按钮
			radio() {
				console.log(this.vertical);
			},
			//修改部门点击确认
			sure_modify() {
				var check1 = this.modifyArry.join(',');
				if(this.vertical == 'true') {
					this.depart_detail.isEnable = true
				} else if(this.vertical == 'false') {
					this.depart_detail.isEnable = false
				}
				this.$axios({
					method: 'GET',
					url: baseUrl + '/api/mgr/Role_Dept/EditDepartment',
					params: {
						DepartmentName: this.depart_detail.deptName,
						FunctionString: check1,
						IsEnable: this.vertical,
						DeptId: this.depart_detail.deptId
					}
				}).then(res => {
					//					console.log(res)
					if(res.data.success) {
						this.depart_detail.deptId = "";
						this.$layer.msg(res.data.msg);
						this.modifyShow = false;
						this.zhezhao1 = false;
						this.getData();
					} else {
						this.$layer.msg(res.data.msg);
					}
				}).catch(err => {
					console.log(err)
				})
			},
			//关闭修改部门（查看详情）
			closeModify() {
				this.modifyShow = false;
				this.reset()
			},
			//点击打开关闭弹框按钮
			jsOpen(items) {
				items.userShow = !items.userShow;
			},
			//点击遮罩关闭
			close() {
				this.modifyShow = false;
				this.show = false
			},
			search() {
				this.is_search = true;
			}

		}
	}
</script>

<style scoped>
	.handle-box {
		padding: 10px 10px;
		background: #fff;
		margin-bottom: 20px;
	}
	
	.el-table__header-wrapper {
		background: red;
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
		width: 300px;
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
		text-align: center;
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
	/*创建新部门*/
	
	.newDepart {
		width: 600px;
		height: 70%;
		border: 1px solid #ccc;
		background: #fff;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		z-index: 10;
		overflow: hidden;
	}
	
	.found_box {
		height: 50px;
		line-height: 50px;
		width: 100%;
		background: rgba(248, 248, 248, 1);
		border-bottom: 1px solid rgba(226, 226, 226, 1);
		font-size: 16px;
	}
	
	.found {
		font-size: 18px;
		color: RGBA(51, 51, 51, 1);
		display: inline-block;
		padding-left: 2%;
	}
	
	.found_box>img {
		display: inline-block;
		float: right;
		cursor: pointer;
		padding-top: 15px;
		padding-right: 2%;
	}
	
	.content_box {
		height: 65%;
		overflow-y: auto;
	}
	
	.name_box {
		width: 90%;
		margin: 0 auto;
		font-size: 16px;
		margin-top: 5%;
		color: RGBA(51, 51, 51, 1);
	}
	
	.user_l,
	.user_left {
		float: left;
		font-size: 16px;
		padding-left: 5%;
		color: rgba(51, 51, 51, 1);
	}
	
	.user_r,
	.user_right {
		padding-left: 19%;
		margin-top: 2%;
		color: rgba(51, 51, 51, 1);
	}
	
	.user_box {
		font-size: 14px;
		padding-left: 12%;
		margin-top: 5%;
		cursor: pointer;
		font-size: 16px;
	}
	
	.user {
		padding-left: 6%;
	}
	
	.user_checkbox {
		padding-left: 11%;
	}
	
	.user_checkbox>p {
		height: 28px;
		line-height: 28px;
	}
	
	.role_check {
		line-height: 28px;
		font-size: 14px;
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
	
	.btn {
		text-align: center;
		margin: 5% 0;
		font-size: 16px;
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
	/*修改部门*/
	
	.modifyDepart {
		font-size: 16px;
		height: 70%;
		width: 600px;
		border: 1px solid #ccc;
		position: relative;
		z-index: 10;
		background: #fff;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		overflow: hidden;
	}
	
	.state {
		font-size: 16px;
		margin-left: 5%;
		margin-top: 3%;
		font-size: 14px;
	}
	
	.content_detailbox {
		height: 65%;
		overflow-y: auto;
	}
	
	.modify_user {
		width: 50%;
	}
	
	.news:hover {
		background: #d87000 !important;
		border: 1px solid #d87000;
	}
</style>