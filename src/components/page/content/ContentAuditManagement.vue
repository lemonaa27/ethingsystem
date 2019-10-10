<template>
	<div class="table">
		<div class="handle-box">
			<div class="box">
				ID/标题：
				<i-input placeholder="请输入ID或者标题内容" v-model="Title" style="width: 170px; margin-right: 20px; "></i-input>
			</div>
			<div class="box">
				分类：
				<template>
					<el-select v-model="content_fl" style="width:170px;margin-right: 20px;" placeholder="全部" @change="typeCount">
						<el-option v-for="item in classificationList" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</template>
			</div>

			<div class="box">
				作者：
				<i-input placeholder="请输入作者名称" v-model="Autor" style="width: 170px; margin-right: 20px;"></i-input>
			</div>
			<div class="box">
				身份：
				<template>
					<el-select v-model="IsAnonymous" style="width:170px;margin-right: 20px;" placeholder="全部" @change="identityCount">
						<el-option v-for="item in identityList" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</template>
			</div>

			<div class="box" style="float: right; text-align: right;">
				<el-button type="primary" style=" width: 66px;" @click="search()">查询</el-button>
				<el-button type="primary" style=" width: 66px;" @click="reset()">重置</el-button>
			</div>

		</div>
		<div class="table-content">
			<div class="frame">
				<el-table :data="tableData" stripe style="width: 100%">
					<el-table-column type="index" width="70" label="编号" :index="typeIndex">
					</el-table-column>
					<el-table-column prop="id" label="ID" width="60">
					</el-table-column>
					<el-table-column prop="title" label="标题">
					</el-table-column>
					<el-table-column prop="categoryName" label="分类">
					</el-table-column>
					<el-table-column prop="groupName" label="作者">
					</el-table-column>
					<el-table-column prop="isAnonymous" label="身份" :formatter="formatter">
					</el-table-column>
					<el-table-column prop="contentStatusText" label="状态">
					</el-table-column>
					<el-table-column prop="createDateText" label="发布时间">
					</el-table-column>
					<el-table-column prop="operation" label="操作">
						<template slot-scope="scope">
							<el-button type="text" size="small" @click="look(scope.$index, scope.row)">查看</el-button>
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
		<!--查看详情弹框-->
		<div class="content-details" v-show="detailShow">
			<div class="content-box">
				<div class="top_header">
					<div class="top_one">
						基本信息
					</div>
					<div class="top">
						<span class="top_span" style="width:490px !important;">
						<span>标题:</span> <span class="blue" style="width:490px !important;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{contentDetail.title}}</span>
						</span>
						<span class="top_span">
						<span>作者:</span>
						<el-tooltip  class="blue" :content="contentDetail.groupName" placement="top">
						  	<span>{{contentDetail.groupName}}</span>
						</el-tooltip>
						</span>
						
						<span class="top_span">系统花名:</span> <span>{{contentDetail.nickName}}</span>
						</span>
						<span class="top_span" style="width: 140px;">
						<span>分类:</span> <span>{{contentDetail.categoryName}}</span></br>
						</span>
						<span class="top_span">
						<span>发布时间:</span> <span>{{contentDetail.createDateText}}</span>
						</span>
						<span class="top_span">
						<span>状态:</span> <span>{{contentDetail.contentStatusText}}</span>
						</span>
					</div>
				</div>
				<!--驳回原因展示-->
				<div class="bohui" style="padding: 15px 0;" v-if="this.rejectList != null">
					<div class="reason">驳回原因</div>
					<div style="background: #fff;">
						<span style="vertical-align: top;padding-left: 19px;line-height: 30px;">原&emsp;&emsp;因：</span>
						<div style="display: inline-block;width:93%;height: 100px;overflow-y: auto;">
							<div class="reson_text" v-for="item in rejectList" style="line-height: 30px;">
								{{item.timestring}}<br/>{{item.reason}}
							</div>
						</div>
					</div>
					

				</div>
				<!--内容部分-->
				<div class="content_de">
					<div class="content_mid">
						<div class="content_detail">内容详情</div>
						<div class="middle">
							<div class="bottom-box" v-if="contentDetail.categoryId == '9f50baa8-84f3-11e8-97b3-00163e06561e'">
								<span class="name_tit">封面图:</span>
								<img :src="contentDetail.imageUrl" alt="" />
							</div>
							<div class="bottom_two">
								<span class="name_tit">内&emsp;容:</span>
								<div class="name_con" v-for="item in detail_content">
									<p>{{item.text}}</p>
									<div class="img_notes">
										<img :src="item.img" alt="" />
										<p class="notes">{{item.notes}}</p>
									</div>
								</div>
								<div v-for="item in imgList" style="margin-left: 4%;">
									<p>
										<img :src="item" alt="" />
									</p>
								</div>
							</div>

						</div>
					</div>

					<div class="button">
						<el-button type="primary" size="medium" @click="amputateBox" v-show="this.shContent.isexist">通过</el-button>
						<el-button type="danger" size="medium" @click="reject"  v-show="this.shContent.isexist">驳回</el-button>
						<el-button type="info" size="medium" style="background: #fff; color:RGBA(51, 51, 51, 1); border: 1px solid #ccc;" @click="closeDetail()">取消</el-button>

					</div>
				</div>

			</div>
		</div>

		<!--驳回原因弹窗-->
		<div class="details-box" v-show="is_search">
			<div class="title">
				<span>驳回原因</span>
				<img src="../../../assets/img/close.png" alt="" @click="close" />
			</div>
			<div class="bottom">
				<div class="text">
					<span>标题：{{contentDetail.title}}</span>
				</div>
				<div class="text_note">
					<textarea v-model="text1"></textarea>
					
				</div>
				
				<div class="cancel">
					<el-button type="primary" @click="determine">提交</el-button>
				</div>
			</div>
		</div>

		<!--通过弹窗-->
		<div class="popup" v-show="amputate">
			<div class="title">
				<span>确认发布</span>
				<img src="../../../assets/img/close.png" alt="" @click="close()" />
			</div>
			<div class="text">
				确定发布?
			</div>
			<div class="button">
				<el-button type="primary" size="middle" @click="sure()">确认</el-button>
			</div>
		</div>
		<div class="mask" v-show="mask"></div>
	</div>
