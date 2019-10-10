<template>
	<div class="table">
		<div class="handle-box">
			<div class="box">
				ID/标题：
				<template>
					<i-input placeholder="请输入ID或者内容标题" style="width: 170px; margin-right: 20px;" v-model="title"></i-input>
				</template>
			</div>
			<div class="box">
				分类：
				<template>
					<el-select v-model="CategoryId" placeholder="全部" style="width:170px;margin-right: 20px; text-align: left;" @change="typeContent">
						<el-option v-for="item in classificationList" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</template>
			</div>
			<div class="box">
				身份：
				<template>
					<el-select v-model="valueidentity" placeholder="全部" style="width:170px;margin-right: 20px; text-align: left;" @change="identityContent">
						<el-option v-for="item in identityList" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</template>
			</div>
			<div class="box">
				发布时间：
				<template style="display: inline-block; width: 400px;">
					<Date-picker :value="PublishTime" format="yyyy-MM-dd" type="daterange" placement="bottom-end" placeholder="开始时间-结束时间" style="width: 200px" @on-change="referTime" v-model="PublishTime"></Date-picker>
				</template>
			</div>
			<div class="box">
				评论者：
				<i-input placeholder="请输入作者名称" style="width: 170px; margin-right: 20px;" v-model="UserName"></i-input>
			</div>
			<div class="box">
				状态：
				<template>
					<el-select v-model="valueState" placeholder="全部" style="width:170px;margin-right: 20px; text-align: left;" @change="stateContent">
						<el-option v-for="item in stateList" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</template>
			</div>
			<div class="box">
				审核人：
				<i-input placeholder="请输入审核人" style="width: 170px; margin-right: 20px;" v-model="Auditor"></i-input>
			</div>

			<div class="box">
				<el-button type="primary" style="width: 66px;" @click="search(title,UserName,Auditor)">查询</el-button>
				<el-button type="primary" style="width: 66px;" @click="resetSearch">重置</el-button>
			</div>

		</div>
		<div class="table-content">
			<div class="frame">
				<el-table :data="tableData" stripe style="width: 100%">
					<el-table-column type="index" width="70" label="编号" :index="typeIndex">
					</el-table-column>
					<el-table-column prop="id" label="ID" width="100">
					</el-table-column>
					<!--:show-overflow-tooltip=true 当内容过长被隐藏时显示 tooltip-->
					<el-table-column prop="title" label="标题" width="230">
					</el-table-column>
					<el-table-column prop="content" label="评论">
					</el-table-column>
					<el-table-column prop="categoryName" label="分类">
					</el-table-column>
					<el-table-column prop="groupName" label="评论者">
					</el-table-column>
					<el-table-column prop="isAnonymous" label="身份" :formatter="formatter">
					</el-table-column>
					<el-table-column prop="supportCount" label="点赞数" width="70">
					</el-table-column>
					<el-table-column prop="auditor" label="审核人">
					</el-table-column>
					<el-table-column prop="commentStatusTest" label="状态">
					</el-table-column>
					<el-table-column prop="createDateText" label="发布时间" title="publishDate" width="200px">
					</el-table-column>
					<el-table-column prop="operation" label="操作">
						<template slot-scope="scope">
							<el-button type="text" size="small" @click="lookBox(scope.$index, scope.row)">查看</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div class="pagination">
				<Page :total="totalSize" :current="PageNum" :page-size="20" show-elevator @on-change="page" v-if="pageTotal>1"></Page>
			</div>
		</div>
		<!--遮罩层-->
		<div class="mask" v-show="is_search" @click="close"></div>
		<!--查看详情-->
		<div class="details-box" v-show="look">
			<div class="title">
				<span>查看详情</span>
				<img src="../../../assets/img/close.png" alt="" @click="close()" />
			</div>
			<div class="bottom">
				<div class="text">
					{{details.title}}
				</div>
				<div class="author-box">
					<span class="author" v-if="details.userName!=null">{{details.groupName}}</span>
					<span class="name" v-if="details.nickName!=null">系统花名：{{details.nickName}}</span>
				</div>
				<div name="" rows="" cols="" readonly="readonly" class="content-text">{{details.content}}</div>
				<div class="cancel">
					<el-button type="danger" v-if="details.commentStatus==1" @click="textDelete(details.commentId)" v-show="this.deleteComment.isexist">删除</el-button>
					<el-button plain @click="close" v-if="details.commentStatus==4 || details.commentStatus==2">关闭</el-button>
				</div>
			</div>
		</div>
		<!--提示弹窗-->
		<div class="popup" v-show="tips">
			<div class="title">
				<span>提示</span>
				<img src="../../../assets/img/close.png" alt="" @click="close()" />
			</div>
			<div class="text" style="padding: 90px 0;">
				作者已删除评论
			</div>
		</div>
	</div>
</template>

