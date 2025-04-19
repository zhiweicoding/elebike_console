// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取当前的用户 POST /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');
  return request<API.BaseResult<API.CurrentUser>>('/proxy/v1/page/user/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token || '',
    },
    ...(options || {}),
  });
}

/** 获取首页的数据 Post*/
export async function queryStatistic(options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');
  return request<API.BaseResult<API.StatisticResult>>('/proxy/v1/page/statistic/common', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token || '',
    },
    ...(options || {}),
  });
}

/** 获取首页饼图的数据 Post*/
export async function queryPie(options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');
  return request<API.BaseResult<API.PieItem[]>>('/proxy/v1/page/statistic/symbolGood', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token || '',
    },
    ...(options || {}),
  });
}

/** 获取分类 POST /proxy/v1/page/symbol/ */
export async function querySymbol(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  const token = localStorage.getItem('token');
  return request<API.BaseResult<API.SymbolList>>('/proxy/v1/page/symbol/index', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token || '',
    },
    params: {
      ...params,
    },
    ...(options || {}),
  }).then((res) => {
    return res.msgBody;
  });
}

/** 添加分类 POST /api/currentUser */
export async function addSymbol(body: API.SymbolListItem, options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');
  //body.createTime 插入时间戳
  body.createTime = new Date().getTime();
  body.modifyTime = new Date().getTime();
  return request<API.BaseResult<string>>('/proxy/v1/page/symbol/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token || '',
    },
    data: body,
    ...(options || {}),
  });
}

/** 添加分类 POST /api/currentUser */
export async function modifySymbol(body: API.SymbolListItem, options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');
  return request<API.BaseResult<string>>('/proxy/v1/page/symbol/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token || '',
    },
    data: body,
    ...(options || {}),
  });
}

/** del分类 POST  */
export async function delSymbol(body: (string | undefined)[], options?: { [p: string]: any }) {
  const token = localStorage.getItem('token');
  return request<API.BaseResult<string>>('/proxy/v1/page/symbol/removeList', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token || '',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取Banner POST /proxy/v1/page/symbol/ */
export async function queryBanner(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  const token = localStorage.getItem('token');
  return request<API.BaseResult<API.BannerList>>('/proxy/v1/page/banner/index', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token || '',
    },
    params: {
      ...params,
    },
    ...(options || {}),
  }).then((res) => {
    return res.msgBody;
  });
}

/** 添加Banner POST /api/currentUser */
export async function addBanner(body: API.BannerListItem, options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');
  return request<API.BaseResult<string>>('/proxy/v1/page/banner/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token || '',
    },
    data: body,
    ...(options || {}),
  });
}

/** 添加Banner */
export async function modifyBanner(body: API.BannerListItem, options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');
  return request<API.BaseResult<string>>('/proxy/v1/page/banner/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token || '',
    },
    data: body,
    ...(options || {}),
  });
}

/** delBanner POST  */
export async function delBanner(body: (string | undefined)[], options?: { [p: string]: any }) {
  const token = localStorage.getItem('token');
  return request<API.BaseResult<string>>('/proxy/v1/page/banner/removeList', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token || '',
    },
    data: body,
    ...(options || {}),
  });
}

/** query store POST /proxy/v1/page/store/ */
export async function queryStore(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  const token = localStorage.getItem('token');
  return request<API.BaseResult<API.StoreList>>('/proxy/v1/page/store/index', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token || '',
    },
    params: {
      ...params,
    },
    ...(options || {}),
  }).then((res) => {
    return res.msgBody;
  });
}

/** add Store POST */
export async function addStore(body: API.StoreListItem, options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');
  return request<API.BaseResult<string>>('/proxy/v1/page/store/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token || '',
    },
    data: body,
    ...(options || {}),
  });
}

/** modify Store put */
export async function modifyStore(body: API.StoreListItem, options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');
  return request<API.BaseResult<string>>('/proxy/v1/page/store/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token || '',
    },
    data: body,
    ...(options || {}),
  });
}

/** del Store delete  */
export async function delStore(body: (string | undefined)[], options?: { [p: string]: any }) {
  const token = localStorage.getItem('token');
  return request<API.BaseResult<string>>('/proxy/v1/page/store/removeList', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token || '',
    },
    data: body,
    ...(options || {}),
  });
}

/** query good POST /proxy/v1/page/good/ */
export async function queryGood(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  const token = localStorage.getItem('token');
  return request<API.BaseResult<API.GoodList>>('/proxy/v1/page/good/index', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token || '',
    },
    params: {
      ...params,
    },
    ...(options || {}),
  }).then((res) => {
    return res.msgBody;
  });
}

/** add good POST */
export async function addGood(body: API.GoodListItem, options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');
  return request<API.BaseResult<string>>('/proxy/v1/page/good/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token || '',
    },
    data: body,
    ...(options || {}),
  });
}

/** modify put */
export async function modifyGood(body: API.GoodListItem, options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');
  return request<API.BaseResult<string>>('/proxy/v1/page/good/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token || '',
    },
    data: body,
    ...(options || {}),
  });
}

/** del good delete  */
export async function delGood(body: (string | undefined)[], options?: { [p: string]: any }) {
  const token = localStorage.getItem('token');
  return request<API.BaseResult<string>>('/proxy/v1/page/good/removeList', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token || '',
    },
    data: body,
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/proxy/v1/page/login/in', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'DELETE',
    ...(options || {}),
  });
}

/** 获取新闻列表 POST */
export async function queryArticles(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  const token = localStorage.getItem('token');
  return request<API.BaseResult<API.ArticleList>>('/proxy/v1/page/news/index', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token || '',
    },
    params: {
      ...params,
    },
    ...(options || {}),
  }).then((res) => {
    return res.msgBody;
  });
}

/** 添加新闻 POST */
export async function addArticle(body: API.ArticleListItem, options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');
  return request<API.BaseResult<string>>('/proxy/v1/page/news/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token || '',
    },
    data: body,
    ...(options || {}),
  });
}

/** 修改新闻 PUT */
export async function modifyArticle(body: API.ArticleListItem, options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');
  return request<API.BaseResult<string>>('/proxy/v1/page/news/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token || '',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除新闻 DELETE */
export async function delArticle(body: (string | undefined)[], options?: { [p: string]: any }) {
  const token = localStorage.getItem('token');
  return request<API.BaseResult<string>>('/proxy/v1/page/news/removeList', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token || '',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取PC端轮播图 POST */
export async function queryBpc(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  const token = localStorage.getItem('token');
  return request<API.BaseResult<API.BannerList>>('/proxy/v1/page/bpc/index', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token || '',
    },
    params: {
      ...params,
    },
    ...(options || {}),
  }).then((res) => {
    return res.msgBody;
  });
}

/** 添加PC端轮播图 POST */
export async function addBpc(body: API.BannerListItem, options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');
  return request<API.BaseResult<string>>('/proxy/v1/page/bpc/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token || '',
    },
    data: body,
    ...(options || {}),
  });
}

/** 修改PC端轮播图 PUT */
export async function modifyBpc(body: API.BannerListItem, options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');
  return request<API.BaseResult<string>>('/proxy/v1/page/bpc/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token || '',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除PC端轮播图 DELETE */
export async function delBpc(body: (string | undefined)[], options?: { [p: string]: any }) {
  const token = localStorage.getItem('token');
  return request<API.BaseResult<string>>('/proxy/v1/page/bpc/removeList', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token || '',
    },
    data: body,
    ...(options || {}),
  });
}
