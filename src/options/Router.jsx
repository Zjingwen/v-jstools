import React from 'react';
import WebApiHook from '@src/options/page/WebApiHook';
import CodeImport from '@src/options/page/CodeImport';
import ChangeProxy from '@src/options/page/ChangeProxy';

export default [{
  path: "/",
  name: "web api hook",
  element: <WebApiHook />,
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