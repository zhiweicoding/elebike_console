// @ts-ignore
/* eslint-disable */
import {request} from '@umijs/max';

/** 获取当前的用户 POST /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');
  return request<API.BaseResult<API.CurrentUser>>('/v1/page/user/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": token || ''
    },
    ...(options || {}),
  });
}

/** 获取首页的数据 Post*/
export async function queryStatistic(options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');
  return request<API.BaseResult<API.StatisticResult>>('/v1/page/statistic/common', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": token || ''
    },
    ...(options || {}),
  });
}

/** 获取首页饼图的数据 Post*/
export async function queryPie(options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');
  return request<API.BaseResult<API.PieItem[]>>('/v1/page/statistic/symbolGood', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": token || ''
    },
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

  return request<API.LoginResult>('/v1/page/login/in', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
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
