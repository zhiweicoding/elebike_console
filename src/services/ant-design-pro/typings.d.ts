// @ts-ignore
/* eslint-disable */

declare namespace API {

  interface BaseResult<T> {
    msgInfo: string;
    msgCode: number; // 1000 success, 10001 fail, 1002 no auth
    msgBody: T;
    msgBodySize: number;
    isEmpty?: boolean;
  }

  type CurrentUser = {
    name?: string;
    avatar?: string;
    userid?: string;
    email?: string;
    signature?: string;
    title?: string;
    group?: string;
    adminRole?: number;
    tags?: { key?: string; label?: string }[];
    notifyCount?: number;
    unreadCount?: number;
    country?: string;
    access?: string;
    geographic?: {
      province?: { label?: string; key?: string };
      city?: { label?: string; key?: string };
    };
    address?: string;
    phone?: string;
  };

  type LoginResult = {
    msgCode?: number;
    msgBody?: boolean;
    msgInfo?: string;
    isEmpty?: boolean;
  };

  type StatisticResult = {
    symbol?: number;
    good?: number;
    store?: number;
  };

  type PieItem = {
    type?: string;
    value?: number;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type BannerListItem = {
    id?: string;
    link?: string;
    imageUrl?: string;
  };

  type BannerList = {
    data?: BannerListItem[];
    /** 列表的内容总数 */
    total?: number;
    pageSize?: number;
    current?: number;
    success?: boolean;
  };

  type SymbolListItem = {
    symbolId?: string;
    symbolName?: string;
    sortNum?: number;
    isPopular?: number;
    createTime?: number;
    modifyTime?: number;
  };

  type SymbolList = {
    data?: SymbolListItem[];
    /** 列表的内容总数 */
    total?: number;
    pageSize?: number;
    current?: number;
    success?: boolean;
  };


  type StoreListItem = {
    storeId?: string;
    storeName?: string;
    storeDesc?: string;
    storeLogo?: string;
    phoneNum?: string;
    backupPhoneNum?: string;
    staffWx?: string;
    address?: string;
    goodNumber?: string;
    lnglat?: string;
    licenseUrl?: string;
    createTime?: number;
    modifyTime?: number;
    isDelete?: number;
  };

  type StoreList = {
    data?: StoreListItem[];
    /** 列表的内容总数 */
    total?: number;
    pageSize?: number;
    current?: number;
    success?: boolean;
  };

  type GoodListItem = {
    goodId?: string;
    goodTitle?: string;
    goodBrief?: string;
    scenePicUrl?: string;
    listPicUrl?: string;
    floorPrice?: number;
    retailPrice?: number;
    marketPrice?: number;
    goodNumber?: number;
    photoUrl?: string;
    photoUrlArray?: string[];
    symbolId?: string;
    isChosen?: number;
    isNew?: number;
    isCheap?: number;
    likeNum?: number;
    createTime?: number;
    modifyTime?: number;
    isDelete?: number;
  };

  type GoodList = {
    data?: GoodListItem[];
    /** 列表的内容总数 */
    total?: number;
    pageSize?: number;
    current?: number;
    success?: boolean;
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    username?: string;
    password?: string;
    timestamp?: number;
    autoLogin?: boolean;
    type?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };
}
