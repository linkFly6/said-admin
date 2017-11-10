import * as React from 'react';
import './App.styl';
import Hello from './components/Hello';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const logo = require('./logo.svg');

export default class App extends React.Component<{}, object> {
  state = {
    current: '1',
    openKeys: ['said'],
    collapsed: true,
  };
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  render() {
    return (
      // <div className="app">
      //   <div className="app-header">
      //     <img src={logo} className="app-logo" alt="logo" />
      //     <h2>Welcome to React</h2>
      //   </div>
      //   <p className="app-intro">
      //     To get started, edit <code>src/App.tsx</code> and save to reload.
      //   </p>
      //   <Hello name="TypeScript" />
      // </div>
      <Layout>
        <Sider
          trigger={null}
          // tslint:disable-next-line:jsx-boolean-value
          collapsed={this.state.collapsed}
        >
          <div className="logo" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">
              <Icon type="user" />
              <span>nav 1</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="video-camera" />
              <span>nav 2</span>
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="upload" />
              <span>nav 3</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <Icon
              className="trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
          </Header>
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
            Content
        </Content>
        </Layout>
      </Layout>
    );
  }
}
