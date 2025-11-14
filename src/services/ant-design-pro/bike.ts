// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取车辆列表 POST /proxy/v1/page/bike/index */
export async function queryBike(
  params: {
    current?: number;
    pageSize?: number;
    category?: string;
  },
  options?: { [key: string]: any },
) {
  const token = localStorage.getItem('token');
  return request<API.BaseResult<any>>('/proxy/v1/page/bike/index', {
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

/** 获取车辆详情 GET /proxy/v1/page/bike/detail */
export async function getBikeDetail(productId: string, options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');
  return request<API.BaseResult<any>>(`/proxy/v1/page/bike/detail`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token || '',
    },
    params: {
      productId,
    },
    ...(options || {}),
  });
}

/** 添加车辆 POST /proxy/v1/page/bike/save */
export async function addBike(body: any, options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');
  return request<API.BaseResult<string>>('/proxy/v1/page/bike/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token || '',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新车辆 PUT /proxy/v1/page/bike/update */
export async function modifyBike(body: any, options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');
  return request<API.BaseResult<string>>('/proxy/v1/page/bike/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token || '',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除车辆 DELETE /proxy/v1/page/bike/removeList */
export async function delBike(productIds: string[], options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');
  return request<API.BaseResult<string>>('/proxy/v1/page/bike/removeList', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token || '',
    },
    data: productIds,
    ...(options || {}),
  });
}

/** 上传车辆图片 POST /proxy/v1/page/bike/uploadImage */
export async function uploadBikeImage(formData: FormData, options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');
  return request<API.BaseResult<string>>('/proxy/v1/page/bike/uploadImage', {
    method: 'POST',
    headers: {
      Authorization: token || '',
    },
    data: formData,
    ...(options || {}),
  });
}

/** 删除车辆图片 DELETE /proxy/v1/page/bike/deleteImage */
export async function deleteBikeImage(imageId: number, options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');
  return request<API.BaseResult<string>>('/proxy/v1/page/bike/deleteImage', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token || '',
    },
    params: {
      imageId,
    },
    ...(options || {}),
  });
}

/** 保存车辆主图 POST /proxy/v1/page/bike/saveImage */
export async function saveMainImage(
  body: {
    productId: string;
    imagePath: string;
    isMain: number;
  },
  options?: { [key: string]: any },
) {
  const token = localStorage.getItem('token');
  return request<API.BaseResult<string>>('/proxy/v1/page/bike/saveImage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token || '',
    },
    data: body,
    ...(options || {}),
  });
}
