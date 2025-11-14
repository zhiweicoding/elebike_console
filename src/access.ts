/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const { currentUser } = initialState ?? {};
  return {
    // 原有的管理员权限
    canAdmin: currentUser && currentUser.adminRole === 1,

    // 小程序端权限
    canAccessMiniApp: currentUser && currentUser.platformType === 'miniapp',

    // 中文PC端权限
    canAccessCN: currentUser && currentUser.platformType === 'cn',

    // 英文PC端权限
    canAccessEN: currentUser && currentUser.platformType === 'en',

    // PC端共用（中文+英文）
    canAccessPC: currentUser && ['cn', 'en'].includes(currentUser.platformType || ''),

    // Good商品页面三端共用
    canAccessGood: currentUser && ['miniapp', 'cn', 'en'].includes(currentUser.platformType || ''),
  };
}
