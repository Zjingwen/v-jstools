import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider, Link } from 'react-router-dom';
import { Layout, Button, Space } from '@douyinfe/semi-ui';
import "@public/lib/reset.css";
import routers from "@src/options/Router.jsx";

const { Header, Content } = Layout;
function LayouFrame(props) {
  const contentStyle = {
    padding: '24px',
    backgroundColor: 'var(--semi-color-bg-0)',
  }
  return (
    <Layout>
      <Header>
        <Space>
          {routers.map((v) => (<Button key={v.path}><Link to={v.path}>{v.name}</Link></Button>))}
        </Space>
      </Header>
      <Content style={contentStyle}>{props.children}</Content>
    </Layout >
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