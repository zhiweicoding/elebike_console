// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取英文车辆列表 POST /proxy/v1/page/bike-en/index */
export async function queryBikeEn(
  params: {
    current?: number;
    pageSize?: number;
    category?: string;
  },
  options?: { [key: string]: any },
) {
  const token = localStorage.getItem('token');
  return request<API.BaseResult<any>>('/proxy/v1/page/bike-en/index', {
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

/** 添加英文车辆 POST /proxy/v1/page/bike-en/save */
export async function addBikeEn(body: any, options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');
  return request<API.BaseResult<string>>('/proxy/v1/page/bike-en/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token || '',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新英文车辆 PUT /proxy/v1/page/bike-en/update */
export async function modifyBikeEn(body: any, options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');
  return request<API.BaseResult<string>>('/proxy/v1/page/bike-en/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token || '',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除英文车辆 DELETE /proxy/v1/page/bike-en/removeList */
export async function delBikeEn(productIds: string[], options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');
  return request<API.BaseResult<string>>('/proxy/v1/page/bike-en/removeList', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token || '',
    },
    data: productIds,
    ...(options || {}),
  });
}

/** 保存英文车辆主图 POST /proxy/v1/page/bike-en/saveImage */
export async function saveMainImageEn(
  body: {
    productId: string;
    imagePath: string;
    isMain: number;
  },
  options?: { [key: string]: any },
) {
  const token = localStorage.getItem('token');
  return request<API.BaseResult<string>>('/proxy/v1/page/bike-en/saveImage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token || '',
    },
    data: body,
    ...(options || {}),
  });
}
