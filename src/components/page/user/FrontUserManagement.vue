<template>
	<div class="table">
		<div class="handle-box">
			<div class="box">
				名称：
				<template>
					<i-input placeholder="请输入名称" style="width: 170px; margin-right: 20px;" v-model="UserName"></i-input>
				</template>
			</div>
			<div class="box">
				类型：
				<template>
					<el-select v-model="accountType" placeholder="全部" style="width:170px;margin-right: 20px; text-align: left;" @change="typeContent">
						<el-option v-for="item in typeLIst" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</template>

			</div>
			<div class="box">
				状态：
				<template>
					<el-select v-model="stateVal" placeholder="全部" style="width:170px;margin-right: 20px; text-align: left;" @change="stateContent">
						<el-option v-for="item in stateList" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</template>

			</div>
			<div class="box">
				创建时间：
				<Date-picker :value="foundTime" format="yyyy-MM-dd" type="daterange" placement="bottom-end" placeholder="开始时间-结束时间" style="width: 200px" @on-change="buildTime" v-model="buildVal"></Date-picker>
			</div>
			<div class="box box_end">
				<el-button type="primary" @click="search" style=" width: 70px;">查询</el-button>
				<el-button type="primary" style="width: 70px;" @click="resetSearch">重置</el-button>
			</div>
		</div>

		<div class="table-content">
			<div class="frame">
				<el-table stripe :data="tableData" style="width: 100% !important">
					<el-table-column type="index" width="70" label="编号" :index="typeIndex">
					</el-table-column>
					<el-table-column prop="groupName" label="名称">
					</el-table-column>
					<el-table-column prop="accountTypeText" label="类型">
					</el-table-column>
					<el-table-column prop="isEnable" label="状态" :formatter="formatter">
					</el-table-column>
					<el-table-column prop="phone" label="手机号">
					</el-table-column>
					<el-table-column prop="createDateText" label="创建时间">
					</el-table-column>
					<el-table-column label="操作" width="180">
						<template scope="scope">
							<el-button type="text" size="small" @click="detailFront(scope.$index, scope.row)">查看</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div class="pagination">
				<template>
					<Page :total="totalSize" :current="PageNum" :page-size="20" show-elevator @on-change="page" v-if="pageTotal>1"></Page>
				</template>
			</div>
		</div>

		<!--查看详情-->
		<div class="detail_box" v-show="detailShow">
			<!--标题-->
			<p class="found_box">
				<span class="found">用户详情</span>
				<img src="../../../assets/img/close.png" alt="" @click="closeUser()" />
			</p>
			<!--个人信息展示-->
			<div class="mation_box">
				<div class="box_one">
					<li class="box_sm">
						<span class="left">名称：{{details.groupName}}</span>
					</li>
					<li class="box_sm">
						<span class="left">系统花名：{{details.nickName}}</span>
					</li>
					<li class="box_sm" style="width: 18%">
						<span class="left">手机号：{{details.phone}}</span>
					</li>
					<li class="box_sm">
						<span class="left">性别：</span>
						<span class="right" v-if="details.gender==1">男</span>
						<span class="right" v-if="details.gender==0">火星人</span>
						<span class="right" v-if="details.gender==2">女</span>

					</li>
					<li class="box_sm">
						<span class="left">微信：</span>
						<span class="right">{{details.wechatName}}</span>
					</li>
					<li class="box_sm">
						<span class="left">QQ：</span>
						<span class="right">{{details.qqName}}</span>
					</li>
					<li class="box_sm">
						<span class="left">微博：</span>
						<span class="right">{{details.weiboName}}</span>
					</li>

				</div>
				<div class="box_two">
					<li class="box_sm" style="width: 14%">
						<span class="left">出生日期：{{details.birth}}</span>
					</li>
					<li class="box_sm" style="width: 29.7%;">
						<span class="left">所在城市：</span>
						<span class="right">{{details.detailAddress}}</span>
					</li>
					<li class="box_sm" style="width: 28.2%;">
						<span class="left">用户类型：</span>
						<template v-if="lookShow">
							<el-select v-model="styleVal1" style="width:170px;" placeholder="全部" @change="typeContent1">
								<el-option v-for="item in typeLIst1" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</template>
						<span v-else>{{details.accountTypeText}}</span>
					</li>
					<li class="box_sm" v-if="details.isEnable">
						<span class="left">状态：</span>
						<el-button size="small" @click="account(0,details.userId)" v-show="closeShow">关闭账号</el-button>
						<span v-show="!closeShow">
							<span v-show="details.isEnable">使用</span>
							<span v-show="!details.isEnable">关闭</span>
						</span>
					</li>
					<li class="box_sm" v-if="!details.isEnable">
						<span class="left">状态：</span>
						<el-button size="small" @click="account(1,details.userId)" v-show="closeShow">开启账号</el-button>
						<span v-show="!closeShow">
							<span v-show="details.isEnable">使用</span>
							<span v-show="!details.isEnable">关闭</span>
						</span>
					</li>
				</div>
				<div class="box_three">
					<li>
						<span class="left">个性签名： {{details.signature}}</span>
					</li>
				</div>
				<!--主体-->
				<div class="content_big">
					<!--标题-->
					<div class="title">
						<span v-for="(item,i) in buttonData" :key="i" :class="{active:i == index}" @click="changeData(i,item.value)">{{item.name}}</span>
					</div>
					<!--内容-->
					<div class="speak">
						<template style="border: none;">
							<Table stripe :columns="headList" :data="bodyList" style="border: none;"></Table>
						</template>
					</div>
					<div class="btn">
						<el-button type="primary" style="width:100px;height: 40px;font-size: 18px;" @click="account(2,details.userId)" v-show="lookShow">确认</el-button>
						<el-button style="width:100px;height: 40px;font-size: 18px;" @click="closeUser">取消</el-button>
					</div>
				</div>
			</div>
		</div>
		<!--zhezhao-->
		<div class="zhezhao" v-show="detailShow" @click="closeUser"></div>
	</div>
