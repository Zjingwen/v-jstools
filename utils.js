/**
 * 获取chrome storage local 数据
 * @param {string} key 键名
 * @returns {Promise}
 */
export async function chromeStorageGet(key) {
  return await chrome.storage.local.get(key);
}

/**
 * 设置chrome storage local 数据
 * @param {string} key
 * @param {string} value
 * @returns {Promise}
 */
export async function chromeStorageSet(key, value) {
  return await chrome.storage.local.set({ [key]: value });
}

/**
 * 判断对象是否为空
 * @param {object} obj
 * @returns {boolean}
 */
export function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}
