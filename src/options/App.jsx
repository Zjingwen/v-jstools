import React from 'react';
import { createHashRouter, RouterProvider, Link } from 'react-router-dom';
import ReactDOM from "react-dom/client";
import "@public/lib/reset.css";
import routers from "./Router";
import { Button, Space } from '@douyinfe/semi-ui';

function LayouFrame(props) {
  return (
    <>
      <Space>
        <Button><Link to="/">web api hook</Link></Button>
        <Button><Link to="/about">注入代码</Link></Button>
        <Button><Link to="/contact">修改代理/返回值</Link></Button>
      </Space>
      <br />
      <div>
        {props.children}
      </div>
    </>
  );
};


const router = createHashRouter(routers.map(v => {
  const { path, element } = v;
  return {
    path,
    element: <LayouFrame>{element}</LayouFrame>
  }
}));
const el = document.getElementById('app');
const root = ReactDOM.createRoot(el);

root.render(<RouterProvider router={router} />);