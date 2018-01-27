import * as React from 'react'
import { Layout, Menu, Breadcrumb, Spin, message, Modal } from 'antd'
import * as s from './App.styl'
import Icon from '../components/icon/icon'
import { ClickParam } from 'antd/lib/menu'
import { BrowserRouter, Route, Router, Switch, withRouter, RouteComponentProps } from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { inject, observer } from 'mobx-react'
import { AdminStore } from '../store/admin'
import Home from './home'
import ImageManager from './others/images'
// import Said from './said'
import Said from '../views/said'
import SaidAdd from '../views/said/add-said'
import Blog from '../views/blog'
import BlogEdit from '../views/blog/edit'
import Category from '../views/category'
import { Returns } from '../models/returns'
import { userReady } from '../service/user'


const { SubMenu } = Menu
const { Header, Content, Sider } = Layout

interface State {
  current: string
  openKeys: string[]
  routePaths: string[]
  isLogin: boolean
}

export interface StateProps {
  admin: AdminStore
}


const Routers = (props: { isLogin: boolean, pathname: string }) => {
  if (props.isLogin) {
    // 加这个动画就会导致所有 Route 的 componentDidMount/componentWillMount 执行两次
    // 详情参见这里：https://github.com/reactjs/react-transition-group/issues/79
    // return (
    //   <TransitionGroup>
    //     <CSSTransition
    //       key={props.pathname}
    //       timeout={{ enter: 500, exit: 0 }}
    //       exit={false}
    //       classNames="router-animate-fade"
    //     >
    //       <div className={s.routers}>
    //         <Switch>
    //           <Route path="/" component={Home} exact />
    //           <Route path="/index" component={Home} exact />
    //           <Route path="/said" component={Said} exact />
    //           <Route path="/said/add" component={SaidAdd} exact />
    //           <Route path="/others/images" component={ImageManager} exact />
    //           <Route path="/blog" component={Blog} exact />
    //           <Route path="/blog/edit/:id" component={BlogEdit} exact />
    //           <Route path="/blog/add" component={BlogEdit} exact />
    //           <Route path="/category" component={Category} exact />
    //         </Switch>
    //       </div>
    //     </CSSTransition>
    //   </TransitionGroup>)
    return (
      <div className={s.routers}>
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/index" component={Home} exact />
          <Route path="/said" component={Said} exact />
          <Route path="/said/add" component={SaidAdd} exact />
          <Route path="/others/images" component={ImageManager} exact />
          <Route path="/blog" component={Blog} exact />
          <Route path="/blog/edit/:id" component={BlogEdit} exact />
          <Route path="/blog/add" component={BlogEdit} exact />
          <Route path="/category" component={Category} exact />
        </Switch>
      </div>
    )
  } else {
    return (
      <div className={s.loginLoading}>
        <Spin size="large" />
      </div>
    )
  }
}


@withRouter
@inject((allStores: any) => ({
  admin: allStores.store.admin
}))
@observer
export default class App extends React.Component<RouteComponentProps<{}> & StateProps, State> {
  state = {
    current: '1',
    openKeys: ['said'],
    routePaths: ['said'],
    isLogin: false
  }

  constructor(props: RouteComponentProps<{}> & StateProps) {
    super(props)
    // setTimeout(() => {
    //   this.setState({
    //     isLogin: true
    //   })
    // }, 2000)
  }

  componentWillMount() {
    this.login()
  }


  componentWillReceiveProps() {
    // console.log(this.props.location)
  }


  async login() {
    const loginValue = await userReady()
    if (loginValue === 0) {
      this.setState({
        isLogin: true
      })
    } else {
      this.setState({
        isLogin: false
      })
    }
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
    if (latestOpenKey) {
      this.setState({ openKeys: [latestOpenKey] })
    }
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
            <Content style={{ background: '#fff', padding: 24, margin: 0, position: 'relative' }}>
              {
                <Routers isLogin={this.state.isLogin} pathname={this.props.location.key as any} />
              }
              {/* </Router> */}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    )
  }
}

// export default withRouter(connect()(App as any))
