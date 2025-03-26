// 操作成功
export const SUCCESS = 1001;
// 操作异常
export const WARN = 3001;
// 操作失败
export const ERROR = 4001;

// emit 发送消息时的默认type
export const OBSERVER_DETAIL_TYPE = "DETAIL";

// emit 发送消息时的默认data
export const OBSERVER_DETAIL_DATA = {};

// emit 发送消息的接收方渠道
export const OBSERVER_DETAIL_FROM = [
  'options',
  'contentScript',
  'injectedScript',
  'serviceWorker',
  'popup',
];