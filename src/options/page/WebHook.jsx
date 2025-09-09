import { Button, Form, useFormApi } from '@douyinfe/semi-ui';
import { chromeStorageGet, chromeStorageSet, isEmptyObject } from "@utils";
import { getsets_0, getsets_1, funcs_0, funcs_1 } from '@src/constant/webapi.js';

const { Checkbox, Input } = Form;

function TimeFreezeNumber(props) {
  const { field, value } = props;
  const formApi = useFormApi();
  const click = () => {
    formApi.setValue(field, +new Date());
  };
  return <>
    <Input noLabel field={field} disabled />
    <Button onClick={click}>{value}</Button>
  </>
}

function CookieMatch(props) {
  const { field, value } = props;
  return <>
    <Input field={field} noLabel />{value}
  </>
}

// 单个checkbox
function CheckboxCompones(props) {
  const { field, value } = props;
  return <Checkbox field={field} noLabel>{value}</Checkbox>
}

// 多个checkbox
function CheckboxsCompones(props) {
  const { configs } = props;
  return configs.map(([key, value]) => {
    return <CheckboxCompones field={key} value={value} />
  })
}

export default () => {
  const config1 = [
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

  const config2 = [
    ["config-hook-time-freeze-number", "获取当前时间戳用于固定时间"],
    ["config-hook-time-performance", "config-hook-performance-now（这个时间函数返回的值固定成一个数字）"],
    ["config-hook-log-at", "是否在调试输出时，输出函数触发的地址"],
    ["config-hook-cookie", "是否对 cookie 进行挂钩调试输出"],
    ['config-hook-cookie-add-debugger', 'hook-cookie-add-debugger'],
    ["config-hook-cookie-match", "对匹配字符串的cookie才下断（不设置则为全部都下断）"],
    ["hook-cookie-get", "hook-cookie-get"],
    ["hook-cookie-set", "hook-cookie-set"],
    ["config-hook-encrypt-normal", "是否启用下面几个加解密函数挂钩输出功能"],
    ['hook-JSON.parse', ' config-hook-JSON.parse'],
    ['hook-JSON.stringify', ' config-hook-JSON.stringify'],
    ['hook-decodeURI', ' config-hook-decodeURI'],
    ['hook-decodeURIComponent', ' config-hook-decodeURIComponent'],
    ['hook-encodeURI', ' config-hook-encodeURI'],
    ['hook-encodeURIComponent', ' config-hook-encodeURIComponent'],
    ['hook-escape', ' config-hook-escape'],
    ['hook-unescape', ' config-hook-unescape'],
    ['hook-atob', ' config-hook-atob'],
    ['hook-btoa', ' config-hook-btoa'],
    ['config-hook-domobj', '是否启用挂钩 DOM 对象的原型的功能调试输出'],
    ['config-hook-domobj-get', 'hook-domobj-显示get输出'],
    ['config-hook-domobj-set', 'hook-domobj-显示set输出'],
    ['config-hook-domobj-func', 'hook-domobj-显示func输出'],
  ];

  async function handleFormApi(formApi) {
    for (let [key] of [...config1, ...config2, ...getsets_0, ...getsets_1, ...funcs_0, ...funcs_1]) {
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
    <CheckboxsCompones configs={config1} />
    <TimeFreezeNumber field={config2[0][0]} value={config2[0][1]} />
    <CheckboxCompones field={config2[1][0]} value={config2[1][1]} />
    <CheckboxCompones field={config2[2][0]} value={config2[2][1]} />
    <CheckboxCompones field={config2[3][0]} value={config2[3][1]} />
    <CheckboxCompones field={config2[4][0]} value={config2[4][1]} />
    <CookieMatch field={config2[5][0]} value={config2[5][1]} />
    <CheckboxCompones field={config2[4][0]} value={config2[4][1]} />
    <CheckboxCompones field={config2[6][0]} value={config2[6][1]} />
    <CheckboxCompones field={config2[7][0]} value={config2[7][1]} />
    <CheckboxCompones field={config2[8][0]} value={config2[8][1]} />
    <CheckboxCompones field={config2[9][0]} value={config2[9][1]} />
    <CheckboxCompones field={config2[10][0]} value={config2[10][1]} />
    <CheckboxCompones field={config2[11][0]} value={config2[11][1]} />
    <CheckboxCompones field={config2[12][0]} value={config2[12][1]} />
    <CheckboxCompones field={config2[13][0]} value={config2[13][1]} />
    <CheckboxCompones field={config2[14][0]} value={config2[14][1]} />
    <CheckboxCompones field={config2[15][0]} value={config2[15][1]} />
    <CheckboxCompones field={config2[16][0]} value={config2[16][1]} />
    <CheckboxCompones field={config2[17][0]} value={config2[17][1]} />
    <CheckboxCompones field={config2[18][0]} value={config2[18][1]} />
    <CheckboxCompones field={config2[19][0]} value={config2[19][1]} />
    <CheckboxCompones field={config2[20][0]} value={config2[20][1]} />
    <CheckboxCompones field={config2[21][0]} value={config2[21][1]} />
    <CheckboxCompones field={config2[22][0]} value={config2[22][1]} />
    <CheckboxsCompones configs={getsets_0} />
    <CheckboxsCompones configs={getsets_1} />
    <CheckboxsCompones configs={funcs_0} />
    <CheckboxsCompones configs={funcs_1} />
  </Form>
}