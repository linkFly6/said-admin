import * as React from 'react'
import { Layout, Menu, Breadcrumb } from 'antd'
import * as s from './App.styl'
import Icon from '../components/icon/icon'
import { ClickParam } from 'antd/lib/menu'
import { connect } from 'react-redux'
import { BrowserRouter, Route, Router, Switch, withRouter, RouteComponentProps } from 'react-router-dom'

import Home from './home'
import { Images } from './others'
// import Said from './said'
import Said from '../views/said'
import SaidAdd from '../views/said/add-said'
import Blog from '../views/blog'
import BlogAdd from '../views/blog/add-blog'
import Category from '../views/category'


const { SubMenu } = Menu
const { Header, Content, Sider } = Layout

@withRouter
export default class App extends React.Component<RouteComponentProps<{}>, object> {
  state = {
    current: '1',
    openKeys: ['said'],
    routePaths: ['said'],
  }
  componentWillReceiveProps() {
    // console.log(this.props.location)
  }

  handleClick = (e: ClickParam) => {

    this.props.history.push(e.key)
    let routePaths = e.key.split('/')
    // 如果是 /said/blog 的路径
    if (!routePaths[0]) {
      routePaths.shift()
    }
    this.setState({
      current: e.key,
      routePaths
    })
  }
  onOpenChange = (openKeys: string[]) => {
    const state = this.state
    const latestOpenKey = openKeys.find(key => !~state.openKeys.indexOf(key))
    this.setState({ openKeys: [latestOpenKey] })
  }
  render() {
    return (
      <Layout className={s.app}>
        <Header>
          <Menu
            theme="dark"
            mode="horizontal"
            style={{ lineHeight: '64px' }}
          />
        </Header>
        <Layout>
          <Sider width={200} style={{ background: '#fff' }} trigger={null}>
            <Menu
              mode="inline"
              theme="dark"
              openKeys={this.state.openKeys}
              selectedKeys={[this.state.current]}
              onOpenChange={this.onOpenChange}
              onClick={this.handleClick}
              style={{ height: '100%' }}
            >
              <SubMenu key="said" title={<span><Icon type="article" />Said 管理</span>}>
                <Menu.Item key="/said"><Icon type="rizhi11" />Said 概况</Menu.Item>
                <Menu.Item key="/said/add"><Icon type="bianxie" />添加 Said</Menu.Item>
              </SubMenu>
              <SubMenu key="blog" title={<span><Icon type="screen" />日志管理</span>}>
                <Menu.Item key="/blog"><Icon type="rizhi11" />Blog 管理</Menu.Item>
                <Menu.Item key="/blog/add"><Icon type="bianxie" />添加 Blog</Menu.Item>
              </SubMenu>
              <SubMenu key="other" title={<span><Icon type="guanli" />其他管理</span>}>
                <Menu.Item key="/others/images"><Icon type="tupian" />图片管理</Menu.Item>
                <Menu.Item key="6"><Icon type="icon14" />音乐管理</Menu.Item>
                <Menu.Item key="/category"><Icon type="biaoqian" />分类管理</Menu.Item>
              </SubMenu>
              <SubMenu key="site" title={<span><Icon type="diannao" />站点管理</span>}>
                <Menu.Item key="8"><Icon type="tongji" />访问概况</Menu.Item>
                <Menu.Item key="9"><Icon type="fenlei" />站点日志</Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
            <Breadcrumb className={s.appBreadcrumb}>
              {
                this.state.routePaths.map((path: string) => {
                  return <Breadcrumb.Item key={path}>{path}</Breadcrumb.Item>
                })
              }
            </Breadcrumb>
            <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
              {/* <Router history={history}> */}
              <Switch>
                <Route path="/" component={Home} exact />
                <Route path="/index" component={Home} exact />
                <Route path="/said" component={Said} exact />
                <Route path="/said/add" component={SaidAdd} exact />
                <Route path="/others/images" component={Images} exact />
                <Route path="/blog" component={Blog} exact />
                <Route path="/blog/add" component={BlogAdd} exact />
                <Route path="/category" component={Category} exact />
              </Switch>
              {/* </Router> */}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    )
  }
}

// export default withRouter(connect()(App as any))
