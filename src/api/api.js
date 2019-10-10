//ip+端口号
const ipUrl = 'http://47.93.223.40:8002/'; //测试
//const ipUrl = 'http://39.107.106.204:8002/';   //正式
//接口

//投诉反馈列表
export const ComplaintList = ipUrl + 'api/mgr/feedback/DepartQueryList';

//获取评论列表
export const MgrCommentList = ipUrl + 'api/mgr/Comment/MgrCommentList';

//获取评论审核列表
export  const MgrCommentAuditList =ipUrl+ 'api/mgr/Comment/MgrCommentAuditList'

//获取内容列表（前端）
export const MgrClientContentList = ipUrl+ 'api/mgr/Content/MgrClientContentList';

//评论审核列表（通过/删除）
export const CommentAudit = ipUrl + 'api/mgr/Comment/CommentAudit';

//评论类表（删除）
export const CommentDelete =ipUrl+ 'api/mgr/Comment/CommentDelete';

//修改密码
export const UpdatePassWord = ipUrl + 'api/mgr/Role_Dept/UpdatePassWord';

//查看详情/评论
export const CheckComment = ipUrl + 'api/mgr/Comment/CheckComment';

//注销登录
export const LoginOut = ipUrl + 'api/mgr_Login/LoginOut';

//前端用户管理列表
export const ClientQueryList = ipUrl + 'api/mgr/Client/ClientQueryList';

//对客户端操作（重置密码）
export const ClientAction = ipUrl + 'api/mgr/Client/ClientAction';

//关闭/开启客户端账号
export const ClientAccount =ipUrl+ 'api/mgr/Client/ClientAccount';

//更改客户端账号类型
export const ClientEditType =ipUrl+ 'api/mgr/Client/ClientEditType';

//获取当前用户的权限菜单

export const menusList = ipUrl + 'api/mgr/function/menus';

//获取用户信息
export const GetUserInfo = ipUrl + 'api/mgr/Role_Dept/GetUserInfo';

//后台用户管理 通过部门得到角色
export const RoleListByDept = ipUrl + 'api/mgr/Role_Dept/RoleListByDept';

//获取内容列表
export const MgrContentList = ipUrl + 'api/mgr/Content/MgrContentList';

//查询按钮的权限
export const QueryFunction = ipUrl + 'api/mgr/Role_Dept/QueryFunction';

//获取当前用户角色
export const RoleList = ipUrl + 'api/mgr/Role_Dept/RoleList';

//获取部门
export const DeptList = ipUrl + 'api/mgr/Role_Dept/DeptList';

//创建用户
export const AddUserMgr = ipUrl + 'api/mgr/Role_Dept/AddUserMgr';

//编辑用户
export const EditUserMgr =ipUrl+ 'api/mgr/Role_Dept/EditUserMgr';

//重置后台用户密码
export const ResetMgrPass = ipUrl + 'api/mgr/Role_Dept/ResetMgrPass';

//修改密码 重新登陆
export const LoginOuttest = ipUrl +  'api/mgr/Role_Dept/LoginOuttest';

export const UserMgrQueryList = ipUrl + 'api/mgr/Role_Dept/UserMgrQueryList'

//前端手机号关联查询
export const GetClientInfo= ipUrl+ 'api/mgr/Role_Dept/GetClientInfo';

//获取后台账号关联的前端信息
export const GetMgrRelationClientInfo = ipUrl + 'api/mgr/Role_Dept/GetMgrRelationClientInfo';

//关联/取消前端关联账号
export const RelationClient = ipUrl+ 'api/mgr/Role_Dept/RelationClient';

//获取主账号下的子账号的信息
export const GetClientList = ipUrl+ 'api/mgr/Role_Dept/GetClientList';

//检验是否关联前端账号
export const CheckUser = ipUrl+ 'api/mgr/Content/CheckUser';