</template>

<script>
	import * as api from '../../../api/api.js';
	export default {
		data() {
			return {
				functionId:"", //菜单ID
				CategoryId: "9f50ba92-84f3-11e8-97b3-00163e06561e", //分类id
				detailShow: false, //查看详情弹窗
				accountType: "", // 查看详情的用户类型
				styleVal: "", //列表 类型选中的内容
				AccountType: "", //账号类型
				styleVal1: "", //查看信息的状态
				userId: "", //客户端id
				type: "ClientOff", //操作类型 关闭账号
				details: {}, //查看详情
				buildVal: "", //创建时间
				StartTime: "", //开始时间
				EndTime: "", //结束时间
				stateVal: "", //状态选中内容
				IsEnable: "", //状态
				UserName: "", //用户名称
				PageNum: 1, //当前页数
				PageSize: 20, //每页的条数
				totalSize: 0, //总条数
				pageTotal: 0, //总页数
				index: 0,
				foundTime: ['', ''], //创建时间
				buttonData: [{ //查看详情的选项卡
						name: '说一嘴',
						value: "9f50ba92-84f3-11e8-97b3-00163e06561e"
					},
					{
						name: '问一句',
						value: "9f50baa0-84f3-11e8-97b3-00163e06561e"
					},
					{
						name: '秀一把',
						value: "9f50baa8-84f3-11e8-97b3-00163e06561e"
					}
				],
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
				stateList: [{
						value: '',
						label: '全部'
					}, {
						value: 'true',
						label: '使用'
					},
					{
						value: 'false',
						label: '关闭'
					}
				],
				//类型内容
				typeLIst: [{
						value: '',
						label: '全部'
					}, {
						value: 'Offcial',
						label: '官方账号'
					},
					{
						value: 'Common',
						label: '普通账号'
					},
					{
						value: 'Editer',
						label: '编辑账号'
					},
					{
						value: 'SubAccount',
						label: '子账号'
					}
				],
				typeLIst1: [{ //查看详情的类型内容
						value: '官方账号',
						label: '官方账号'
					},
					{
						value: '普通账号',
						label: '普通账号'
					},
					{
						value: '编辑账号',
						label: '编辑账号'
					},
					{
						value: '子账号',
						label: '子账号'
					}
				],
				headList: [ //查看详情表格表头
					{
						title: "编号",
						type: 'index',
						width: 80,
						align: 'center'
					},
					{
						title: 'id',
						key: 'id'
					},
					{
						title: '标题',
						key: 'title',
						width: 270,
					},
					{
						title: '浏览数',
						key: 'pvCount'
					},
					{
						title: '收藏数',
						key: 'collectionCount'
					},
					{
						title: '评论数',
						key: 'commentCount'
					},
					{
						title: '审核人',
						key: 'auditor',
						render: (h,params) => {
							if(params.row.auditor == null) {
								return h('span', params.row.contentStatusText);
							}else {
								return h('span', params.row.auditor);
							}
							
						}
					},
					{
						title: '发布时间',
						key: 'createDateText'
					}
				],
				bodyList: [], //查看详情的列表数组
				tableData: [], //列表
				buttonList: [], //按钮权限列表
				closeShow: false, //关闭账号
				lookShow: false, //更改用户类型
				data:5 //区分关闭账号和开启账号的data
			}
		},
		created() {
			this.getClientQueryList();
			this.getButtinList()
		},
		computed: {

		},
		methods: {
			//获取列表
			getClientQueryList() {
				var url = api.ClientQueryList;
				var params = new URLSearchParams();
				params.append('PageSize', this.PageSize);
				params.append('PageNum', this.PageNum);
				this.$axios({
					method: "post",
					url: url,
					data: params
				}).then(res => {
					if(res.data.success) {
						this.tableData = res.data.rows;
						this.totalSize = res.data.totalSize;
						this.pageTotal = res.data.pageTotal
					}
				}).catch(err => {
					console.log(err)
				});

			},
			//获取按钮权限
			getButtinList() {
				if(this.functionId){
					this.functionId = localStorage.getItem('functionId');
				}else{
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
						this.closeShow = res.data.data[2].isexist //关闭账号
						this.lookShow = res.data.data[1].isexist //更改用户类型
					}
				}).catch(err => {
					console.log(err)
				})
			},
			//查看详情
			detailFront(index, row) {
				this.bodyList=[]
				this.detailShow = !this.detailShow;
				this.details = row;
				this.styleVal1 = row.accountTypeText;
				this.index = 0;
				this.CategoryId = "9f50ba92-84f3-11e8-97b3-00163e06561e"
				this.MgrClientContentList(this.details.userId, this.CategoryId)
			},
			//关闭详情弹框
			closeUser() {
				this.detailShow = false;
			},
			//说一嘴，问一句，秀一把
			changeData(i, value) {
				this.index = i;
				this.CategoryId = value;
				this.MgrClientContentList(this.details.userId, this.CategoryId)
			},
			//编号
			typeIndex(index) {
				return index + (this.PageNum - 1) * 20 + 1;
			},
			//当前页数查询
			page(val) {
				this.PageNum = val
				var url = api.ClientQueryList;
				var params = new URLSearchParams();
				params.append('PageSize', this.PageSize);
				params.append('PageNum', this.PageNum);
				params.append('UserName', this.UserName);
				params.append('IsEnable', this.IsEnable);
				params.append('StartTime', this.StartTime);
				params.append('EndTime', this.EndTime);
				params.append('AccountType', this.AccountType);
				this.$axios({
					method: "post",
					url: url,
					data: params
				}).then(res => {
					if(res.data.success) {
						this.tableData = res.data.rows;
						this.totalSize = res.data.totalSize;
						this.pageTotal = res.data.pageTotal
					}

				}).catch(err => {
					console.log(err)
				});
			},
			//判断状态
			formatter(row, column) {
				if(row.isEnable) {
					return "使用"
				} else {
					return "关闭"
				}
			},
			//查询
			search() {
				this.PageNum = 1;
				var url = api.ClientQueryList;
				var params = new URLSearchParams();
				params.append('PageSize', this.PageSize);
				params.append('UserName', this.UserName);
				params.append('IsEnable', this.IsEnable);
				params.append('StartTime', this.StartTime);
				params.append('EndTime', this.EndTime);
				params.append('AccountType', this.AccountType);
				this.$axios({
					method: "post",
					url: url,
					data: params
				}).then(res => {
					if(res.data.success) {
						this.tableData = res.data.rows;
						this.totalSize = res.data.totalSize;
						this.pageTotal = res.data.pageTotal
					}

				}).catch(err => {
					console.log(err)
				});
			},
			//重置
			resetSearch() {
				this.PageNum = 1;
				this.UserName = ""; //清空用户名称
				this.stateVal = ""; //清空状态内容
				this.buildVal = ""; //清空创建时间
				this.styleVal = ""; //清空类型内容
				this.AccountType = "";
				this.IsEnable = "";
				this.accountType = "";
				this.StartTime = "";
				this.EndTime = "";
				this.getClientQueryList();
			},
			//状态
			stateContent(value) {
				if(value == "true") {
					this.IsEnable = true
				} else if(value == "false") {
					this.IsEnable = false;
				} else {
					this.IsEnable = ""
				}
			},
			//获取创建时间
			buildTime(value) {
				this.time = value;
				this.StartTime = value[0];
				this.EndTime = value[1]
			},
			//类型(查看详情的)
			typeContent1(value) {
				if(value == "官方账号") {
					this.accountType = "Offcial";
				} else if(value == "普通账号") {
					this.accountType = "Common";
				} else if(value == "编辑账号") {
					this.accountType = "Editer";
				} else {
					this.accountType = "SubAccount";
				}
			},
			//对客户端用户操作
			account(data, userId) {
				this.data=data
				this.userId = userId;
				if(data == 0) {
					this.type = "ClientOff";
					var url = api.ClientAccount;
				} else if(data == 1) {
					this.type = "ClientOn";
					var url = api.ClientAccount;
				} else {
					this.type = "ChangeClientType";
					var url = api.ClientEditType;
				}
				if(this.accountType == "" || this.accountType == null) {
					if(this.details.accountTypeText == "官方账号") {
						this.accountType = "Offcial";
					} else if(this.details.accountTypeText == "普通账号") {
						this.accountType = "Common";
					} else if(this.details.accountTypeText == "编辑账号") {
						this.accountType = "Editer";
					} else {
						this.accountType = "SubAccount";
					}
				}
				var params = new URLSearchParams();
				params.append('type', this.type);
				params.append('userId', this.userId);
				params.append('accountType', this.accountType);
				this.$axios({
					method: "get",
					url: url + '?' + params + ''
				}).then(res => {
					if(res.data.success) {
						if(this.type == "ChangeClientType") {
							this.detailShow = false;
							this.$layer.msg(res.data.msg);
							this.search();
						} else {
							this.details.isEnable=!this.details.isEnable
							if(this.data==1){
								this.$layer.msg("开启账号成功")
							}else if(this.data==0){
								this.$layer.msg("关闭账号成功")
							}else{
								this.$layer.msg(res.data.msg);
							}
							this.search();
						}

					} else {
						this.$layer.msg(res.data.msg)
					}
				}).catch(err => {
					console.log(err)
				});
			},
			//类型(页面的)
			typeContent(value) {
				this.AccountType = value;
			},
			//获取查看详情的内容列表
			MgrClientContentList(userId) {
				this.userId = userId;
				//				this.PageSize = 100000;
				var url = api.MgrClientContentList;
				var params = new URLSearchParams();
				params.append('CategoryId', this.CategoryId);
				params.append('userId', this.userId);
				params.append('PageSize', 1000);
				params.append('ContentStatusList',"0,1,2,3,4,5")
				this.$axios({
					method: "post",
					url: url,
					data: params
				}).then(res => {
					if(res.data.success) {
						this.bodyList = res.data.rows
					}
				}).catch(err => {
					console.log(err)
				})
			}
		}
	}
