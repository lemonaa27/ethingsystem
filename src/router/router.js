let routes = [{
		path: '/',
		redirect: '/login'
	},
	{
		path: '/DepartmentManagement',
		name: 'Depar',
		component: resolve => require(['../components/common/Home.vue'], resolve),
		children: [{
				path: '/',
				component: resolve => require(['../components/page/user/DepartmentManagement.vue'], resolve) //部门管理管理
			},
			{
				path: '/RoleManagement',
				component: resolve => require(['../components/page/user/RoleManagement.vue'], resolve) //角色管理
			},
			{
				path: '/FrontUserManagement',
				component: resolve => require(['../components/page/user/FrontUserManagement.vue'], resolve) //前台用户管理
			},
			{
				path: '/BackstageUserManagement',
				component: resolve => require(['../components/page/user/BackstageUserManagement.vue'], resolve) //后台用户管理
			},
			{
				path: '/ContentManagement',
				component: resolve => require(['../components/page/content/ContentManagement.vue'], resolve) //内容管理
			},
			
			{
				path: '/ContentAuditManagement',
				component: resolve => require(['../components/page/content/ContentAuditManagement.vue'], resolve) // 内容审核管理
			},
			{
				path: '/ContentDrafts',
				component: resolve => require(['../components/page/content/ContentDrafts.vue'], resolve) // 内容草稿箱
			},
			{
				path: '/Sensitive',
				component: resolve => require(['../components/page/sensitive/sensitive.vue'], resolve) // 敏感词库
			},
			{
				path: '/ReviewManagement',
				component: resolve => require(['../components/page/Review/ReviewManagement.vue'], resolve) //内容管理
			},
			{
				path: '/AuditManagement',
				component: resolve => require(['../components/page/Review/AuditManagement.vue'], resolve) // 评论审核管理
			},
			{
				path: '/ComplaintFeedback',
				component: resolve => require(['../components/page/complaint/ComplaintFeedback.vue'], resolve) // 投诉/反馈管理
			},
			{
				path: '/Modify',
				component: resolve => require(['../components/page/modify/modifyPsd.vue'], resolve) // 修改密码
			}
		]
	},
	{
		path: '/login',
		component: resolve => require(['../components/page/login/Login.vue'], resolve)
	},
]
export default routes