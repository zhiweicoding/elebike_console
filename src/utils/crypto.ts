import md5 from 'crypto-js/md5';

/**
 * 使用MD5加密算法生成token
 * @param username 用户名
 * @param password 密码
 * @param timestamp 时间戳
 * @returns 返回"Bearer "开头的token
 */
export const generateToken = (username: string, password: string, timestamp: number): string => {
  return `Bearer ${md5(username + password + timestamp)}`;
};

/**
 * 验证token是否存在
 * @returns 返回token是否存在
 */
export const hasToken = (): boolean => {
  return !!localStorage.getItem('token');
};

/**
 * 保存token到localStorage
 * @param token 要保存的token
 */
export const saveToken = (token: string): void => {
  localStorage.setItem('token', token);
};

/**
 * 删除token
 */
export const removeToken = (): void => {
  localStorage.removeItem('token');
};

/**
 * 获取token
 * @returns 返回保存的token，如果不存在则返回空字符串
 */
export const getToken = (): string => {
  return localStorage.getItem('token') || '';
};
