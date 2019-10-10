<template>
	<div class="table">
		<div class="handle-box">
			<div class="box">
				名称：
				<template>
					<!--@keyup.enter.native="search(UserName)" 输入框的回车搜索事件-->
					<!--@on-change="search(UserName)" 输入框数据变化时搜索事件-->
					<i-input placeholder="请输入名称" style="width: 199px;" v-model="UserName"></i-input>
				</template>
			</div>
			<div class="box">
				提交时间：
				<template style="display: inline-block;">
					<Date-picker :value="time" format="yyyy.MM.dd" type="daterange" placement="bottom-end" placeholder="选择日期" style="width: 200px" @on-change="referTime"></Date-picker>
				</template>
			</div>
			<div class="box box_end" style="padding-right: 20px;">
				<el-button type="primary" style="width: 70px" @click="search(UserName)">查询</el-button>
				<el-button type="primary" style="width: 70px" @click="resetSearch">重置</el-button>
			</div>
		</div>
		<div class="table-content">
			<div class="frame">
				<el-table :data="tableData" stripe style="width: 100%">
					<el-table-column type="index" width="70" label="编号" :index="typeIndex">
					</el-table-column>
					<el-table-column prop="id" label="ID" width="60">
					</el-table-column>
					<el-table-column prop="groupName" label="名称">
					</el-table-column>
					<el-table-column prop="createDateText" label="提交时间">
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
		<!--查看详情弹窗-->
		<div class="details-box" v-show="is_search">
			<div class="title">
				<span>反馈详情</span>
				<img src="../../../assets/img/close.png" alt="" @click="close()" />
			</div>
			<div class="bottom">
				<div class="text">
					<span>用户名：{{details.groupName}}</span>
					<span>手机号：{{details.phone}}</span>
					<span style="float: right;">提交时间：{{details.createDateText}}</span>
				</div>
				<div class="content-text">{{details.content}}</div>
				<div class="imgs" style="text-align: left;">
					<p>问题图片：</p>
					<span class="img" v-for="item in imageUrl">
						<img :src="item" alt="" />
					</span>
				</div>
				<div class="cancel">
					<el-button @click="close">关闭</el-button>
				</div>
			</div>
		</div>
		<!--遮罩层-->
		<div class="mask" v-show="is_search" @click="close"></div>
	</div>
</template>

<script>
	import * as api from '../../../api/api.js';
	export default {
		data() {
			return {
				is_search: false,
				time: ['', ''], //提交时间
				tableData: [], //投诉反馈列表
				PageNum: 1, //当前页数
				PageSize: 20, //每页的条数
				details: {}, //查看详情
				pageTotal: 0, //总页数
				totalSize: 0, //总条数
				UserName: "", //名称
				StartTime: "", //开始时间
				EndTime: "", //结束时间
				imageUrl: [] //问题图片数组

			}
		},
		created() {
			this.getComplaintList();
		},
		computed: {},
		methods: {
			//点击查看详情
			lookBox(index, row) {
				this.is_search = true;
				console.log(index)
				console.log(row)
				this.details = row;
				this.imageUrl = this.details.imageUrl

			},
			//关闭弹窗和遮罩层
			close() {
				this.is_search = false;
			},
			//获取投诉反馈信息列表
			getComplaintList(data) {
				var url = api.ComplaintList
				var params = new URLSearchParams();
				params.append('PageSize', this.PageSize);
				params.append('PageNum', this.PageNum);
				this.$axios({
					method: "post",
					url: url,
					data: params
				}).then(res => {
					this.tableData = res.data.rows;
					this.pageTotal = res.data.pageTotal
					this.totalSize = res.data.totalSize
				}).catch(err => {
					console.log(err)
				});

			},
			//编号问题
			typeIndex(index) {
				return index + (this.PageNum - 1) * 20 + 1;
			},
			//当前页数查询
			page(val) {
				this.PageNum = val
				var url = api.ComplaintList
				var params = new URLSearchParams();
				params.append('PageSize', this.PageSize);
				params.append('PageNum', this.PageNum);
				params.append('UserName', this.UserName);
				params.append('StartTime', this.StartTime);
				params.append('EndTime', this.EndTime);
				this.$axios({
					method: "post",
					url: url,
					data: params
				}).then(res => {
					this.tableData = res.data.rows;
					this.pageTotal = res.data.pageTotal
					this.totalSize = res.data.totalSize
				}).catch(err => {
					console.log(err)
				});
			},
			//查询
			search(UserName) {
				this.UserName = UserName
				var url = api.ComplaintList
				var params = new URLSearchParams();
				params.append('PageSize', this.PageSize);
				params.append('PageNum', 1);
				params.append('UserName', this.UserName);
				params.append('StartTime', this.StartTime);
				params.append('EndTime', this.EndTime);
				this.$axios({
					method: "post",
					url: url,
					data: params
				}).then(res => {
					this.tableData = res.data.rows;
					this.pageTotal = res.data.pageTotal
					this.totalSize = res.data.totalSize
				}).catch(err => {
					console.log(err)
				});
			},
			//重置
			resetSearch() {
				this.page(1)
				this.PageNum = 1;
				this.getComplaintList();
				this.UserName = "";
				this.time = "";
				this.StartTime = "";
				this.EndTime = "";
			},
			//获取提交时间
			referTime(value) {
				console.log(value[0])
				this.time = value;
				this.StartTime = value[0];
				this.EndTime = value[1]
			}
		}
	}
</script>

<style scoped>
	.handle-box {
		margin-bottom: 20px;
		background: RGBA(255, 255, 255, 1);
		padding: 10px 0px;
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
	
	.box_end {
		float: right;
		/*margin-right: 5%;*/
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
		text-align: center;
	}
	
	.bottom .cancel {
		padding: 15px 0;
	}
	
	.details-box .title {
		height: 44px;
		line-height: 44px;
		background: rgba(248, 248, 248, 1);
		border-bottom: 1px solid rgba(226, 226, 226, 1);
		padding: 0 20px;
		font-size: 18px;
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
	
	.title img {
		float: right;
		vertical-align: middle;
		margin-top: 15px;
		cursor: pointer;
	}
	
	.details-box .text {
		padding: 20px 0;
		text-align: left;
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
		height: 172px;
		/*resize: none;*/
		border: 0;
		text-align: left;
		background-color: RGBA(245, 245, 245, 1);
		padding: 5px;
	}
	
	.details-box textarea:focus {
		outline: none;
	}
	
	.imgs p {
		text-align: left;
		padding: 10px 0;
	}
	
	.imgs img {
		/*margin: 5px 5px;*/
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	
	.imgs .img {
		position: relative;
		display: inline-block;
		text-align: left;
		overflow-x: hidden;
		height: 74px;
		width: 74px;
		overflow: hidden;
		border-radius: 5px;
		margin-right: 5px;
		
	}
	
	.img .img-content {
		/*width: 120%;*/
		overflow-x: auto;
		height: 65px;
		width: 200%;
		overflow-y: hidden;
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
	
	.pagination {
		margin: 30px 0;
	}
</style>