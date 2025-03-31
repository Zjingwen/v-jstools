import WebHook from '@src/options/page/WebHook';
import CodeImport from '@src/options/page/CodeImport';
import ChangeProxy from '@src/options/page/ChangeProxy';

export default [{
  path: "/",
  name: "web hook",
  element: <WebHook />,
  query: {},
},
{
  path: "/about",
  name: "注入代码",
  element: <CodeImport />,
  query: {},
},
{
  path: '/contact',
  name: "修改代理/返回值",
  element: <ChangeProxy />,
  query: {},
}]