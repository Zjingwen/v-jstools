import { Button, Form, useFormApi } from '@douyinfe/semi-ui';
import { chromeStorageGet, chromeStorageSet, isEmptyObject } from "@utils";

const { Checkbox, Input } = Form;

function TimeFreezeNumber() {
  const formApi = useFormApi();
  const change = () => {
    formApi.setValue('config-hook-time-freeze-number', +new Date());
  };
  return <Button onClick={change}>{`获取当前时间戳用于固定时间(注意！！！由于固定时间可能会影响到cookie设置，所以请生成一个当前时间戳再行使用)`}</Button>
}

export default () => {
  const initConfig = [
    ["config-hook-global", "是否挂钩总开关"],
    ["config-hook-Function", "hook-Function"],
    ["config-hook-eval", "hook-eval（eval函数会记录上下文，若 eval 用到封闭的上下文参数可能报错）"],
    ["config-hook-remove-dyn-debugger", `remove-dyn-debugger(need selected "hook-Function" or "hook-eval")`],
    ["config-hook-settimeout", "hook-settimeout"],
    ["config-hook-setinterval", "hook-setinterval"],
    ["config-hook-random", "是否启用启用下面四种调试功能（用于固定随机性，便于对比调试）"],
    ["config-hook-random-freeze", "config-hook-random（让 random 函数固定返回 0.5）"],
    ["config-hook-random-fake", "config-hook-random（让random 变成伪随机函数。如果已经配置了该伪随机，则会覆盖上面的 0.5）"],
    ["config-hook-time-freeze", "config-hook-time（时间函数返回的值固定成一个数字）"],
  ];
  // 不需要循环渲染的属性
  const notReviewConfig = [
    ["config-hook-time-freeze-number"]
  ]
  async function handleFormApi(formApi) {
    for (let [key] of [...initConfig, ...notReviewConfig]) {
      const res = await chromeStorageGet(key);
      !isEmptyObject(res) && formApi.setValue(key, res[key]);
    };
  };

  async function handleChange(value) {
    console.group("handleChange");
    console.log(JSON.stringify(value));
    console.groupEnd();
    for (const key in value) await chromeStorageSet(key, value[key]);
  }
  return <Form layout="horizontal" onValueChange={handleChange} getFormApi={handleFormApi}>
    {initConfig.map(([key, value]) => (<Checkbox field={key} noLabel>{value}</Checkbox>))}
    <Input noLabel field="config-hook-time-freeze-number" disabled />
    <TimeFreezeNumber />
  </Form>
}