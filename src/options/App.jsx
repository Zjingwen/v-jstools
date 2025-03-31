import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider, Link } from 'react-router-dom';
import { Button, Space } from '@douyinfe/semi-ui';
import "@public/lib/reset.css";
import routers from "@src/options/Router.jsx";

function LayouFrame(props) {
  return (
    <>
      <Space>
        {routers.map((v) => (<Button key={v.path}><Link to={v.path}>{v.name}</Link></Button>))}
      </Space>
      <div>{props.children}</div>
      <hr />
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
const root = ReactDOM.createRoot(
  document.getElementById('app')
);

root.render(<RouterProvider router={router} />);