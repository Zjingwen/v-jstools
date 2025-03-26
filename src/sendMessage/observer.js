// 集中订阅管理
import { OBSERVER_DETAIL_TYPE, ERROR } from "@src/constant";
/**
 * 初始化订阅
 * @param {object} request {type,data}
 * @param {any} _sender 未知
 * @param {function} sendResponse 回调函数
 * @returns
 */
function listener(request, _sender, sendResponse) {
  const { type, data } = request;
  console.log("observer", type, data);
  if (type === OBSERVER_DETAIL_TYPE) {
    sendResponse({ code: ERROR, msg: "observer暂无对应回调方法" });
    return false;
  }

  setTimeout(() => sendResponse({ code: 1001, msg: "observer回调用" }), 2000);
  return true;
}

export default () => chrome.runtime.onMessage.addListener(listener);