<script>
	import * as api from '../../../api/api.js';
	export default {
		data() {
			return {
				commentId:"", //删除的commentId
				tips:false, //提示弹窗作者已删除信息
				order: 'desc', //排序
				sort: 'createdate', //排序
				IsAnonymous: "", //是否匿名
				valueidentity: "", //身份内容
				CommentStatusList: "1,4,2", //状态码
				PageNum: 1, //当前页数
				PageSize: 20, //每页的条数
				details: {}, //查看详情
				totalSize: 0, //总条数
				pageTotal: 0, //总页数
				UserName: "", //评论者
				StartTime: "", //开始时间
				EndTime: "", //结束时间
				title: "", //id或者是内容标题
				contentType: "", //选中的分类
				AuditType: "Down", //删除状态
				Auditor: "", //审核人
				valueState: "", //状态内容
				CategoryId: "", //分类id
				CommentStatus: '', //状态id
				RelationId: "", //删除唯一id
				is_search: false, //遮罩层
				look: false, //查看详情
				//分类内容
				classificationList: [{
						value: '',
						label: '全部'
					}, {
						value: '9f50ba92-84f3-11e8-97b3-00163e06561e',
						label: '说一嘴'
					},
					{
						value: '9f50baa0-84f3-11e8-97b3-00163e06561e',
						label: '问一句'
					},
					{
						value: '9f50baa8-84f3-11e8-97b3-00163e06561e',
						label: '秀一把'
					}
				],
				//状态
				stateList: [{
						value: '',
						label: '全部'
					}, {
						value: '1',
						label: '已通过'
					},
					{
						value: '2',
						label: '已删除'
					},
					{
						value: '4',
						label: '用户删除'
					}
				],
				PublishTime: ['', ''], //发布时间
				tableData: [], //列表
				//身份
				identityList: [{
						value: '',
						label: '全部'
					}, {
						value: 'true',
						label: '匿名'
					},
					{
						value: 'false',
						label: '实名'
					}
				],
				funcId:"",//按钮权限的functionId
				deleteComment:'',//关联内容按钮
				lookView:''//查看信息按钮

			}
		},
		created() {
			this.getMgrCommentList();
			this.getFuncId();
		},
		computed: {},
		methods: {
			//获取按钮权限
			getFuncId(){
				if(this.funcId){
					this.funcId=localStorage.getItem('functionId');
					
				}else{
					this.funcId = sessionStorage.getItem('functionid');
				}
				var url = api.QueryFunction
				this.$axios({
					method: "get",
					url: url,
					params: {
						functionId:this.funcId
					}
				}).then(res => {
					if(res.data.success) {
						this.lookView = res.data.data[0] //查看信息按钮
						this.deleteComment = res.data.data[1] //审核权限按钮
					}
				}).catch(err => {
					console.log(err)
				})
			},
			//关闭弹窗
			close() {
				this.release = false;
				this.is_search = false;
				this.amputate = false;
				this.look = false;
				this.tips=false;
			},
			//查看详情弹窗
			lookBox(index, row) {
				this.details = row;
				this.commentId=this.details.commentId
				var url = api.CheckComment
				var params = new URLSearchParams();
				params.append('commentId', this.commentId);
				this.$axios({
					method: "get",
					url: url + '?' + params + '',
				}).then(res => {
					if(res.data.success) {
						this.is_search = true;
						this.look = true;
					} else {
						this.tips = true;
						this.is_search = true
					}
				}).catch(err => {
					console.log(err)
				})
				

			},
			//获取评论列表
			getMgrCommentList(data) {
				var url = api.MgrCommentList;
				var params = new URLSearchParams();
				params.append('CommentStatusList', this.CommentStatusList);
				params.append('PageSize', this.PageSize);
				params.append('PageNum', this.PageNum);
				params.append('Sort', this.sort);
				params.append('Order', this.order);
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
			//编号
			typeIndex(index) {
				return index + (this.PageNum - 1) * 20 + 1;
			},
			//当前页数查询
			page(val) {
				this.PageNum = val;
				var url = api.MgrCommentList;
				var params = new URLSearchParams();
				params.append('CommentStatusList', this.CommentStatusList);
				params.append('PageSize', this.PageSize);
				params.append('PageNum', this.PageNum);
				params.append('title', this.title);
				params.append('CategoryId', this.CategoryId);
				params.append('StartTime', this.StartTime);
				params.append('EndTime', this.EndTime);
				params.append('UserName', this.UserName);
				params.append('Auditor', this.Auditor);
				params.append('CommentStatus', this.CommentStatus);
				params.append('IsAnonymous', this.IsAnonymous);
				params.append('Sort', this.sort);
				params.append('Order', this.order);
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
			//查询
			search() {
				this.PageNum = 1;
				var url = api.MgrCommentList;
				var params = new URLSearchParams();
				params.append('CommentStatusList', this.CommentStatusList);
				params.append('PageSize', this.PageSize);
				params.append('title', this.title);
				params.append('CategoryId', this.CategoryId);
				params.append('StartTime', this.StartTime);
				params.append('EndTime', this.EndTime);
				params.append('UserName', this.UserName);
				params.append('Auditor', this.Auditor);
				params.append('CommentStatus', this.CommentStatus);
				params.append('IsAnonymous', this.IsAnonymous);
				params.append('Sort', this.sort);
				params.append('Order', this.order);
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
			//分类选择
			typeContent(value) {
				this.CategoryId = value;

			},
			//身份选择
			identityContent(value) {
				if(value == "true") {
					this.IsAnonymous = true
				} else {
					this.IsAnonymous = false
				}
				console.log(this.IsAnonymous)
			},
			//发布时间
			referTime(value) {
				this.StartTime = value[0];
				this.EndTime = value[1]
			},
			//重置
			resetSearch() {
				this.page(1)
				this.PageNum = 1;
				this.title = "";
				this.UserName = "";
				this.Auditor = "";
				this.PublishTime = "";
				this.valueType = "";
				this.valueState = "";
				this.valueidentity = "";
				this.IsAnonymous = "";
				this.CommentStatus = "";
				this.CategoryId = "";
				this.StartTime = "";
				this.EndTime = "";
				var url = api.MgrCommentList;
				var params = new URLSearchParams();
				params.append('CommentStatusList', this.CommentStatusList);
				params.append('PageSize', this.PageSize);
				params.append('PageNum', this.PageNum);
				params.append('Sort', this.sort);
				params.append('Order', this.order);
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
			//状态
			stateContent(value) {
				this.CommentStatus = value
			},
			//删除
			textDelete(RelationId) {
				this.RelationId = RelationId;
				var url = api.CommentDelete
				var params = new URLSearchParams();
				params.append('RelationId', this.RelationId);
				params.append('AuditType', this.AuditType);
				this.$axios({
					method: "post",
					url: url,
					data: params
				}).then(res => {
					if(res.data.success) {
						this.$layer.msg('删除成功');
						this.look = false;
						this.is_search = false;
						this.search();
					} else {
						this.$layer.msg(res.data.msg);
					}

				}).catch(err => {
					console.log(err)
				})
			},
			//判断身份
			formatter(row, column) {
				if(row.isAnonymous == false) {
					return "实名"
				} else {
					return "匿名"
				}
			}
		}
	}
</script>

<style scoped>
	.handle-box {
		margin-bottom: 20px;
		background: #fff;
		padding: 15px 20px;
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
		white-space: nowrap;
		width: 290px;
		text-align: right;
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
	/*弹窗*/
	
	.popup {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		/*padding:10px 0;*/
		background: #fff;
		width: 347px;
		z-index: 10;
	}
	
	.popup .title {
		height: 44px;
		line-height: 44px;
		background: rgba(248, 248, 248, 1);
		border-bottom: 1px solid rgba(226, 226, 226, 1);
		padding: 0 20px;
	}
	
	.title img {
		float: right;
		vertical-align: middle;
		margin-top: 15px;
		cursor: pointer;
	}
	
	.popup .text {
		text-align: center;
		padding: 55px 0;
		font-size: 18px;
		color: #333;
	}
	
	.button {
		text-align: center;
		padding-bottom: 30px;
	}
	/*遮罩层*/
	
	.mask {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: #000;
		opacity: 0.3;
		z-index: 8;
	}
	/*查看详情弹窗*/
	
	.details-box {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		/*padding:10px 0;*/
		background: #fff;
		width: 800px;
		z-index: 10;
		min-width: 470px;
		overflow-x: auto;
		border-radius: 5px;
	}
	
	.details-box .bottom {
		padding: 15px;
		padding-bottom: 0;
		text-align: center;
	}
	
	.bottom .cancel {
		padding: 30px 0;
	}
	
	.details-box .title {
		height: 50px;
		line-height: 50px;
		background: rgba(248, 248, 248, 1);
		border-bottom: 1px solid rgba(226, 226, 226, 1);
		padding: 0 20px;
		font-size: 18px;
	}
	
	.title img {
		float: right;
		vertical-align: middle;
		margin-top: 15px;
		cursor: pointer;
	}
	
	.details-box .text {
		padding: 19px 0;
		text-align: left;
		color: rgba(51, 51, 51, 1);
		font-size: 22px;
		overflow-y: auto;
	}
	
	.details-box .text span {
		display: inline-block;
		margin: 0 10px;
	}
	
	.details-box .text span:first-child {
		margin-left: 0;
	}
	
	.details-box .content-text {
		width: 100%;
		height: 100px;
		/*resize: none;*/
		color: rgba(102, 102, 102, 1);
		border: 0;
		background: rgba(245, 245, 245, 1);
		text-align: left;
		overflow-y: auto;
		padding: 4px;
		word-wrap: break-word;
		overflow-x: hidden;
		border-radius: 5px;
	}
	
	.author-box {
		text-align: left;
		padding-bottom: 10px;
	}
	
	.author-box .author {
		color: RGBA(56, 139, 255, 1);
	}
</style>