</script>

<style scoped>
	ul,
	li,
	ol,
	dl {
		list-style: none;
	}
	
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
		width: 290px;
		white-space: nowrap;
	}
	
	.box_end {
		float: right;
		/*margin-right: 5%;*/
		width: 200px;
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
	/*查看详情*/
	
	.detail_box {
		width: 80%;
		height: 88%;
		border: 1px solid #ccc;
		background: #fff;
		font-size: 14px;
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-52%, -52%);
		z-index: 10;
	}
	
	.found_box {
		height: 50px;
		line-height: 55px;
		width: 100%;
		background: rgba(248, 248, 248, 1);
		border-bottom: 1px solid rgba(226, 226, 226, 1);
		font-size: 16px;
	}
	
	.found {
		display: inline-block;
		padding-left: 3%;
	}
	
	.found_box>img {
		display: inline-block;
		float: right;
		cursor: pointer;
		padding-top: 20px;
		padding-right: 1%;
	}
	
	.box_one,
	.box_two,
	.box_three {
		font-size: 14px;
		display: flex;
		width: 100%;
		height: 50px;
		line-height: 50px;
		padding-left: 3%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	.box_sm {
		width: 16%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	/*主体内容 */
	
	.content_big {
		width: 95%;
		border-top: none;
		margin: 0 auto;
		margin-bottom: 3%;
	}
	
	.title {
		width: 100%;
		height: 50px;
		line-height: 50px;
		border: 1px solid RGBA(56, 139, 255, 1);
		border-radius: 3px;
		font-size: 20px;
	}
	
	.title>span {
		display: inline-block;
		width: 33.333%;
		text-align: center;
		border-right: 1px solid RGBA(56, 139, 255, 1);
		color: rgba(56, 139, 255, 1);
		cursor: pointer;
	}
	
	.title>span:last-child {
		border-right: none;
	}
	
	.speak {
		margin: 0 auto;
		margin-top: 2%;
		margin-bottom: 2%;
		overflow: auto;
		height: 400px;
		font-size: 14px;
	}
	
	.btn {
		position: fixed;
		bottom: 5%;
		left: 40%;
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
	
	.content_big .title .active {
		color: #fff !important;
		background: RGBA(56, 139, 255, 1);
	}
	
	.ivu-table td {
		border: none;
	}
</style>