</template>

<script>
	import baseUrl from '../common/baseUrl'
	export default {
		data() {
			return {
				rejectList:'',//驳回原因
				order: 'asc', //排序
				sort: 'createdate', //排序
				imgList: [], //查看详情问一句，说一嘴图片数组
				Id: '', //id
				Title: '', //标题
				content_fl: '', //分类
				Autor: '', //作者
				CategoryId: '', //分类接口
				IsAnonymous: '', //身份字段
				contentDetail: '', //查看详情内容
				detail_content: '', //内容详情的内容部分
				text1: '您所发布的信息暂未通过审核，请检查是否包含违反宪法及法律行政法规的相关内容，如封建迷信、淫秽色情、赌博暴力、教唆犯罪、散布谣言、扰乱社会秩序等。', //驳回
				AuditType: 'Reject', // 驳回字段
				AuditType1: 'Publish', //通过字段
				is_search: false,
				amputate: false,
				detailShow: false,
				ContentStatusList: 0, //状态为0，审核中
				mask: false, //遮罩
				PageNum: 1, //当前页
				PageSize: 20, //每页条数
				pageTotal: 0, //总页数
				totalSize: 0, //总条数
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
				identityList: [{
						value: '',
						label: '全部'
					}, {
						value: true,
						label: '匿名'
					},
					{
						value: false,
						label: '实名'
					},
				],
				value2: ['', ''],
				tableData: [],
				funcId:"",//按钮权限的functionId
				shContent:'',//关联内容按钮
				lookView:''//查看信息按钮
			}
		},
		created() {
			this.getData();
			this.getFuncId();
		},
		computed: {},
		methods: {
			//获取按钮权限
			getFuncId(){
				if(!this.funcId){
					this.funcId = sessionStorage.getItem('functionid');
					
				}else{
					this.funcId=localStorage.getItem('functionId');
				}
				this.$axios({
					method:'GET',
					url:baseUrl + '/api/mgr/Role_Dept/QueryFunction',
					params:{
						functionId:this.funcId
					}
				}).then(res=>{
					this.lookView = res.data.data[0] //查看信息按钮
					this.shContent = res.data.data[1] //审核权限按钮
				
				})
			},
			//获取内容列表
			getData() {
				var params = new URLSearchParams();
				params.append('PageNum', this.PageNum);
				params.append('PageSize', this.PageSize);
				params.append('ID', this.Id);
				params.append('Title', this.Title);
				params.append('CategoryId', this.CategoryId);
				params.append('IsAnonymous', this.IsAnonymous);
				params.append('Autor', this.Autor);
				params.append('Sort', this.sort);
				params.append('Order', this.order);
				params.append('ContentStatusList', this.ContentStatusList);
				this.$axios({
					method: 'POST',
					url: baseUrl + '/api/mgr/Content/MgrContentAuditList',
					data: params
				}).then(res => {
					this.tableData = res.data.rows
					this.pageTotal = res.data.pageTotal
					this.totalSize = res.data.totalSize
				}).catch(error => {
					console.log(error)
				})
			},
			//编号问题
			typeIndex(index) {
				return index + (this.PageNum - 1) * 20 + 1;
			},
			//分页
			page(val) {
				this.PageNum = val;
				this.getData();
			},
			//分类选择
			typeCount(value) {
				this.CategoryId = value;
			},
			//身份查询
			identityCount(value) {
				console.log(value)
				this.IsAnonymous = value;
				this.IsAnonymous = Boolean(this.IsAnonymous)
			},
			//身份列表
			formatter(row, column) {
				if(row.isAnonymous == false) {
					return "实名"
				} else {
					return "匿名"
				}
			},
			//查询功能
			search() {
				this.PageNum = 1;
				var params = new URLSearchParams();
				params.append('PageSize', this.PageSize);
				params.append('ID', this.Id);
				params.append('Title', this.Title);
				params.append('CategoryId', this.CategoryId);
				params.append('IsAnonymous', this.IsAnonymous);
				params.append('Autor', this.Autor);
				params.append('Sort', this.sort);
				params.append('Order', this.order);
				params.append('ContentStatusList', this.ContentStatusList);
				this.$axios({
					method: 'POST',
					url: baseUrl + '/api/mgr/Content/MgrContentAuditList',
					data: params
				}).then(res => {
					this.tableData = res.data.rows
					this.pageTotal = res.data.pageTotal
					this.totalSize = res.data.totalSize
				}).catch(error => {
					console.log(error)
				})
			},
			//重置
			reset() {
				this.page(1)
				this.PageNum = 1;
				this.Title = "";
				this.CategoryId = "";
				this.Autor = "";
				this.content_fl = "";
				this.IsAnonymous = "";
				var params = new URLSearchParams();
				params.append('Sort', this.sort);
				params.append('Order', this.order);
				params.append('PageNum', this.PageNum);
				params.append('PageSize', this.PageSize);
				params.append('ContentStatusList', this.ContentStatusList);
				this.$axios({
					method: 'POST',
					url: baseUrl + '/api/mgr/Content/MgrContentAuditList',
					data: params
				}).then(res => {
					this.tableData = res.data.rows
					this.pageTotal = res.data.pageTotal
					this.totalSize = res.data.totalSize
				}).catch(error => {
					console.log(error)
				})
			},
			//打开删除内容弹框
			open(msg) {
				this.$alert(msg, '提示', {
					confirmButtonText: '确定'
				});
			},
			//查看详情弹框
			look(index, row) {
				console.log(row)
				this.back()
				this.$axios({
					method: 'GET',
					url: baseUrl + '/api/mgr/Content/MgrAuditContentDetail',
					params: {
						id: row.id
					}
				}).then(res => {
					//					console.log(res.data.data.appContent)
					if(res.data.success) {
						this.detailShow = !this.detailShow;
						this.contentDetail = row;
						this.detail_content = JSON.parse(res.data.data.appContent);
						this.imgList = res.data.data.imageList
						this.rejectList = res.data.data.rejectReasonList; // 显示驳回原因
						//						console.log(this.detail_content)
					} else {
						this.open(res.data.msg)
					}
				}).catch(err => {
					console.log(err)
				})
//				this.$axios({
//					method: 'GET',
//					url: baseUrl + '/api/mgr/Content/CheckContent',
//					params: {
//						id: row.id
//					}
//				}).then(res => {
//					if(res.data.success) {
//						this.$axios({
//							method: 'GET',
//							url: baseUrl + '/api/mgr/Content/MgrContentDetail',
//							params: {
//								id: row.id
//							}
//						}).then(res => {
//							//					console.log(res.data.data.appContent)
//							if(res.data.success) {
//								this.detailShow = !this.detailShow;
//								this.contentDetail = row;
//								this.detail_content = JSON.parse(res.data.data.appContent);
//								this.imgList = res.data.data.imageList
//								//						console.log(this.detail_content)
//							} else {
//								this.open(res.data.msg)
//							}
//						}).catch(err => {
//							console.log(err)
//						})
//					} else {
//						this.open(res.data.msg)
//					}
//				}).catch(err => {
//					console.log(err)
//				})

			},
			//取消查看详情
			closeDetail() {
				this.detailShow = false;
//				this.reset();
			},
			//打开驳回弹窗
			reject() {
				this.is_search = true;
				this.mask = true;
//				this.reset()
			},
			//确认发布弹窗？
			amputateBox() {
				this.amputate = true;
				this.mask = true;
//				this.reset()
			},
			//关闭弹窗
			close() {
				this.is_search = false
				this.amputate = false;
				this.mask = false
			},
			//驳回确定
			determine() {
				if(this.text1 != "") {
					var params = new URLSearchParams();
					params.append('RelationId', this.contentDetail.id);
					params.append('AuditType', this.AuditType);
					params.append('Remark', this.text1);
					this.$axios({
						method: 'POST',
						url: baseUrl + '/api/mgr/Content/ContentAudit',
						data: params
					}).then(res => {
						if(res.data.success){
							this.$layer.msg('驳回成功')
							this.is_search = false;
							this.mask = false;
							this.detailShow = false;
							this.search();
							this.text1 = '您所发布的信息暂未通过审核，请检查是否包含违反宪法及法律行政法规的相关内容，如封建迷信、淫秽色情、赌博暴力、教唆犯罪、散布谣言、扰乱社会秩序等。'
						}else{
							this.is_search = false;
							this.mask = false;
							this.detailShow = false;
//							this.reset();
							this.open(res.data.msg)
							this.text1 = '您所发布的信息暂未通过审核，请检查是否包含违反宪法及法律行政法规的相关内容，如封建迷信、淫秽色情、赌博暴力、教唆犯罪、散布谣言、扰乱社会秩序等。'
						}
					})
				} else {
					this.$layer.msg('请输入驳回原因')
				}
			},
			//通过确定
			sure() {
				var params = new URLSearchParams();
				params.append('RelationId', this.contentDetail.id);
				params.append('AuditType', this.AuditType1);
				params.append('Remark', this.reason);
				this.$axios({
					method: 'POST',
					url: baseUrl + '/api/mgr/Content/ContentAudit',
					data: params
				}).then(res => {
					if(res.data.success){
						this.$layer.msg("通过成功")
						this.amputate = false;
						this.mask = false;
						this.detailShow = false;
						this.search();
					}else{
						this.amputate = false;
						this.mask = false;
						this.detailShow = false;
//						this.reset();
						this.open(res.data.msg)
					}
					
				})
			},
			back() {
				var that = this
				$(document).ready(function(e) {
					var counter = 0;
					if(window.history && window.history.pushState) {
						$(window).on('popstate', function() {
							that.closeDetail();
							that.close();
						});
					}
					window.history.pushState('forward', '#'); //在IE中必须得有这两行
					window.history.forward(1);
				});
			}
		}
	}
