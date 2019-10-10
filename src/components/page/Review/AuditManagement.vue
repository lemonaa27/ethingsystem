<template>
	<div class="table">
		<div class="handle-box">
			<div class="box">
				ID/标题：
				<template>
					<i-input placeholder="请输入ID或者内容标题" style="width: 170px;" v-model="Title"></i-input>
				</template>
			</div>
			<div class="box">
				分类：
				<template>
					<el-select v-model="valueType" placeholder="全部" style="width:170px;text-align: left;" @change="typeContent">
						<el-option v-for="item in classificationList" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</template>
			</div>
			<div class="box">
				身份：
				<template>
					<el-select v-model="identityVal" placeholder="全部" style="width:170px;text-align: left;" @change="identityContent">
						<el-option v-for="item in identityList" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</template>
			</div>
			<div class="box">
				评论者：
				<i-input placeholder="请输入评论者名称" style="width: 170px;" v-model="UserName"></i-input>
			</div>
			<div class="box" style="float: right; text-align: right;padding-right: 20px;">
				<el-button type="primary" style="width: 70px;" @click="search(Title,UserName)">查询</el-button>
				<el-button type="primary" style="width: 70px;" @click="resetSearch">重置</el-button>
			</div>

		</div>
		<div class="table-content">
			<div class="frame">
				<el-table :data="tableData" stripe style="width: 100%">
					<el-table-column type="index" width="70" label="编号" :index="typeIndex">
					</el-table-column>
					<el-table-column prop="id" label="ID" width="100">
					</el-table-column>
					<el-table-column prop="title" label="标题">
					</el-table-column>
					<el-table-column prop="content" label="评论">
					</el-table-column>
					<el-table-column prop="categoryName" label="分类">
					</el-table-column>
					<el-table-column prop="groupName" label="评论者">
					</el-table-column>
					<el-table-column prop="isAnonymous" label="身份" :formatter="formatter">
					</el-table-column>
					<el-table-column prop="createDateText" label="发布时间">
					</el-table-column>
					<el-table-column prop="operation" label="操作" width="100">
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
		<!--删除弹窗-->
		<div class="popup" v-show="amputate">
			<div class="title">
				<span>删除评论</span>
				<img src="../../../assets/img/close.png" alt="" @click="close()" />
			</div>
			<div class="text">
				确定删除?
			</div>
			<div class="button">
				<el-button type="primary" @click="textDelete(details.commentId)">确定</el-button>
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
		<!--发布弹窗-->
		<div class="popup" v-show="release">
			<div class="title">
				<span>发布评论</span>
				<img src="../../../assets/img/close.png" alt="" @click="close()" />
			</div>
			<div class="text">
				确定发布?
			</div>
			<div class="button">
				<el-button type="primary" @click="adoptComment(details.commentId)">确定</el-button>
			</div>
		</div>
		<!--遮罩层-->
		<div class="mask" v-show="is_search" @click="close"></div>
		<!--查看详情弹窗-->
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
				<div class="content-text">
					{{details.content}}
				</div>
				<div class="cancel">
					<!--<el-button @click="close">取消</el-button>-->
					<el-button type="danger" @click="amputateBox" v-show="this.deleteComment.isexist">删除</el-button>
					<el-button type="primary" @click="releaseBox" v-show="this.deleteComment.isexist">通过</el-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import * as api from '../../../api/api.js';
	export default {
		data() {
			return {
				order: 'asc', //排序
				sort: 'createdate', //排序
				dataTotal: 0,
				identityVal: "", //身份选中内容
				commentId: "", //查看详情id
				AuditType: "Down", //删除状态
				AuditType1: "Publish", //通过
				RelationId: "", //删除id
				IsAnonymous: "", //是否是匿名
				details: {}, //详情
				UserName: "", //评论者
				valueType: "", //分类选中内容
				CategoryId: "", //分类id
				Title: "", //id或者标题
				PageNum: 1, //当前页数
				PageSize: 20, //每页的条数
				totalSize: 0, //总条数
				pageTotal: 0, //总页数
				CommentStatus: 0, //状态码
				is_search: false, //遮罩层
				release: false, //发布弹窗
				amputate: false, //删除弹窗
				look: false, //查看详情弹窗
				tips: false, //提示作者已删除弹窗
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
				tableData: [], //列表
				//身份内容
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
			this.getMgrCommentAuditList();
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
				this.amputate = false
				this.look = false;
				this.tips = false;
			},
			//打开发布弹窗
			releaseBox() {
				this.release = true;
				this.is_search = true;
				this.look = false;

			},
			//打开删除弹窗
			amputateBox() {
				this.amputate = true;
				this.look = false;
			},
			//查看详情弹窗
			lookBox(index, row) {
				this.details = row;
				this.look = true;
				this.is_search = true;

			},
			//获取列表
			getMgrCommentAuditList(data) {
				var url = api.MgrCommentAuditList;
				var params = new URLSearchParams();
				params.append('CommentStatus', this.CommentStatus);
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
				this.PageNum = val
				var url = api.MgrCommentAuditList;
				var params = new URLSearchParams();
				params.append('CommentStatus', this.CommentStatus);
				params.append('PageSize', this.PageSize);
				params.append('PageNum', this.PageNum);
				params.append('Title', this.Title);
				params.append('CategoryId', this.CategoryId);
				params.append('UserName', this.UserName);
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
				var url = api.MgrCommentAuditList;
				var params = new URLSearchParams();
				params.append('CommentStatus', this.CommentStatus);
				params.append('PageSize', this.PageSize);
				params.append('Title', this.Title);
				params.append('CategoryId', this.CategoryId);
				params.append('UserName', this.UserName);
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
			//分类
			typeContent(value) {
				console.log(value)
				this.CategoryId = value;

			},
			//重置
			resetSearch() {
				this.page(1)
				this.PageNum = 1;
				this.CategoryId = "";
				this.UserName = "";
				this.Title = "";
				this.valueType = "";
				this.identityVal = "";
				this.IsAnonymous = "";
				var url = api.MgrCommentAuditList;
				var params = new URLSearchParams();
				params.append('CommentStatus', this.CommentStatus);
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
			//身份选择
			identityContent(value) {
				this.IsAnonymous = Boolean(this.IsAnonymous)
				this.IsAnonymous = value;
			},
			//判断身份
			formatter(row, column) {
				if(row.isAnonymous == false) {
					return "实名"
				} else {
					return "匿名"
				}
			},
			//删除
			textDelete(RelationId) {
				this.RelationId = RelationId;
				var url = api.CommentAudit
				var params = new URLSearchParams();
				params.append('RelationId', this.RelationId);
				params.append('AuditType', this.AuditType);
				this.$axios({
					method: "post",
					url: url,
					data: params
				}).then(res => {
					if(res.data.success) {
//						this.getMgrCommentList();
						this.$layer.msg('删除成功');
						this.amputate = false;
						this.is_search = false;
						this.look = false;
						this.search()
					} else {
//						this.resetSearch();
						this.tips = true;
						this.is_search = true;
						this.look = false;
						this.amputate = false;
					}
				}).catch(err => {
					console.log(err)
				})
			},
			//通过
			adoptComment(RelationId) {
				this.RelationId = RelationId;
				var url = api.CommentAudit
				var params = new URLSearchParams();
				params.append('RelationId', this.RelationId);
				params.append('AuditType', this.AuditType1);
				this.$axios({
					method: "post",
					url: url,
					data: params
				}).then(res => {
					if(res.data.success) {
						this.$layer.msg('通过成功');
						this.release = false;
						this.is_search = false;
						this.look = false;
						this.search();
					} else {
						this.tips = true;
						this.is_search = true;
						this.release = false;
						this.look = false;
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
		margin-bottom: 20px;
		background: #fff;
		padding: 15px 0px;
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
		width: 265px;
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
		z-index: 12;
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
	
	.content-box .author {
		color: red !important;
	}
	
	.author-box {
		text-align: left;
		padding-bottom: 10px;
	}
	
	.author-box .author {
		color: rgba(56, 139, 255, 1);
		margin-right: 30px;
	}
	
	.pagination {
		margin: 30px 0;
	}
</style>