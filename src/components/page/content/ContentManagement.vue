<template>
	<div class="table">
		<div class="handle-box">
			<div class="box">
				ID/标题：
				<template>
					<!--@keyup.enter.native="search(UserName)" 输入框的回车搜索事件-->
					<!--@on-change="search(UserName)" 输入框数据变化时搜索事件-->
					<i-input placeholder="请输入ID或者内容标题" v-model="Titlea" style="width: 170px; margin-right: 20px; height: 36px; "></i-input>
				</template>
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
				状态：
				<template>
					<el-select v-model="ContentStatus" style="width:170px;margin-right: 20px;" placeholder="全部" @change="statusCount">
						<el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</template>
			</div>
			<div class="box">
				作者：
				<template>
					<i-input placeholder="请输入作者名称" v-model="Autor" style="width: 170px; margin-right: 20px;"></i-input>
				</template>
			</div>
			<div class="box">
				审核人：
				<template>
					<i-input placeholder="请输入审核人" v-model="Auditor" style="width: 170px; margin-right: 20px;"></i-input>
				</template>
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
			<div class="box">
				发布时间：
				<Date-picker :value="value2" v-model="releaseTime " format="yyyy-MM-dd" type="daterange" placement="bottom-end" placeholder="开始时间-结束时间" style="width: 200px" @on-change="referTime"></Date-picker>
			</div>
			<div class="box">
				<el-button type="primary" style="width: 66px;" @click="search()">查询</el-button>
				<el-button type="primary" style="width: 66px;" @click="reset()">重置</el-button>
				<el-button type="primary" style="width: 96px;text-align: center;background: #F07C00;border: 1px solid #F07C00;" @click="establish()" v-show="this.createContent.isexist" class="creatText">创建内容</el-button>
			</div>

		</div>
		<div class="table-content">
			<div class="frame">
				<el-table :data="tableData" stripe style="width: 100%">
					<el-table-column type="index" width="70" label="编号" :index="typeIndex">
					</el-table-column>
					<el-table-column prop="id" label="ID" width="60">
					</el-table-column>
					<el-table-column prop="title" label="标题" width="230">
					</el-table-column>
					<el-table-column prop="categoryName" label="分类">
					</el-table-column>
					<el-table-column prop="groupName" label="作者">
					</el-table-column>
					<el-table-column prop="auditor" label="审核人">
					</el-table-column>
					<el-table-column prop="pvCount" label="浏览数" width="80">
					</el-table-column>
					<el-table-column prop="isAnonymous" label="身份" :formatter="formatter" width="90">
					</el-table-column>
					<el-table-column prop="contentStatusText" label="状态">
					</el-table-column>
					<el-table-column prop="createDateText" label="发布时间">
					</el-table-column>
					<el-table-column prop="operation" label="操作">
						<template slot-scope="scope">
							<el-button type="text" size="small" @click="lookBox(scope.$index, scope.row)">查看</el-button>
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
		<!--查看详情-->
		<div class="content-details" v-show="detailShow">
			<div class="content-box">
				<div class="top_header">
					<div class="top_one">基本信息</div>
					<div class="top">
						<div class="content-text">
							<span class="top_span">
								<span>标题:
									&emsp;<span class="blue" style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{contentDetail.title}}</span>
							</span>
							</span>
							<span class="top_span" style="width: 268px;">
							<span>作者:</span>
							<el-tooltip class="blue" :content="contentDetail.groupName" placement="top">
								<span>{{contentDetail.groupName}}</span>
							</el-tooltip>
							</span>
							<span class="top_span" v-if="">
								<span>系统花名:</span>&emsp;<span class="blue">{{contentDetail.nickName}}</span>
							</span>
							<span class="top_span">
								<span>分类:</span>&emsp;<span>{{contentDetail.categoryName}}</span>
							</span>
							<span class="top_span">
								<span>审核人:</span>&emsp;<span>{{contentDetail.auditor}}</span>
							</span>
							</br>
							<span class="top_span" style="padding-right: 70px;width: 287px !important;">
								<span>发布时间：</span>&emsp;<span>{{contentDetail.createDateText}}</span>
							</span>
							<span class="top_span" style="padding-right: 70px;">
								<span>发布状态:</span>&emsp;<span>{{contentDetail.contentStatusText}}</span>
							</span>
							<span class="top_span" style="padding-right: 140px;width: 268px;">
								<span>评论数:</span>&emsp;<span>{{contentDetail.commentCount}}</span>
							</span>
							<span class="top_span">
								<span>浏览数:</span>&emsp;<span>{{contentDetail.pvCount}}</span>
							</span>
							<span class="top_span">
								<span>点赞数:</span>&emsp;<span>{{contentDetail.supportCount}}</span>
							</span>

						</div>
						<div class="btn">
							<el-button size="small" @click="relationBox()" style="margin-bottom: 30px;" v-if="contentDetail.contentStatus==1" v-show="this.glContent.isexist">内容关联</el-button> <br>
							<el-button type="primary" size="small" @click="upBox(contentDetail.categoryId)" v-if="contentDetail.contentStatus==1" v-show="this.zdContent.isexist">置顶内容</el-button>
						</div>
					</div>
				</div>
				<!--强制下架原因展示-->
				<div class="bohui" v-if="this.reject != null">
					<div class="reason">强制下架原因</div>
					<span style="vertical-align: top;padding-left: 19px;line-height: 30px;">原&emsp;&emsp;因：</span>
					<div style="display: inline-block;width:93%;height: 70px;overflow-y: auto;">
						<div style="line-height: 30px;">
							{{reject.timestring}}<br/>{{reject.reason}}
						</div>
					</div>

				</div>
				<!--驳回原因展示-->
				<div class="bohui" style="padding: 15px 0;" v-if="this.rejectList != null">
					<div class="reason">驳回原因</div>
					<span style="vertical-align: top;padding-left: 19px;line-height: 30px;">原&emsp;&emsp;因：</span>
					<div style="display: inline-block;width:93%;height: 100px;overflow-y: auto;">
						<div class="reson_text" v-for="item in rejectList" style="line-height: 30px;">
							{{item.timestring}}<br/>{{item.reason}}
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
								<img :src="contentDetail.imageUrl" alt="" draggable="false" />
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
										<img :src="item" alt="" draggable="false" />
									</p>
								</div>
							</div>

						</div>
					</div>

					<div class="button">
						<el-button type="danger" size="medium" @click="down" class="force" :disabled="contentDetail.contentStatus == 5" v-if="contentDetail.contentStatus == 1" v-show="this.coerceContent.isexist">强制下架</el-button>
						<el-button type="info" size="medium" style="background: #fff;color: RGBA(51, 51, 51, 1); border: 1px solid #ccc;" @click="closeDetail()">取消</el-button>

					</div>
				</div>

			</div>
		</div>
		<!--强制下架弹窗-->
		<div class="details-box" v-show="lower">
			<div class="title">
				<span style="font-size: 18px;">下架原因</span>
				<img src="../../../assets/img/close.png" alt="" @click="close" />
			</div>
			<div class="bottom">
				<div class="text">
					{{contentDetail.title}}
				</div>
				<textarea class="textarea" placeholder="请输入下架原因" v-model="reason"></textarea>
				<div class="cancel">
					<el-button type="primary" @click="determine(1)">确认</el-button>
				</div>
			</div>
		</div>

		<!--复审弹窗-->
		<div class="details-box" v-show="amputate">
			<div class="title">
				<span>复审原因</span>
				<img src="../../../assets/img/close.png" alt="" @click="close" />
			</div>
			<div class="bottom">
				<div class="text">
					<span>标题：AMG GT Concept量产版内饰谍照</span>
				</div>
				<textarea></textarea>
				<div class="cancel">
					<el-button type="primary" @click="determine(2)">确认</el-button>
				</div>
			</div>
		</div>
		<!--内容关联弹窗-->
		<div class="details-box relation" v-show="relation">
			<div class="title">
				<span style="font-size: 18px;">内容关联</span>
				<img src="../../../assets/img/close.png" alt="" @click="close" />
			</div>
			<div class="bottom" style="display: flex;flex-direction: column;flex:1;">
				<div class="text">
					<span>已关联内容</span>
					<span class="num">
						<span>{{contentRelaList.length}}</span>/<span>3</span>
					</span>
				</div>
				<div class="color-list associate">
					<div class="color-item" style="height:56px;background: rgba(250, 251, 251, 1);border: 3px solid #fff;" v-for="(item,index) in contentRelaList" v-dragging="{ item: item, list: contentRelaList, group: 'contentRelaList' }" :key="index">
						<span style="width: 70px;height: 25px;">
							<span class="iconfont icon-tool-move hover_c"></span>
						</span>
						<span style="width: 100px;">{{item.relationId}}</span>
						<span style="width: 200px;">{{item.title}}</span>
						<span style="width: 150px;text-align: right; color: red; cursor: pointer;" @click="relieve(item.id,item.relationId)">解除关联</span>
					</div>
				</div>
				<div class="bt">
					ID/标题：
					<template>
						<i-input v-model="Title" placeholder="请输入ID/标题" style="width: 168px; margin-right: 20px; " size="small"></i-input>
					</template>
					<el-button type="primary" size="small" style="width: 66px;" @click="search_detail()">查询</el-button>
					<el-button size="small" style="width: 66px;" @click="resetRelation()">重置</el-button>
				</div>
				<div class="tabulation">
					<template>
						<div class="title_tab">
							<span class="span_1" style="width: 15%;">ID</span>
							<span class="span_1" style="width: 32%;">标题</span>
							<span class="span_1">分类</span>
							<span class="span_1">操作</span>
						</div>
						<div class="content_name">
							<li v-for="item in relationList">
								<span class="span_1" style="width: 15%;">{{item.id}}</span>
								<span class="span_1" style="width: 32%;">{{item.title}}</span>
								<span class="span_1">{{item.categoryName}}</span>
								<span class="sky span_1" @click="addRelation(item.id)">
									<span v-if='item.id != contentDetail.id'>添加关联</span>
								</span>
							</li>
						</div>
					</template>
				</div>
			</div>
		</div>
		<!--置顶内容弹窗-->
		<div class="details-box up" v-show="up">
			<div class="title">
				<span style="font-size: 18px;">置顶内容</span>
				<img src="../../../assets/img/close.png" alt="" @click="close" />

			</div>
			<div class="bottom">
				<div class="title-box">
					<div class="left" v-for="(item,i) in buttonData" @click="wholeBox(i,item.categoryId)" :class="{blueWhole:i == index}">{{item.name}}</div>
				</div>
				<!--全部-->
				<div class="list" v-show="whole">
					<div class="head">
						<span style="width: 100px;">置顶顺序</span>
						<span style="width: 70px;">ID</span>
						<span style="width: 200px;">标题</span>
						<span style="width: 200px;">添加时间</span>
						<span style="width: 100px;">置顶天数</span>
						<span style="width: 38px;">操作</span>
					</div>
					<div class="color-list">
						<div class="color-item" v-for="(item,index) in totalList" v-dragging="{ item: item, list: totalList, group: 'totalList' }" :key="index">
							<span style="width: 100px;height: 21px;"><span class="iconfont icon-tool-move hover_c"></span></span>
							<span style="width: 70px;">{{item.id}}</span>
							<span style="width: 200px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{item.title}}</span>
							<span style="width: 200px;">{{item.createDateText}}</span>
							<span style="width: 100px;"><input v-model="item.topDays" style="width: 50px;height: 24px;border: 1px solid rgba(187,187,187,1); margin-right: 5px; text-align: center; border: 1px solid #ccc;" onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" />天</span>
							<span style="width: 38px; color: red;cursor: pointer;" @click="deleteTotal(item.id,index)">删除</span>
						</div>
					</div>
					<div class="btn">
						<el-button style="height: 33px; width: 100%;" @click="addDetail()">+添加内容</el-button>
					</div>
					<div class="sure">
						<el-button type="primary" style="width:100px; height:40px" @click="stick()">确认</el-button>
					</div>
				</div>

			</div>
		</div>

		<!--创建内容弹框-->
		<div class="establish_content" v-show="establish_cont">
			<div class="title_cont">
				<span style="font-size: 18px;">选择内容类型</span>
				<img src="../../../assets/img/close.png" alt="" @click="close" />
			</div>
			<div class="content_look">
				<span class="content_say" @click="sayMouth(1)">
					<img src="static/img/say.png" alt="" />
					<p>说一嘴</p>
				</span>
				<span class="content_say" @click="sayMouth(2)">
					<img src="static/img/wen.png" alt="" />
					<p>问一句</p>
				</span>
				<span class="content_say" @click="show_one()">
					<img src="static/img/show.png" alt="" />
					<p>秀一把</p>
				</span>
			</div>
		</div>
		<!--说一嘴弹框-->
		<div class="mouth_content" v-show="mouth">
			<div class="mouth_box">
				<div class="main_title  top_l">
					主标题：
					<el-input placeholder="请输入ID或者内容标题,最多30个字符" v-model="title_main" style="width: 468px;height: 36px;line-height: 36px;" maxlength="30"></el-input>
				</div>
				<div class="author_box  top_l" v-if='this.options_son.length != 0'>
					<span>
					子账号：
					<template>
					  <el-select v-model="value_son" placeholder="请选择子账号" @change="sonCounts">
					    <el-option
					      v-for="item in options_son"
					      :key="item.value"
					      :label="item.userName"
					      :value="item.userId">
					    </el-option>
					  </el-select>
					</template>
					</span>
				</div>
				<div class="content_x  top_l">
					<span>内&emsp;容:</span>
					<el-input type="textarea" v-model="content_main" placeholder="请输入内容" style="width: 468px;margin-left: 10px;resize:none;" maxlength="200"></el-input>
				</div>
				<div class="img_up">
					<span>图&emsp;片:</span>
					<div style="margin-left: 65px;margin-top: -20px;">
						<div class="load_img" v-for="(item,index) in fileArr" @mouseenter="load_dele(index)" @mouseleave='leave_dele(index)'>
							<img :src="item" style="vertical-align: top;width: 147px;height: 127px;" id="img0" alt="">
							<div class="load_dele_box" v-show="myindex==index" @click="delete_img(index)">
								<img class="load_dele" src="static/img/dele.png" alt="" />
							</div>
						</div>
						<div class="picture  top_l" v-if="this.fileArr.length != 9">
							<div class="file-wrap" style="margin-left: -4%;margin-top: 10px;">
								<div class="file-box">
									<input type="file" accept="image/jpeg,image/jpg,image/png" name="driverphoto" id="file0" class="file-btn" multiple="multiple" @change="loadImg($event)" />
									<img src="static/img/addImg.png" style="display: inline-block;width: 50px;height: 50px;" alt="" />
								</div>
								<p id="p_1" style="font-size: 12px; color: #999;font-weight: bold;">添加图片 </p>
								<p id="p_1" style="font-size: 10px; color: #C3C3C3;">支持jpg/png格式RBG模式</p>
								<p style="font-size: 10px; color: #C3C3C3;">图片大小不超过10M </p>
							</div>
						</div>

					</div>
				</div>
				<div style="margin-top: 50px;margin-left: 25%;">
					<el-button type="primary" @click="getSayContent()">提交</el-button>
					<el-button @click="close">取消</el-button>
				</div>
			</div>
			<!--右边-->
			<div class="mouth_box_right">
				<div class="mouth_right_box">
					<img src="static/img/car.png" alt="" />
					<p>当你与爱车渡过蜜月期后，是不是再也<br />找不到初次相遇那种心动的感觉了？<br />在考虑换车之前，<br />不妨让好开带你找回曾经的美好。<br />别憋着，有什么不爽你就说啊；<br />别扛着，有什么困惑你就问啊；<br />别拘着，有什么本事你就秀啊；<br />你的愿望是什么我不清楚，<br />但我的愿望就是让你的车更好开。</p>
				</div>
			</div>
		</div>
		<!--图片大小不超过10M的弹框-->
		<!--<div class="showDelete" v-show="img_size">
			<div class="deleteTop">添加图片
				<img src="../../../assets/img/close.png" @click="close_one()" />
			</div>
			<div class="deleteBottom" style="padding-bottom: 45px;">
				<img src="../../../../static/img/delete.png" alt="" />
				<p>图片大小不超过10MB</p>
			</div>
			<div class="deleteBotton">
				<el-button type="primary" @click="close_one()">确定</el-button>
			</div>
		</div>-->
		<!--秀一把点击预览弹框-->
		<div class="show_box" v-show="showApp" style="background: #fff !important;">
			<div class="showBox" style="background: #fff;">
				<!--头部-->
				<div class="show_box_header">
					<p>{{showTiele}}</p>
				</div>
				<!--内容-->
				<div class="show_box_content" style="width: 103%;padding-right:13px">
					<div class="show_box_text_box" v-for="item in addTextList">
						<div class="show_box_text" v-if="item.type=='version'">
							<pre style="word-break: break-all;">{{item.text}}</pre>
						</div>
						<div class="show_box_img_box" v-else>
							<img :src="item.img" alt="" />
							<div class="show_box_notes" v-show="item.notes !=''">
								{{item.notes}}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!--遮罩层-->
		<div class="mask" v-show="mask" @click="close"></div>
		<div class="mask" v-show="showMask" @click="closePreview"></div>
		<!--秀一把弹窗-->
		<div class="showBox" v-show="showShow">
			<div class="showContent">
				<div class="showLeft">
					<div class="showLeftBox">
						<!--主标题-->
						<div class="topBox">
							<span>主标题：</span>
							<el-input placeholder="请输入ID或者内容标题，最多30个字符" style="width: 42%;" v-model="showTiele" maxlength="30"></el-input>
						</div>
						<!--子账号-->
						<div class="topBox" v-if='this.options_son.length != 0'>
							<span>子账号：</span>
							<template>
								<el-select v-model="value_son" placeholder="请选择子账号" @change="sonCounts">
									<el-option v-for="item in options_son" :key="item.userId" :label="item.userName" :value="item.userId">
									</el-option>
								</el-select>
							</template>
						</div>
						<!--封面图-->
						<div class="topBox">
							<span style="vertical-align: top;">封面图：</span>
							<div class="imgBox">
								<img src="static/img/addImg.png" />
								<img :src="imgUrl" class="coverImg" v-if="imgUrl">
								<span style="display: block; width: 100%;">
								<span class="add">添加封面图 </span>
								<p>支持jpg／png格式RBG模式， 图片大小不超过10M</p>
								<input type="file" accept="image/jpeg,image/jpg,image/png" @change="getFile1($event,true)" ref="file" class="file coverFile">
								</span>
								<span class="replaceImg" v-if="imgUrl">
								更换封面
								<input type="file" accept="image/jpeg,image/jpg,image/png" @change="getFile1($event,true)" ref="file" class="file coverFile">
							</span>
							</div>
							<div class="addText">
								<div @click="addContent('',true)"><span>T</span>添加文本</div>
								<div>
									<img src="static/img/picture.png" />
									<span style="margin-left: 20px;">添加图片</span>
									<input type="file" accept="image/jpeg,image/jpg,image/png" @change="getFile1($event,false)" ref="file" id="file" class="addTextFile">
								</div>
								<p class="addNote">点击添加相对应的元素模块 </p>
							</div>
						</div>
						<!--调整顺序-->
						<div class="sortBox" v-if="this.addTextList !=''">
							<div class="sortBoxTop">
								<span>调整顺序</span>
								<span>可以让您更快速的给文字、图片进行排序</span>
							</div>
							<div class="sortBoxBottom">
								<div class="bottomBox" v-for="(item,index) in addTextList">
									<img src="static/img/wenben.png" v-if="item.type=='version'" />
									<img :src="item.img" v-if="item.type=='img'" />
									<div class="number">{{index+1}}</div>
								</div>
							</div>
							<div class="sortButton">
								<div class="buttonLeft" @click="preview">点击预览</div>
								<div class="buttonRight" @click="adjustmentOrder">调整顺序</div>
							</div>
						</div>
						<div class="showLeftAdd" v-for="(item,index) in addTextList" v-dragging="{item:item,list: addTextList}" :key="index">
							<!--文本-->
							<div class="showText" v-if="item.type=='version'">
								<div class="showTextTop">
									<img src="static/img/drag1.png" />
									<img src="../../../assets/img/close.png" @click="amputateTextNote(index)" />
									<textarea @blur="text_blur($event)"  @focus="text_focus($event)" v-model="item.text" /></textarea>

								</div>
							</div>
							<!--图片-->
							<div class="showImg" v-if="item.type=='img'">
								<div class="showImgTop">
									<img src="static/img/drag1.png" />
									<img src="../../../assets/img/close.png" @click="amputateTextNote(index)" />
								</div>
								<div class="showImgBottom">
									<div class="imgBottomBox">
										<img :src="item.img" />
									</div>
									<div class="imgBottomNote">
										<textarea @blur="text_blur($event)"  @focus="text_focus($event)" v-model="item.notes" maxlength="50"></textarea>
										<div class="numberWords">
											<span style="color: #F07C00;">{{item.notes.length}}</span>
											<span>/</span>
											<span>50</span>
										</div>
									</div>
								</div>
							</div>
							<div class="showAdd">
								<div class="showTextAdd" @click="add(index)" v-if="addShowOne&&index == i">×</div>
								<div class="showTextAdd" @click="addClose(index)" v-else>＋</div>
								<div class="addText" style="display: inline-block;" v-show="addShowOne&&index == i">
									<div @click="addContent(index,false)"><span>T</span>添加文本</div>
									<div>
										<img src="static/img/img.png" />
										<span style="margin-left: 20px;">添加图片</span>
										<input type="file" accept="image/jpeg,image/jpg,image/png" @change="getFile($event,index)" ref="file" id="file" class="addTextFile">
									</div>
								</div>
							</div>
						</div>
						<div class="showLeftButton">
							<el-button type="primary" @click="showSubmit">提交</el-button>
							<el-button @click="closeAdd">取消</el-button>
						</div>
					</div>
				</div>
				<div class="showRight">
					<img src="static/img/car.png" />
					<p>当你与爱车渡过蜜月期后，是不是再也</br> 找不到初次相遇那种心动的感觉了？</br> 在考虑换车之前，</br> 不妨让好开带你找回曾经的美好。 </br>别憋着，有什么不爽你就说啊；</br> 别扛着，有什么困惑你就问啊；</br> 别拘着，有什么本事你就秀啊； </br>你的愿望是什么我不清楚，</br> 但我的愿望就是让你的车更好开。
					</p>
				</div>
			</div>
		</div>
		<!--调整顺序弹窗-->
		<div class="orderBox" v-show="orderShow">
			<div class="orderContent">
				<div class="orderContentTop">调整顺序
					<el-button type="primary" @click="orderClose" style="float: right; margin-right: 30px; margin-top: 10px; background: #F07C00; border: 1px solid #F07C00;" class="creatText">返回</el-button>
				</div>
				<div class="orderContentBottom">
					<p>拖拽即可调整文字 、照片、视频顺序</p>
					<div class="orderImgBox" v-for="(item,index) in addTextList" v-dragging="{item:item,list: addTextList}" :key="index" @mouseenter="hiddenDetail(index)" @mouseleave="dataDetails(index)">
						<div class="orderTopImg">
							<img src="static/img/wenben.png" alt="" v-show="item.type=='version'" />
							<img :src="item.img" alt="" v-show="item.type == 'img'" />
						</div>
						<div class="orderNumber">{{index+1}}</div>
						<div class="orderClose" @click="amputateTextNote(index)">×</div>
						<div class="coverBoxText warp2" v-if="orderIndex==index">
							<img src="static/img/dialogue.png" />
							<div>
								<div v-if="item.type=='version'"> {{item.text}}</div>
								<div v-else> {{item.notes}}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!--秀一把删除弹窗提示-->
		<div class="showDelete" v-show="showDeleteShow">
			<div class="deleteTop">删除内容
				<img src="../../../assets/img/close.png" @click="closeShowDelete" />
			</div>
			<div class="deleteBottom">
				删除的模块将无法恢复，您真的要删除吗？
			</div>
			<div class="deleteBotton">
				<el-button type="primary" @click="amputateText(index)">确定</el-button>
			</div>
		</div>
		<!--说一嘴图片删除弹窗提示-->
		<div class="showDelete" v-show="sayDeleteShow">
			<div class="deleteTop">删除内容
				<img src="../../../assets/img/close.png" @click="closeShowDelete" />
			</div>
			<div class="deleteBottom">
				删除的图片将无法恢复，您真的要删除吗？
			</div>
			<div class="deleteBotton">
				<el-button type="primary" @click="amputate_pic()">确定</el-button>
			</div>
		</div>
		<!--没关联账号提示-->
		<div class="showDelete" v-show="relationShow">
			<div class="deleteTop">
				<img src="../../../assets/img/close.png" @click="close" />
			</div>
			<div class="deleteBottom">
				您还没有关联前端账号，不能创建内容哦～
			</div>
			<div class="deleteBotton">
				<el-button type="primary" @click="close()">确定</el-button>
			</div>
		</div>
	</div>
