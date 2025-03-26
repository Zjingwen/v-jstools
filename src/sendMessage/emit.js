// 发送消息
import {
  ERROR,
  OBSERVER_DETAIL_TYPE,
  OBSERVER_DETAIL_DATA,
} from "@src/constant";

export default async function (
  type = OBSERVER_DETAIL_TYPE,
  from = "",
  data = OBSERVER_DETAIL_DATA
) {
  return new Promise((resolve) => {
    try {
      chrome.runtime.sendMessage({ type, from, data }, function (response) {
        resolve(response);
      });
    } catch (error) {
      console.error(error.toString());
      resolve({ code: ERROR, msg: "emit 发生异常" });
    }
  });
}
