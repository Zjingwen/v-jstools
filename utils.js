/**
 * 获取chrome storage local 数据
 * @param {string} key 键名
 * @returns {Promise}
 */
export async function chromeStorageGet(key) {
  return await chrome.storage.local.get(key);
}

/**
 * 判断对象是否为空
 * @param {object} obj
 * @returns {boolean}
 */
export function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}