</template>

<script>
	import baseUrl from '../common/baseUrl'
	import * as api from '../../../api/api.js';
	export default {
		data() {
			return {
				show_index: -1, //点击删除按钮 删除图片index
				sayDeleteShow: false, //说一嘴删除图片提示弹窗
				img_size: false, //图片大小不超过10M
				fileArr: [], //说一嘴的数组
				jsonsContent: '',
				arrContent: [], //说一嘴数组
				imgFiles: '',
				CategoryId_say: '', //说一嘴id、问一句id
				title_main: '', //说一嘴主标题
				myindex: -1, //鼠标经过的删除按钮的index
				relationShow: false, //没关联账号弹窗
				arrContent: [], //说一嘴数组
				son_count: '', //判断子账号是否存在
				content_main: "", //说一嘴内容
				orderIndex: -1, //鼠标移入和移出的index
				showDeleteShow: false,
				showTiele: "", // 秀一把标题和点击预览标题
				showMask: false, //遮罩层
				orderShow: false, //调整顺序弹窗
				i: -1,
				addTextList: [], //秀一把数组
				imgUrl: '', //封面图片
				showShow: false, //秀一把添加
				addShowOne: false,
				addShow: false,
				showApp: false, //秀一把点击预览
				value_son: '', // 秀一把 子账号绑定内容
				options_son: [], //秀一把 说一嘴子账号数组
				mouth: false, //说一嘴弹框
				establish_cont: false, //创建内容弹框
				rejectList: [], //驳回原因
				reject: '', //强制下架原因
				order: 'desc', //排序
				sort: 'createdate', //排序
				imgList: [], //查看详情问一句，说一嘴图片数组
				releaseTime: '', //查询的发布时间
				index: 0, //全部和秀一把的切换
				detailList: [], //置顶内容的详细列表
				detailName: '',
				totalList: [], // 置顶内容全部列表
				IsAnonymous: '', //是否匿名
				Id: '', //id
				Relation: true, //是否在关联中查询
				Titlea: '', //标题
				Title: '', //内容关联中的查询的标题
				CategoryId: '',
				ContentStatusList: '1,2,3,4,5', //状态字符串
				Autor: '', //作者
				Auditor: '', //审核人
				ContentStatus: '', //状态
				content_fl: '', //分类
				detail_content: '',
				startTime: '', //开始时间
				endTime: '', //结束时间
				AuditType: 'Coercion', //强制下架
				reason: '', //强制下架原因
				identity: '', //身份
				contentDetail: {},
				relation: false, //内容关联弹窗
				detailShow: false, //查看详情
				mask: false, //遮罩层
				amputate: false, //复审弹窗
				up: false, //置顶内容弹窗
				whole: true, //置顶内容选项卡全部
				lower: false, //强制下架弹窗
				PageNum: 1, //当前页数
				PageSize: 20, //当前页条数
				pageTotal: 0, //总页数
				totalSize: 0, //总条数
				buttonData: [{
						name: '全部',
						categoryId: ''
					},
					{
						name: '秀一把',
						categoryId: ''
					}
				],
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
				statusList: [{
						value: '',
						label: '全部'
					}, {
						value: '1',
						label: '已通过'
					},
					{
						value: '3',
						label: '已驳回'
					},
					{
						value: '4',
						label: '用户删除'
					},
					{
						value: '5',
						label: '强制下架'
					},
					{
						value: '2',
						label: '用户下架'
					}
				],
				value2: ['', ''], //时间
				tableData: [], //内容列表
				relationList: [], //查询内容关联
				contentRelaList: [], //关联内容
				funcId: "", //按钮权限的functionId
				glContent: '', //关联内容按钮
				lookView: '', //查看信息按钮
				zdContent: '', //置顶内容权限
				coerceContent: '', //强制下架权限
				createContent: '', //创建内容按钮
				sonList: [{
					value: '选项1',
					label: '黄金糕'
				}, {
					value: '选项2',
					label: '双皮奶'
				}, {
					value: '选项3',
					label: '蚵仔煎'
				}, {
					value: '选项4',
					label: '龙须面'
				}, {
					value: '选项5',
					label: '北京烤鸭'
				}],
				showIndex: -1, //删除文本根据的索引
				objContent: {}, //秀一把对象

			}
		},
		created() {
			this.getContent(); //获取内容列表
			this.getFuncId();
		},
		computed: {},
		mounted() {
			this.$dragging.$on('dragged', ({
				value
			}) => {
				this.addTextList = value.list;
			})
			this.checkDivScroolTop();

			//			this.$nextTick(function() {
			//				$('.text_content').height($('.article_div').height())
			//				console.log($('.article_div').height())
			//			})
		},
		methods: {

			//div滚动事件
			checkDivScroolTop() {
				//获取节点
				var scrollDiv = document.getElementsByClassName('showLeft')[0];
				//绑定事件
				scrollDiv.addEventListener('scroll', function() {
					if(scrollDiv.scrollTop >= "500") {
						$(".sortBox").addClass("fixedClass")
					} else {
						$(".sortBox").removeClass("fixedClass")
					}

				});
			},

			//秀一把提交
			showSubmit() {
				if(!this.showTiele) {
					this.$layer.msg("请输入标题");
					return false;
				};
				//				if(this.options_son.length != "0") {
				//					if(!this.value_son) {
				//						this.$layer.msg("请选择子账号");
				//						return false;
				//					}
				//				};
				if(!this.imgUrl) {
					this.$layer.msg("选择封面图");
					return false;
				}
				if(this.addTextList.length == 0) {
					this.$layer.msg("请添加文本");
					return false;
				} else {
					if(this.addTextList[0].text.length == 0) {
						this.$layer.msg("请填写文本内容");
						return false;
					}
				}
				var params = new URLSearchParams();
				params.append('CategoryId', '9f50baa8-84f3-11e8-97b3-00163e06561e');
				params.append('Title', this.showTiele);
				if(this.value_son) {
					if(this.value_son == "00000000-0000-0000-0000-000000000000") {
						params.append('AuthorId', this.value_son);
						params.append('IsMain', false);
					} else {
						params.append('AuthorId', this.value_son);
						params.append('IsMain', false);
					}
				} else {
					params.append('IsMain', true);
					params.append('AuthorId', "00000000-0000-0000-0000-000000000000");
				}
				params.append('AppContent', JSON.stringify(this.addTextList));
				params.append("ImageUrl", this.imgUrl);
				this.$axios({
					method: 'POST',
					url: baseUrl + '/api/mgr/Content/MgrCreateContent',
					data: params
				}).then(res => {
					if(res.data.success) {
						this.$layer.msg(res.data.msg);
						this.addTextList = [];
						this.closeAdd();
						this.showShow = false;
						this.search();
					} else {
						this.$layer.msg(res.data.msg);
					}

				})
			},
			//鼠标移入和移出的两个事件
			dataDetails(index) {
				this.orderIndex = -1;
			},
			hiddenDetail(index) {
				this.orderIndex = index;
			},
			//关闭删除提示弹窗
			closeShowDelete() {
				this.showDeleteShow = false;
				this.mask = false;
			},
			//关闭预览
			closePreview() {
				this.showMask = false;
				this.showApp = false;
			},
			//关闭调整顺序弹窗
			orderClose() {
				this.orderShow = false;
			},
			//调整顺序弹窗
			adjustmentOrder() {
				this.orderShow = true;
			},
			//删除文本二次确认提示
			amputateTextNote(index) {
				this.showIndex = index;
				this.showDeleteShow = true;
				this.mask = true;
			},
			//删除文本
			amputateText(index) {
				this.addTextList.splice(this.showIndex, 1);
				this.closeShowDelete()
			},
			//添加文本
			addContent(index, boolean) {
				this.objContent = {
					type: "version",
					text: "",
					notes: "",
					img: ""

				}
				if(boolean) {
					this.addTextList.push(this.objContent)
				} else {
					this.addTextList.splice(index + 1, 0, this.objContent)
				}
			},
			//秀一把固定位置上传图片
			getFile(event, index) {
				console.log(index)
				this.objContent = {
					type: "img",
					text: "",
					img: "",
					notes: ""

				}
				var file = event.target.files[0];
				var fileSize = file.size; //文件大小

				//获取图片大小，注意使用this，而不是$(this)
				var size = fileSize / 1024;
				if(size > 10240) {
					this.$layer.msg('图片大小不能超过10M');
					return false;
				}
				//图片文件
				this.imgFiles = file;
				var formData = new FormData();
				formData.append("file", this.imgFiles);
				this.$axios({
					method: 'POST',
					url: baseUrl + '/api/mgr/Client/UploadToOss',
					data: formData
				}).then(res => {
					if(res.data.success) {
						$("#file").val('');
						this.objContent.img = res.data.data.fileOssPath;
						this.addTextList.splice(index + 1, 0, this.objContent);
					} else {
						this.$layer.msg(res.data.msg)
					}
				})
			},
			//秀一把上传封面图 和默认添加图片
			getFile1(event, boolean) {
				console.log("132456789")
				this.objContent = {
					type: "img",
					text: "",
					img: "",
					notes: ""

				}
				var file = event.target.files[0];
				var fileSize = file.size; //文件大小

				//获取图片大小，注意使用this，而不是$(this)
				var size = fileSize / 1024;
				if(size > 10240) {
					this.$layer.msg('图片大小不能超过10M');
					return false;
				}
				//图片文件
				this.imgFiles = file;
				var formData = new FormData();
				formData.append("file", this.imgFiles);
				this.$axios({
					method: 'POST',
					url: baseUrl + '/api/mgr/Client/UploadToOss',
					data: formData
				}).then(res => {
					if(res.data.success) {
						$(".coverFile").val('');
						$("#file").val('');
						if(boolean) {
							this.imgUrl = res.data.data.fileOssPath;
						} else {

							this.objContent.img = res.data.data.fileOssPath;
							this.addTextList.push(this.objContent);
						}

					} else {
						this.$layer.msg(res.data.msg)
					}
				})
			},
			//点击关闭创建内容秀一把弹窗
			closeAdd() {
				this.showShow = false;
				this.showTiele = "";
				this.addShowOne = false;
			},
			//点击预览弹窗
			preview() {
				this.showApp = true;
				this.showMask = true;
			},
			//点击显示添加文本或者添加图片
			add(index) {
				this.i = index;
				this.addShow = false;
				this.addShowOne = false;
			},
			addClose(index) {
				this.i = index;
				this.addShow = true;
				this.addShowOne = true;
			},
			//秀一把弹窗
			show_one() {
				this.getSonCount();
				this.addTextList = [];
				this.imgUrl = "";
				this.value_son = ''
				this.showShow = true;
				this.establish_cont = false;
				this.mask = false;
			},
			//获取按钮权限
			getFuncId() {
				if(this.funcId) {
					this.funcId = localStorage.getItem('functionId');
				} else {
					this.funcId = sessionStorage.getItem('functionid');
				}
				this.$axios({
					method: 'GET',
					url: baseUrl + '/api/mgr/Role_Dept/QueryFunction',
					params: {
						functionId: this.funcId
					}
				}).then(res => {
					//					console.log(res.data.data)
					this.lookView = res.data.data[0] //查看信息按钮
					this.glContent = res.data.data[1] //关联内容按钮
					this.zdContent = res.data.data[2] //置顶内容按钮
					this.coerceContent = res.data.data[3] //强制下架按钮
					this.createContent = res.data.data[4] //创建内容按钮
				})
			},
			//获取内容列表
			getContent() {
				var params = new URLSearchParams();
				params.append('PageNum', this.PageNum);
				params.append('PageSize', this.PageSize);
				params.append('ID', this.Id);
				params.append('Title', this.Titlea);
				params.append('CategoryId', this.CategoryId);
				params.append('ContentStatus', this.ContentStatus);
				params.append('Autor', this.Autor);
				params.append('IsAnonymous', this.IsAnonymous);
				params.append('Auditor', this.Auditor);
				params.append('StartTime', this.startTime);
				params.append('EndTime', this.endTime);
				params.append('Sort', this.sort);
				params.append('Order', this.order);
				params.append('ContentStatusList', this.ContentStatusList);
				this.$axios({
					method: 'POST',
					url: baseUrl + '/api/mgr/Content/MgrContentList',
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
				this.getContent();
			},

			//查询
			search() {
				this.PageNum = 1;
				var params = new URLSearchParams();
				params.append('PageSize', this.PageSize);
				params.append('ID', this.Id);
				params.append('Title', this.Titlea);
				params.append('CategoryId', this.CategoryId);
				params.append('ContentStatus', this.ContentStatus);
				params.append('Autor', this.Autor);
				params.append('IsAnonymous', this.IsAnonymous);
				params.append('Auditor', this.Auditor);
				params.append('StartTime', this.startTime);
				params.append('EndTime', this.endTime);
				params.append('Sort', this.sort);
				params.append('Order', this.order);
				params.append('ContentStatusList', this.ContentStatusList);
				this.$axios({
					method: 'POST',
					url: baseUrl + '/api/mgr/Content/MgrContentList',
					data: params
				}).then(res => {
					this.tableData = res.data.rows
					this.pageTotal = res.data.pageTotal
					this.totalSize = res.data.totalSize
				}).catch(error => {
					console.log(error)
				})
			},
			//查询时间
			referTime(time) {
				this.startTime = time[0];
				this.endTime = time[1];
			},
			//身份查询
			identityCount(value) {
				this.IsAnonymous = Boolean(this.IsAnonymous)
				this.IsAnonymous = value;

				console.log(this.IsAnonymous)
			},
			//身份列表
			formatter(row, column) {
				if(row.isAnonymous == false) {
					return "实名"
				} else {
					return "匿名"
				}
			},
			//分类选择
			typeCount(value) {
				this.CategoryId = value;
			},
			//状态选择
			statusCount(value) {
				this.ContentStatus = value
			},
			//重置
			reset() {
				this.page(1)
				this.PageNum = 1;
				this.IsAnonymous = "";
				this.Titlea = "";
				this.CategoryId = "";
				this.Autor = "";
				this.Auditor = "";
				this.startTime = "";
				this.endTime = "";
				this.releaseTime = "";
				this.ContentStatus = "";
				this.content_fl = "";
				var params = new URLSearchParams();
				params.append('Sort', this.sort);
				params.append('Order', this.order);
				params.append('PageNum', this.PageNum);
				params.append('PageSize', this.PageSize);
				params.append('ContentStatusList', this.ContentStatusList);
				this.$axios({
					method: 'POST',
					url: baseUrl + '/api/mgr/Content/MgrContentList',
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

			//点击浏览器按钮返回
			houtui() {
				var that = this;
				$(document).ready(function(e) {
					var counter = 0;
					if(window.history && window.history.pushState) {
						$(window).on('popstate', function(e) {
							that.closeDetail();
							that.close();
						});
					}
					window.history.pushState('forward', '#'); //在IE中必须得有这两行
					window.history.forward(1);
				});
			},

			//查看详情
			lookBox(index, row) {
				this.houtui();
				//				console.log(row)
				this.$axios({
					method: 'GET',
					url: baseUrl + '/api/mgr/Content/CheckContent',
					params: {
						id: row.id
					}
				}).then(res => {
					if(res.data.success) {
						this.$axios({
							method: 'GET',
							url: baseUrl + '/api/mgr/Content/MgrContentDetail',
							params: {
								id: row.id
							}
						}).then(res => {
							if(res.data.success) {
								this.detailShow = !this.detailShow;
								this.contentDetail = row;
								this.imgList = res.data.data.imageList
								this.reject = res.data.data.coercionReason //显示强制下架原因
								this.rejectList = res.data.data.rejectReasonList; // 显示驳回原因
								this.detail_content = JSON.parse(res.data.data.appContent);
								console.log(res.data.data.appContent)
							} else {
								this.open(res.data.msg)
							}
						}).catch(err => {
							console.log(err)
						})
					} else {
						this.open(res.data.msg)
					}
				}).catch(err => {
					console.log(err)
				})

			},

			//关闭弹框
			closeDetail() {
				this.detailShow = false;
				this.lower = false;
				//				this.reset();
			},
			//打开强制下架弹窗
			down() {
				//				this.reset();
				this.lower = true;
				this.mask = true;
				this.reason = "";
			},
			//打开复审弹窗
			dxamination() {
				this.amputate = true
				this.mask = true
			},
			//打开内容关联弹窗
			relationBox() {
				//				this.reset();
				this.mask = true;
				this.relation = true;
				this.contentRelation(this.contentDetail.id);

			},
			//查询内容关联
			search_detail() {
				var params = new URLSearchParams();
				params.append('ID', this.Id);
				params.append('Title', this.Title);
				params.append('CategoryId', this.CategoryId);
				params.append('ContentStatusList', this.ContentStatusList);
				params.append('Relation', this.Relation);
				this.$axios({
					method: 'POST',
					url: baseUrl + '/api/mgr/Content/MgrContentList',
					data: params
				}).then(res => {
					//					console.log(res)
					if(this.Title == '') {
						this.relationList = [];
					} else {
						this.relationList = res.data.rows
					}
				}).catch(error => {
					console.log(error)
				})

			},
			//重置内容关联
			resetRelation() {
				this.Title = "";
				this.relationList = "";
			},
			//添加内容关联
			addRelation(id) {
				var params = new URLSearchParams();
				params.append('id', this.contentDetail.id);
				params.append('relationId', id);
				this.$axios({
					method: 'POST',
					url: baseUrl + '/api/mgr/Content/RelationContent',
					data: params
				}).then(res => {
					if(res.data.success) {
						this.$layer.msg(res.data.msg)
						this.contentRelation(this.contentDetail.id)
					} else {
						this.$layer.msg(res.data.msg)
					}
				})
			},
			//关联的内容
			contentRelation(num) {
				var params = new URLSearchParams();
				params.append('id', num);
				this.$axios({
					method: 'GET',
					url: baseUrl + '/api/mgr/Content/SeleRelation',
					params: {
						id: num
					}
				}).then(res => {
					console.log(res)
					this.contentRelaList = res.data.data;
				})
			},
			//解除关联
			relieve(id, relationId) {
				var params = new URLSearchParams();
				params.append('id', id);
				params.append('relationId', relationId);
				this.$axios({
					method: 'POST',
					url: baseUrl + '/api/mgr/Content/RelationDelete',
					data: params
				}).then(res => {
					if(res.data.success) {
						this.$layer.msg(res.data.msg)
						this.contentRelation(this.contentDetail.id)
					} else {
						this.$layer.msg(res.data.msg)
					}
				})
			},
			//打开置顶内容弹窗
			upBox(id) {
				this.mask = true;
				this.up = true;
				this.totalOpen();
				this.buttonData[1].name = this.contentDetail.categoryName
				this.buttonData[1].categoryId = id
			},
			//置顶内容（全部）
			totalOpen(categoryId) {
				this.$axios({
					method: 'GET',
					url: baseUrl + '/api/mgr/Content/TopList',
					params: {
						categoryId: categoryId
					}
				}).then(res => {
					this.totalList = res.data.data
				})
			},
			//获取当前时间
			getDatetime() {
				var dt = new Date();
				return(dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate() + " " + dt.getHours() + ":" + dt.getMinutes()).replace(/([\-\:])(\d{1})(?!\d)/g, "$10$2");
			},
			//添加置顶内容
			addDetail() {
				var obj = {};
				obj.title = this.contentDetail.title;
				obj.id = this.contentDetail.id;
				obj.createDateText = this.getDatetime();
				obj.topDays = 1;
				var cateId = ''
				if(this.index == 0) {
					cateId = ''
				} else {
					cateId = this.contentDetail.categoryId
				}
				this.$axios({
					method: 'GET',
					url: baseUrl + '/api/mgr/Content/TopVerification',
					params: {
						id: this.contentDetail.id,
						categoryId: cateId
					}
				}).then(res => {
					console.log(res.data)
					if(res.data.success) {
						if(this.totalList.length <= 2) {
							this.totalList.push(obj)
						} else {
							this.$layer.msg('最多可以添加3条')
						}
					} else {
						this.$layer.msg(res.data.msg)
					}
				})

			},
			//确认添加置顶内容
			stick() {
				var params = new URLSearchParams();

				params.append('TopJson', JSON.stringify(this.totalList));
				if(this.index == 0) {
					params.append('CategoryId', '');
				} else {
					params.append('CategoryId', this.contentDetail.categoryId);
				}

				this.$axios({
					method: 'POST',
					url: baseUrl + '/api/mgr/Content/AddContentTop',
					data: params
				}).then(res => {
					console.log(res)
					if(res.data.success) {
						this.$layer.msg(res.data.msg)
						this.up = false
						this.mask = false
					} else {
						this.$layer.msg(res.data.msg)
					}

				})
			},
			//删除置顶内容
			deleteTotal(id, index) {
				var catId = ''
				if(this.index == 0) {
					catId = ''
				} else {
					catId = this.contentDetail.categoryId
				}
				this.$axios({
					method: 'GET',
					url: baseUrl + '/api/mgr/Content/DeleteContentRelation',
					params: {
						id: id,
						categoryId: catId
					}
				}).then(res => {
					this.$layer.msg(res.data.msg)
					if(res.data.success) {
						this.totalList.splice(index, 1)
					}
				})
			},
			//关闭弹窗
			close() {
				this.mouth = false;
				this.amputate = false;
				this.mask = false
				this.relation = false
				this.up = false;
				this.lower = false;
				this.Title = "";
				this.relationList = "";
				this.index = 0;
				this.establish_cont = false;
				this.showDeleteShow = false;
				this.img_size = false;
				this.relationShow = false;
				this.sayDeleteShow = false;

			},

			//驳回确定
			determine(index) {
				//				this.reset();
				//强制下架
				if(index == 1) {
					if($('.textarea').val() != "") {
						var params = new URLSearchParams();
						params.append('RelationId', this.contentDetail.id);
						params.append('AuditType', this.AuditType);
						params.append('Remark', this.reason);
						this.$axios({
							method: 'POST',
							url: baseUrl + '/api/mgr/Content/ContentCoercion',
							data: params
						}).then(res => {
							console.log(res)
							this.$layer.msg(res.data.msg)
							this.lower = false;
							this.mask = false;
							this.detailShow = false;
							this.search();
						})
					} else {
						this.$layer.msg('请输入下架原因')
					}

				}
			},
			//创建内容弹框
			establish() {
				var url = api.CheckUser
				this.$axios({
					method: 'get',
					url: url
				}).then(res => {
					if(res.data.success) {
						this.establish_cont = true;
						this.mask = true;
						this.title_main = "";
						this.value_son = "";
						this.content_main = "";
						this.fileArr = [];
					} else {
						this.relationShow = true;
						this.mask = true;
					}
				})
			},
			//说一嘴弹框/秀一把弹框
			sayMouth(index) {
				if(index == 1) {
					this.mask = false;
					this.establish_cont = false;
					this.mouth = !this.mouth;
					this.getSonCount();
					this.CategoryId_say = '9f50ba92-84f3-11e8-97b3-00163e06561e'
				} else {
					this.mask = false;
					this.establish_cont = false;
					this.mouth = !this.mouth;
					this.getSonCount();
					this.CategoryId_say = '9f50baa0-84f3-11e8-97b3-00163e06561e'
				}

			},
			//上传图片验证
			loadImg(event) {
				var file = event.target.files[0];
				//图片文件
				this.imgFiles = file;
				var fileSize = file.size; //文件大小

				//获取图片大小，注意使用this，而不是$(this)
				var size = fileSize / 1024;
				if(size > 10240) {
					this.$layer.msg('图片大小不能超过10M');
					return false;
				}

				var formData = new FormData();
				formData.append("file", this.imgFiles);
				this.$axios({
					method: 'POST',
					url: baseUrl + '/api/mgr/Client/UploadToOss',
					data: formData
				}).then(res => {
					if(res.data.success) {
						this.fileArr.push(res.data.data.fileOssPath);
						$('#file0').val('');
					} else {
						this.$layer.msg(res.data.msg)
					}

				})

			},
			//鼠标经过删除按钮出现
			load_dele(index) {
				this.myindex = index;
			},
			leave_dele(index) {
				this.myindex = index;
				this.myindex = 20;
			},
			//点击删除按钮，删除图片
			delete_img(index) {
				this.myindex = index;
				this.fileArr.splice(this.myindex, 1);
			},
			//说一嘴内容弹框接口
			getSayContent() {
				if(!this.title_main) {
					this.$layer.msg("请输入标题");
					return false;
				};
				this.arrContent = [];
				this.jsonsContent = '';
				var obj = {
					text: this.content_main,
					img: '',
					notes: ''
				}
				this.arrContent.push(obj);
				this.jsonsContent = JSON.stringify(this.arrContent);

				var params = new URLSearchParams();
				params.append('CategoryId', this.CategoryId_say);
				params.append('Title', this.title_main);
				params.append('AppContent', this.jsonsContent);
				params.append('ImageUrls', this.fileArr);

				//判断子账号是否存在
				if(this.value_son) {
					if(this.value_son == '00000000-0000-0000-0000-000000000000') {
						params.append('AuthorId', '00000000-0000-0000-0000-000000000000');
						params.append('IsMain', false);
					} else {
						params.append('AuthorId', this.value_son);
						params.append('IsMain', false);
					}
				} else {
					params.append('AuthorId', '00000000-0000-0000-0000-000000000000');
					params.append('IsMain', true);
				}
				this.$axios({
					method: 'POST',
					url: baseUrl + '/api/mgr/Content/MgrCreateContent',
					data: params
				}).then(res => {
					console.log(res.data.data)
					if(res.data.success) {
						this.$layer.msg(res.data.msg);
						this.mouth = false;
					} else {
						this.$layer.msg(res.data.msg)
					}
				})
			},
			//说一嘴子账号
			getSonCount() {
				this.$axios({
					method: 'GET',
					url: baseUrl + '/api/mgr/Role_Dept/GetClientList'
				}).then(res => {
					if(res.data.success) {
						if(res.data.data) {
							this.options_son = res.data.data;
						}
					}
				})
			},
			//说一嘴账号
			sonCounts(value) {
				this.value_son = value;
			},
			//textarea获得焦点
			text_focus($event){
				$('.showLeftAdd').attr('draggable','false');
			},
			//textarea失去焦点
			text_blur($event){
				$('.showLeftAdd').attr('draggable','true');
			},
			//选项卡 全部
			wholeBox(i, id) {
				this.index = i;
				this.totalOpen(id)

			}
		}
	}
</script>

<style scoped>
	/*秀一把删除弹窗提示*/
	
	.showDelete {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: #fff;
		width: 600px;
		height: 376px;
		z-index: 20;
		border-radius: 5px;
	}
	
	.showDelete .deleteTop {
		width: 100%;
		height: 50px;
		line-height: 50px;
		padding-left: 30px;
		background: #F5F5F5;
		font-size: 18px;
		color: #333;
	}
	
	.deleteTop img {
		float: right;
		margin-right: 14px;
		margin-top: 15px;
		cursor: pointer;
	}
	
	.showDelete .deleteBottom {
		text-align: center;
		padding-bottom: 110px;
		padding-top: 107px;
		color: #333;
		font-size: 24px;
	}
	
	.showDelete .deleteBotton {
		text-align: center;
	}
	/*调整顺序弹窗*/
	
	.orderBox {
		position: absolute;
		top: 0;
		left: 0;
		width: 70%;
		height: 100%;
		z-index: 13;
		background: rgba(244, 244, 244, 1);
		padding: 20px;
	}
	
	.orderBox .orderContent {
		width: 100%;
		height: 100%;
		background: #fff;
		border-radius: 5px;
		display: flex;
		flex-direction: column;
		overflow: auto;
	}
	
	.orderContent .orderContentTop {
		height: 60px;
		width: 100%;
		line-height: 60px;
		padding-left: 31px;
		border-bottom: 1px solid #F5F5F5;
		font-size: 18px;
		color: #F07C00;
	}
	
	.orderContent .orderContentBottom {
		width: 100%;
		padding-left: 31px;
		padding-top: 20px;
		overflow: auto;
		padding-bottom: 30px;
	}
	
	.orderContentBottom p {
		font-size: 16px;
		color: #333;
		margin-bottom: 56px;
	}
	
	.orderContentBottom .orderImgBox {
		position: relative;
		width: 124px;
		height: 82px;
		margin-right: 45px;
		display: inline-block;
		margin-bottom: 30px;
	}
	
	.orderImgBox .orderTopImg {
		width: 124px;
		height: 82px;
		overflow: hidden;
		position: relative;
	}
	
	.orderTopImg img {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	
	.orderImgBox .orderNumber {
		position: absolute;
		left: 0;
		bottom: 0;
		background: #F07C00;
		color: #fff;
		width: 17px;
		height: 13px;
		line-height: 13px;
		text-align: center;
		font-size: 12px;
	}
	
	.orderImgBox .orderClose {
		position: absolute;
		top: -5px;
		right: -5px;
		width: 15px;
		height: 15px;
		border-radius: 50%;
		background: #F07C00;
		color: #fff;
		text-align: center;
		line-height: 15px;
		cursor: pointer;
	}
	
	.orderImgBox .coverBoxText {
		position: absolute;
		bottom: -60px;
		left: 20px;
		width: 150px;
		height: 59px;
		background: #fff;
		padding: 14px;
		z-index: 20;
	}
	
	.warp2 {
		word-wrap: break-word;
		overflow: hidden;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		-ms-text-overflow: ellipsis;
		text-overflow: ellipsis;
	}
	
	.coverBoxText img {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
	
	.orderContentBottom .orderButton {
		margin-top: 92px;
		margin-left: 279px;
	}
	/*秀一把弹窗*/
	
	.showBox {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 11;
		padding: 20px;
		background: rgba(244, 244, 244, 1);
		overflow: auto;
	}
	
	.showContent {
		width: 100%;
		height: 100%;
		border-radius: 5px;
		position: relative;
	}
	
	.showContent .showLeft {
		padding-left: 3%;
		position: absolute;
		top: 0;
		left: 0;
		width: 70%;
		height: 100%;
		background: #fff;
		border-radius: 5px;
		overflow: auto;
	}
	
	.showLeft .showLeftBox {
		/*position: relative;*/
		width: 100%;
		min-width: 720px;
	}
	
	.showLeft .showLeftTop {
		position: relative;
		width: 100%;
	}
	
	.topBox {
		margin: 30px 0;
	}
	
	.topBox:first-child {
		margin-top: 51px;
	}
	
	.topBox span {
		display: inline-block;
		width: 60px;
	}
	
	.imgBox {
		display: inline-block;
		width: 36.6%;
		border-radius: 5px;
		border: 1px solid #BBBBBB;
		text-align: center;
		padding: 5% 0;
		color: #999999;
		font-size: 17px;
		position: relative;
		overflow: hidden;
	}
	
	.imgBox img:first-child {
		width: 107px;
		height: 107px;
		display: block;
		margin: 0 auto;
	}
	
	.coverImg {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		overflow: hidden;
		width: 100%;
		height: 100%;
		object-fit: cover;
		z-index: 10;
	}
	
	.imgBox .add {
		width: 100px;
		margin-top: 21px;
	}
	
	.imgBox p {
		width: 157px;
		font-size: 12px;
		margin: 0 auto;
		margin-top: 6px;
	}
	
	.imgBox .file {
		display: inline-block;
		position: absolute;
		width: 107px;
		height: 107px;
		left: 50%;
		top: 33%;
		transform: translate(-50%, -50%);
		opacity: 0;
	}
	
	.imgBox .replaceImg {
		display: block;
		position: absolute;
		bottom: 10px;
		right: 10px;
		width: 70px;
		height: 30px;
		text-align: center;
		line-height: 30px;
		background: #F07C00;
		color: #fff;
		font-size: 14px;
		z-index: 11;
	}
	
	.replaceImg input {
		position: absolute !important;
		top: 15 !important;
		left: 35 !important;
		width: 100% !important;
		height: 100% !important;
	}
	
	.topBox .addText {
		padding-left: 63px;
		margin: 30px 0;
		font-size: 12px;
		position: relative;
	}
	
	.addText div {
		border: 1px solid #F07C00;
		width: 100px;
		height: 36px;
		text-align: center;
		line-height: 36px;
		font-family: Garamond;
		color: #F07C00;
		display: inline-block;
		cursor: pointer;
		position: relative;
		top: 10px;
		overflow: hidden;
	}
	
	.addText div:nth-child(2) {
		border: 1px solid #bbb;
		color: #999;
		position: relative;
		margin-left: 20px;
	}
	
	.addText div:nth-child(2) img {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		width: 17px;
		height: 13px;
	}
	
	.addText span {
		display: inline;
		margin: 0 5px;
	}
	
	.addText .addNote {
		position: absolute;
		top: 17px;
		font-size: 12px;
		color: #999;
		display: inline-block;
		margin-left: 19px;
	}
	
	.addText .addTextFile {
		position: absolute;
		top: 0;
		left: 0;
		width: 100px;
		height: 30px;
		opacity: 0;
	}
	/*调整顺序*/
	
	.sortBox {
		position: absolute;
		right: 2%;
		width: 245px;
		height: 420px;
		border: 1px solid #DEDEDE;
		padding: 10px;
	}
	
	.sortBox .sortBoxTop {
		font-size: 14px;
		color: #666;
		border-bottom: 1px solid #EDEDED;
		padding-bottom: 14px;
	}
	
	.sortBoxTop span {
		display: block;
	}
	
	.sortBoxTop span:last-child {
		font-size: 12px;
		width: 188px;
		color: #999999;
		margin-top: 13px;
	}
	
	.sortBox .sortBoxBottom {
		width: 103%;
		margin-top: 16px;
		height: 270px;
		overflow: auto;
	}
	
	.sortBoxBottom .bottomBox {
		width: 100px;
		height: 67px;
		position: relative;
		display: inline-block;
		margin-bottom: 10px;
	}
	
	.sortBoxBottom .bottomBox:nth-child(2n+1) {
		margin-right: 6px;
	}
	
	.bottomBox img {
		width: 100%;
		height: 100%;
	}
	
	.bottomBox .number {
		width: 17px;
		height: 13px;
		text-align: center;
		line-height: 13px;
		background: #F07C00;
		position: absolute;
		bottom: 0;
		left: 0;
		color: #fff;
		font-size: 12px;
	}
	
	.sortBox .sortButton {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 34px;
		border-top: 1px solid #dedede;
		line-height: 34px;
		text-align: center;
	}
	
	.sortButton .buttonLeft,
	.sortButton .buttonRight {
		background: #F07C00;
		color: #fff;
		font-size: 14px;
		width: 50%;
		height: 100%;
		float: left;
		border-right: 1px solid #DEDEDE;
		cursor: pointer;
	}
	
	.sortButton .buttonRight {
		background: #fff;
		color: #666;
		border: none;
	}
	
	.showLeftAdd {
		margin: 10px 0;
		margin-left: 60px;
	}
	
	.showLeftAdd .showText {
		width: 53%;
		height: 183px;
		border: 1px solid #dedede;
		position: relative;
		background: #fff;
	}
	
	.showLeftAdd .showAdd {
		height: 50px;
	}
	
	.showLeftAdd .showText .showTextTop {
		height: 30px;
		line-height: 30px;
		background: #F5F5F5;
		padding: 0 10px;
	}
	
	.showLeftAdd .showTextTop img:nth-child(2) {
		float: right;
		margin-top: 5px;
		cursor: pointer;
	}
	
	.showLeftAdd .showTextTop textarea {
		display: block;
		border: none;
		width: 100%;
		height: 140px;
		resize: none;
		outline: none;
		font-size: 14px;
		line-height: 24px;
	}
	
	.numberWords {
		position: absolute;
		bottom: 5px;
		right: 5px;
	}
	
	.showLeftAdd .showTextAdd {
		width: 24px;
		height: 24px;
		text-align: center;
		line-height: 24px;
		background: #F5F5F5;
		color: #F07C00;
		margin-top: 15px;
		font-size: 20px;
		display: inline-block;
		margin-right: 20px;
		cursor: pointer;
	}
	
	.showLeftAdd .showImg {
		width: 53%;
		height: 468px;
		border: 1px solid #DEDEDE;
		background: #fff;
		position: relative;
	}
	
	.showImg .showImgTop {
		width: 100%;
		height: 30px;
		line-height: 30px;
		background: #F5F5F5;
		padding: 0 10px;
	}
	
	.showImgTop img:last-child {
		float: right;
		margin-top: 5px;
		cursor: pointer;
	}
	
	.showImg .showImgBottom {
		height: 438px;
		width: 100%;
		padding: 10px 5%;
		padding-bottom: 22px;
	}
	
	.showImgBottom .imgBottomBox {
		position: relative;
		width: 100%;
		height: 330px;
		overflow: hidden;
	}
	
	.imgBottomBox img {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	
	.showImgBottom .imgBottomNote {
		position: relative;
		bottom: 5px;
		right: 5px;
		width: 100%;
		height: 60px;
		border: 1px solid #DEDEDE;
		margin-top: 10px;
		padding: 5px;
		margin-left: 4px;
	}
	
	.imgBottomNote textarea {
		display: inline-block;
		width: 100%;
		height: 100%;
		border: none;
		outline: none;
		resize: none;
		font-size: 14px;
		color: #999;
	}
	
	.showLeft .showLeftButton {
		margin-top: 30px;
		width: 100%;
		padding-left: 279px;
		padding-bottom: 2%;
	}
	
	.showContent .showRight {
		padding-top: 8%;
		position: absolute;
		right: 0;
		top: 0;
		width: 28%;
		height: 100%;
		background: #fff;
		border-radius: 5px;
		text-align: center;
	}
	
	.showRight p {
		width: 52.5%;
		margin: 0 auto;
		color: #999999;
		font-size: 14px;
		text-align: left;
		margin-top: 15%;
	}
	
	.showRight img {
		width: 63.5%;
		height: auto;
	}
	
	.hover_c:hover {
		color: #388BFF;
	}
	
	.handle-box {
		margin-bottom: 20px;
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
		white-space: nowrap;
		margin: 10px 0;
		width: 295px;
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
		background: #fff;
		width: 100%;
		height: 100%;
		display: flex;
		flex: 1;
		flex-direction: column;
		overflow: hidden;
	}
	
	.content-details {
		width: 100%;
		height: 100%;
		padding: 10px;
		z-index: 12;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		overflow: auto;
		display: flex;
		flex-direction: column;
	}
	
	.top_header {
		width: 100%;
		height: 190px;
	}
	
	.top_one {
		width: 100%;
		height: 50px;
		line-height: 50px;
		padding-left: 19px;
		background-color: #E7E9EB;
		color: #333;
	}
	
	.top {
		width: 100%;
		height: 140px;
		padding: 20px 15px;
		margin-bottom: 20px;
		background: rgba(244, 244, 244);
		position: relative;
		background-color: #fff;
		white-space: nowrap;
	}
	
	.blue {
		color: #388BFF;
		cursor: pointer;
	}
	
	.top_span {
		display: inline-block;
		text-align: left;
		width: 200px;
		/*padding-right: 100px;*/
	}
	
	.top_span:first-child {
		width: 490px;
	}
	
	.top .content-text {
		float: left;
		width: 85%;
		line-height: 50px;
	}
	
	.top .btn {
		float: right;
		padding-top: 10px;
	}
	
	.top .content-text span .tit {
		display: inline-block;
		width: 255px;
		vertical-align: top;
		margin-left: 9px;
		font-size: 11px;
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
		width: 344px;
		/*height: 192px;*/
		vertical-align: top;
	}
	
	.middle img:first-child {
		/*margin-left: 16px;*/
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
		/*width: 4%;*/
		width: 50px;
		float: left;
		color: rgba(51, 51, 51, 1);
		font-size: 14px;
		line-height: 30px;
	}
	
	.name_con {
		width: 92%;
		padding-left: 50px;
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
	/*驳回弹窗/复审弹窗*/
	
	.details-box {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		/*padding:10px 0;*/
		background: #fff;
		width: 800px;
		z-index: 17;
		min-width: 470px;
		overflow-x: auto;
	}
	
	.details-box .bottom {
		padding: 15px;
		text-align: center;
		padding-bottom: 0;
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
		color: RGBA(51, 51, 51, 1);
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
		background: RGBA(245, 245, 245, 1);
		padding: 5px;
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
		z-index: 16;
	}
	/*内容关联*/
	
	.bt {
		text-align: left;
		padding: 15px;
		/*background: #f8f8f9;*/
	}
	
	.relation {
		width: 705px;
		height: 740px;
		z-index: 18;
		display: flex;
		flex-direction: column;
		overflow: auto;
	}
	
	.relation .text {
		margin-bottom: 15px;
		padding: 0;
	}
	
	.tabulation {
		width: 100%;
		margin-top: 5px;
		display: flex;
		flex-direction: column;
		overflow: auto;
		flex: 1;
	}
	
	.tabulation .span_1 {
		display: inline-block;
		width: 24%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.title_tab {
		width: 100%;
		height: 60px;
		font-size: 16px;
		color: rgba(51, 51, 51, 1);
		line-height: 60px;
		background: #E7E9EB;
	}
	
	.content_name {
		height: 56px;
		line-height: 56px;
		display: flex;
		flex: 1;
		flex-direction: column;
		overflow-y: auto;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	.content_name>li:nth-child(2n) {
		background: rgba(231, 233, 235, .2);
	}
	
	.content_name .sky {
		color: rgba(56, 139, 255, 1);
		cursor: pointer;
	}
	
	.text .num {
		float: right;
	}
	
	.ivu-table-wrapper {
		border: 0;
	}
	
	.ivu-table:after,
	.ivu-table:before {
		display: none;
	}
	
	.color-list {
		height: 168px;
		overflow-y: auto;
	}
	/*置顶弹窗*/
	
	.up {
		width: 800px;
		z-index: 18;
	}
	
	.up .bottom {
		padding: 15px;
		/*margin-top: 30px;*/
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	.up .title-box {
		border: 1px solid RGBA(56, 139, 255, 1);
		overflow: hidden;
		border-radius: 5px;
	}
	
	.up .title-box div {
		float: left;
		width: 50%;
		text-align: center;
		/*height: 44px;*/
		line-height: 44px;
		cursor: pointer;
		color: RGBA(56, 139, 255, 1);
	}
	
	.up .title-box div:first-child {
		border-right: 1px solid RGBA(56, 139, 255, 1);
	}
	
	.color-item {
		border-bottom: 1px solid #f1f1f1;
		padding: 8px 5px;
	}
	
	.color-item span {
		display: inline-block;
		text-align: left;
		/*font-size: 11px;*/
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		text-align: center;
	}
	
	.list {
		margin-top: 15px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	.list .head {
		width: 100%;
		padding: 15px 0;
		background: RGBA(231, 233, 235, 1);
	}
	
	.list .head span {
		display: inline-block;
		text-align: left;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		text-align: center;
	}
	
	.color-item:nth-child(even) {
		background: rgba(231, 233, 235, 1);
	}
	
	.list .btn {
		padding: 13px 0;
		border-bottom: 1px solid #f1f1f1;
	}
	
	.list .sure {
		padding: 13px 0;
	}
	
	.up .title-box .blueWhole {
		background: RGBA(56, 139, 255, 1);
		color: #fff;
	}
	
	.content_box {
		height: 380px;
		overflow-y: auto;
	}
	
	.img_notes {
		width: 344px;
		/*height: 192px;*/
		position: relative;
		margin: 10px 0;
	}
	
	.notes {
		width: 344px;
		line-height: 20px;
		position: absolute;
		bottom: 0;
		left: 0;
		background: RGBA(51, 51, 51, 1);
		color: #fff;
	}
	
	.pagination {
		margin: 30px 0;
	}
	/*驳回原因展示*/
	
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
	/*创建内容*/
	
	.establish_content {
		width: 800px;
		height: 478px;
		color: #333333;
		border: 1px solid #ccc;
		background: #fff;
		z-index: 70;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}
	
	.title_cont {
		width: 100%;
		height: 44px;
		line-height: 44px;
		padding-left: 10px;
		font-size: 18px;
		border-bottom: 1px solid #ccc;
		background-color: rgba(248, 248, 248, 1);
	}
	
	.title_cont img {
		display: inline-block;
		width: 15px;
		height: 15px;
		float: right;
		margin-top: 2%;
		margin-right: 10px;
	}
	
	.content_look {
		text-align: center;
		padding-top: 7%;
		font-size: 24px;
		color: #333333;
	}
	
	.content_say img {
		display: inline-block;
		width: 117px;
		height: 117px;
		margin-bottom: 15%;
	}
	
	.content_look span {
		display: inline-block;
		padding: 7%;
		/*border: 1px solid #CCCCCC;*/
		border-radius: 5px;
		cursor: pointer;
	}
	/*说一嘴内容*/
	
	.mouth_content {
		width: 98%;
		height: 100%;
		z-index: 15;
		background: rgba(244, 244, 244, 1);
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		font-size: 16px;
		color: #333;
	}
	
	.mouth_box {
		float: left;
		width: 70%;
		height: 95%;
		margin: 1% auto;
		z-index: 80;
		background: #fff;
		padding: 30px;
		padding-left: 5%;
		overflow-y: auto;
	}
	
	.main_title {
		/*width: 83%;*/
		margin-bottom: 30px;
	}
	
	.author_box {
		margin-top: 10px;
		margin-bottom: 30px;
	}
	
	.author {
		margin-right: 20px;
	}
	
	.content_x {
		width: 560px;
		margin-bottom: 30px;
	}
	
	.picture {
		display: inline-block;
		width: 147px;
		height: 127px;
		vertical-align: top;
		border: 1px solid #bbb;
		border-radius: 4px;
		font-size: 12px;
	}
	
	.file-btn {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		outline: none;
		background-color: transparent;
		filter: alpha(opacity=0);
		-moz-opacity: 0;
		-khtml-opacity: 0;
		opacity: 0;
	}
	
	.file-wrap {
		/*background: red;*/
		width: 160px;
		height: 200px;
		text-align: center;
	}
	
	.file-wrap p {
		line-height: 20px;
	}
	
	.file-box {
		display: inline-block;
		position: relative;
		overflow: hidden;
		color: #fff;
		/*border: 1px dashed #ccc;*/
		width: 50px;
		height: 50px;
		text-align: center;
	}
	
	.mouth_box_right {
		float: right;
		width: 28%;
		height: 95%;
		margin: 1% auto;
		z-index: 80;
		background: #fff;
		padding: 30px;
		margin-right: 1%;
	}
	
	.mouth_right_box {
		width: 68%;
		margin: 20% auto;
		font-size: 14px;
		color: #999;
	}
	
	.mouth_right_box img {
		margin-bottom: 15%;
	}
	
	.img_up {
		width: 560px;
	}
	
	.load_img {
		position: relative;
		display: inline;
		width: 460px;
	}
	
	.load_img img {
		object-fit: cover;
		margin-right: 10px;
		margin-bottom: 10px;
		border-radius: 5px;
	}
	
	.load_dele_box {
		position: absolute;
		top: 5%;
		left: 30%;
		border-radius: 50%;
		background: #333;
		width: 42px;
		height: 42px;
		text-align: center;
	}
	
	.load_dele {
		width: 23px;
		height: 24px;
		margin: 9px;
	}
	/*秀一把点击预览*/
	
	.show_box {
		width: 450px;
		height: 715px;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -55%);
		z-index: 80;
		background: #fff;
		padding: 1%;
		color: #333;
		overflow: hidden;
		border-radius: 5px;
	}
	
	.show_box .show_box_text_box {
		margin: 20px 0;
	}
	
	.show_box_header {
		font-size: 24px;
		font-weight: bold;
		padding-bottom: 20px;
		border-bottom: 1px solid #DEDEDE;
	}
	
	.show_box_text {
		font-size: 14px;
		line-height: 26px;
	}
	
	.show_box_img_box {
		position: relative;
	}
	
	.show_box_img_box img {
		display: inline-block;
		width: 100%;
	}
	
	.show_box_notes {
		width: 100%;
		position: absolute;
		left: 0px;
		bottom: 1%;
		background: #333333;
		color: #fff;
		padding: 5px;
	}
	
	.creatText:hover {
		background: #D87000 !important;
	}
	
	.fixedClass {
		background: #fff;
		z-index: 1;
		position: fixed;
		top: 90px;
		right: 28%;
		width: 245px;
		height: 420px;
		border: 1px solid #DEDEDE;
		padding: 10px;
	}
	
	pre {
		white-space: pre-wrap;
		white-space: -moz-pre-wrap;
		white-space: -pre-wrap;
		white-space: -o-pre-wrap;
		word-wrap: break-word;
		font-family: "微软雅黑";
		line-height: 24px;
	}
</style>