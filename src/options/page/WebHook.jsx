import { useState, useEffect } from "react";
import { Form } from '@douyinfe/semi-ui';
import { chromeStorageGet, isEmptyObject } from "@utils";

const { Checkbox } = Form;
export default () => {
  const initConfig = {
    "config-hook-global": "是否挂钩总开关",
    "config-hook-Function": "hook-Function",
    "config-hook-eval": "hook-eval（eval函数会记录上下文，若 eval 用到封闭的上下文参数可能报错）",
    "config-hook-remove-dyn-debugger": `remove-dyn-debugger(need selected "hook-Function" or "hook-eval")`,
    "config-hook-settimeout": "hook-settimeout",
    "config-hook-setinterval": "hook-setinterval",
  };
  const [initValues, setValues] = useState({
    "config-hook-global": true,
  });
  async function init() {
    let b = {};
    for (let key in initConfig) {
      const res = await chromeStorageGet(key);
      if (!isEmptyObject(res)) b[key] = res[key];
    }
    console.log("init", b);
    setValues(b);
  }
  useEffect(function () {
    // init();
  }, []);

  function handleChange(value) {
    for (const key in value) {
      chrome.storage.local.set({ [key]: value[key] })
    }
  }
  return <Form initValues={initValues} layout="horizontal" onValueChange={handleChange}>
    {Object.keys(initConfig).map(key => (<Checkbox field={key} noLabel>{initConfig[key]}</Checkbox>))}
    {/* <Checkbox field="config-hook-Function" noLabel>hook-Function</Checkbox>
    <Checkbox field="config-hook-eval" noLabel>hook-eval（eval函数会记录上下文，若 eval 用到封闭的上下文参数可能报错）</Checkbox>
    <Checkbox field="config-hook-remove-dyn-debugger" noLabel>remove-dyn-debugger(need selected "hook-Function" or "hook-eval")</Checkbox>
    <Checkbox field="config-hook-settimeout" noLabel>hook-settimeout</Checkbox>
    <Checkbox field="config-hook-setinterval" noLabel>hook-setinterval</Checkbox> */}
  </Form>
}