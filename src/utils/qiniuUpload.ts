import { request } from '@umijs/max';
import * as qiniu from 'qiniu-js';
import { message } from 'antd';

// 七牛云Token响应类型
type QiniuTokenResp = {
  token?: string;
  uptoken?: string;
  domain?: string;
  host?: string;
};

// 上传配置选项
export interface UploadOptions {
  keyPrefix?: string; // 文件key前缀
  onProgress?: (percent: number) => void; // 进度回调
}

// 文件大小限制（5MB）
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// 允许的图片类型
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];

/**
 * 从后端获取七牛云上传token
 * 注意：AK/SK必须保存在后端，前端通过接口获取临时token
 */
export async function getQiniuToken(): Promise<{ token: string; domain: string }> {
  try {
    const resp = await request<API.Response>('/proxy/v1/api/qiniu/token', {
      method: 'GET',
    });

    const body = resp?.msgBody || resp || {};
    const token = body.token || body.uptoken;
    const domain = body.domain || body.host || process.env.REACT_APP_QINIU_DOMAIN || '';

    if (!token) {
      throw new Error('无法获取七牛云上传凭证');
    }

    return { token, domain };
  } catch (error) {
    console.error('获取七牛云token失败:', error);
    throw new Error('获取上传凭证失败，请稍后重试');
  }
}

/**
 * 生成唯一的文件key
 * @param filename 原始文件名
 * @returns 唯一key，格式：article/时间戳_随机字符串.扩展名
 */
function generateUniqueKey(filename: string): string {
  const ext = filename.includes('.') ? filename.substring(filename.lastIndexOf('.')) : '.png';
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `article/${timestamp}_${random}${ext}`;
}

/**
 * 验证文件类型和大小
 * @param file 文件对象
 * @returns 是否通过验证
 */
function validateFile(file: File): boolean {
  // 验证文件类型
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    message.error('只支持上传 PNG、JPG、GIF、WEBP 格式的图片');
    return false;
  }

  // 验证文件大小
  if (file.size > MAX_FILE_SIZE) {
    message.error('图片大小不能超过 5MB');
    return false;
  }

  return true;
}

/**
 * 上传图片到七牛云
 * @param file 图片文件
 * @param options 上传配置选项
 * @returns Promise<{url: string, key: string}> 返回图片URL和key
 */
export async function uploadImageToQiniu(
  file: File,
  options?: UploadOptions,
): Promise<{ url: string; key: string }> {
  // 验证文件
  if (!validateFile(file)) {
    throw new Error('文件验证失败');
  }

  try {
    // 获取上传token和域名
    const { token, domain } = await getQiniuToken();

    // 生成文件key
    const keyPrefix = options?.keyPrefix || '';
    const key = keyPrefix + generateUniqueKey(file.name || 'image');

    // 七牛云上传配置
    const putExtra = {
      fname: file.name,
      mimeType: ALLOWED_IMAGE_TYPES,
    };

    const config = {
      useCdnDomain: true,
      region: undefined, // 自动识别区域
    };

    // 执行上传
    return new Promise((resolve, reject) => {
      const observable = qiniu.upload(file, key, token, putExtra, config);

      const subscription = observable.subscribe({
        next: (res: any) => {
          // 上传进度回调
          if (options?.onProgress && res.total) {
            const percent = res.total.percent || 0;
            options.onProgress(percent);
          }
        },
        error: (err: any) => {
          subscription.unsubscribe();
          console.error('七牛云上传失败:', err);
          reject(new Error('图片上传失败，请重试'));
        },
        complete: (res: any) => {
          subscription.unsubscribe();

          // 构建完整的图片URL
          let url: string;
          if (domain) {
            url = domain.endsWith('/') ? `${domain}${key}` : `${domain}/${key}`;
          } else {
            // 如果没有域名配置，返回key（需要后续配置域名）
            url = res?.key || key;
            console.warn('未配置七牛云域名，返回的URL可能不完整');
          }

          resolve({ url, key });
        },
      });
    });
  } catch (error) {
    console.error('上传图片错误:', error);
    throw error;
  }
}

/**
 * 将Data URL转换为File对象
 * @param dataUrl base64格式的图片数据
 * @param filename 文件名
 * @returns File对象
 */
export function dataURLtoFile(dataUrl: string, filename: string): File {
  const arr = dataUrl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

/**
 * 将Blob转换为File对象
 * @param blob Blob对象
 * @param filename 文件名
 * @returns File对象
 */
export function blobToFile(blob: Blob, filename: string): File {
  return new File([blob], filename, {
    type: blob.type || 'application/octet-stream',
  });
}

/**
 * 检查HTML内容中是否包含base64图片
 * @param html HTML内容
 * @returns 是否包含base64图片
 */
export function hasInlineBase64Images(html: string): boolean {
  return /<img[^>]+src=["']data:image\//i.test(html);
}