</script>

<style scoped>
	.handle-box {
		margin-bottom: 20px;
		background: #FFFFFF;
		padding: 15px 20px;
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
		white-space: nowrap;
		width: 290px;
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
	/*查看详情*/
	
	.content-box {
		width: 100%;
		height: 100%;
		display: flex;
		flex: 1;
		flex-direction: column;
		overflow: hidden;
	}
	
	.content-details {
		background: #F4F4F4;
		/*position: relative;*/
		width: 98%;
		height: 98%;
		padding: 10px;
		z-index: 6;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		flex-direction: column;
		overflow: auto;
	}
	
	.top_header {
		width: 100%;
	}
	
	.top {
		width: 100%;
		padding-left: 19px;
		margin-bottom: 20px;
		background: #fff;
		position: relative;
		line-height: 60px;
	}
	
	.top span {
		/*display: inline-block;*/
		font-size: 14px;
		white-space: nowrap;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	.middle {
		padding: 15px;
		position: relative;
		width: 100%;
		height: 68%;
		min-height: 100px;
		overflow-y: auto;
		display: flex;
		flex: 1;
		flex-direction: column;
	}
	
	.bottom-box {
		margin-bottom: 15px;
	}
	
	.middle textarea {
		display: inline-block;
		height: 128px;
		width: 94%;
		resize: none;
		vertical-align: top;
		margin-left: 40px;
		padding: 5px;
	}
	
	.middle textarea:focus {
		outline: none;
	}
	
	.middle img {
		width: 300px;
		/*height: 170px;*/
		vertical-align: top;
	}
	
	.middle p {
		line-height: 30px;
		letter-spacing: 0.5px;
	}
	
	.button {
		padding: 35px 0;
		text-align: center;
		width: 100%;
	}
	/*驳回弹窗*/
	
	.details-box {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: #fff;
		width: 800px;
		z-index: 10;
		min-width: 470px;
		overflow-x: auto;
	}
	
	.details-box .bottom {
		padding: 15px;
		text-align: center;
	}
	
	.bottom .cancel {
		padding: 15px 0;
	}
	
	.details-box .title {
		height: 50px;
		line-height: 50px;
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
	
	.details-box .text {
		padding: 15px 0;
		text-align: left;
		font-size: 22px;
		/*font-family: MicrosoftYaHei;*/
		color: rgba(51, 51, 51, 1);
		/*line-height: 0px;*/
	}
	
	.details-box .text span {
		display: inline-block;
		margin: 0 10px;
	}
	
	.details-box .text span:first-child {
		margin-left: 0;
	}
	
	.details-box textarea {
		width: 100%;
		height: 110px;
		resize: none;
		border: 0;
		text-align: left;
		background: rgba(245, 245, 245, 1);
		border-radius: 6px;
	}
	
	.details-box textarea:focus {
		outline: none;
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
		z-index: 7;
	}
	/*确认发布弹窗*/
	
	.popup {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		/*padding:10px 0;*/
		background: #fff;
		width: 347px;
		z-index: 15;
	}
	
	.popup .title {
		height: 44px;
		line-height: 44px;
		background: rgba(248, 248, 248, 1);
		border-bottom: 1px solid rgba(226, 226, 226, 1);
		padding: 0 20px;
	}
	
	.popup .title img {
		float: right;
		vertical-align: middle;
		margin-top: 15px;
		cursor: pointer;
	}
	
	.popup .text {
		text-align: center;
		padding: 40px 0;
		font-size: 18px;
		color: #333;
	}
	
	.popup .button {
		text-align: center;
		padding: 0;
		padding-bottom: 30px;
	}
	
	.top_one {
		width: 100%;
		height: 50px;
		line-height: 50px;
		padding-left: 19px;
		background-color: #E7E9EB;
		color: #333;
	}
	
	.blue {
		color: #388BFF;
		cursor: pointer;
	}
	
	.top>.top_span {
		display: inline-block;
		width: 230px;
	}
	/*内容详情*/
	
	.content_detail {
		width: 100%;
		height: 50px;
		line-height: 50px;
		background-color: #E7E9EB;
		color: #333;
		padding-left: 19px;
	}
	
	.name_tit {
		width: 4%;
		float: left;
		color: rgba(51, 51, 51, 1);
		line-height: 30px;
		font-size: 14px;
	}
	
	.name_con {
		width: 92%;
		padding-left: 4%;
	}
	
	.content_de {
		display: flex;
		flex: 1;
		flex-direction: column;
		overflow: hidden;
		background-color: #fff;
	}
	
	.content_mid {
		display: flex;
		flex: 1;
		flex-direction: inherit;
		overflow-y: auto;
	}
	
	.pagination {
		margin: 30px 0;
	}
	.text_note{
		position: relative;
	}
	.note{
		position: absolute;
		top:0;
		left: 0;
		text-align: left;
		padding:5px;
	}
	.bohui {
		width: 100%;
	}
	
	.reason {
		width: 100%;
		height: 50px;
		line-height: 50px;
		background: RGBA(231, 233, 235, 1);
		color: RGBA(51, 51, 51, 1);
		font-size: 14px;
		padding-left: 19px;
	}
</style>