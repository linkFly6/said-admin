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
import Article from '../views/article'
import ArticleEdit from '../views/article/edit'
import Blog from '../views/blog'
import BlogEdit from '../views/blog/edit'
import Category from '../views/others/category'
import Song from '../views/others/song'
import { Returns } from '../models/returns'

import { userReady } from '../service/user'
import { PageLoading } from '../components/common'
import { AdminRule } from '../types/admin'


const { SubMenu } = Menu
const { Header, Content, Sider } = Layout

interface ComponentStates {
  /**
   * 当前选中的子项
   */
  current: string
  /**
   * 展开的父菜单列表
   */
  openKeys: string[]
  // routePaths: string[]

  /**
   * 是否登录，决定了是否渲染子页面
   */
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
          <Route path="/article" component={Article} exact />
          <Route path="/article/add" component={ArticleEdit} exact />
          <Route path="/article/edit/:id" component={ArticleEdit} exact />
          <Route path="/blog" component={Blog} exact />
          <Route path="/blog/edit/:id" component={BlogEdit} exact />
          <Route path="/blog/add" component={BlogEdit} exact />
          <Route path="/others/images" component={ImageManager} exact />
          <Route path="/others/song" component={Song} exact />
          <Route path="/others/category" component={Category} exact />
        </Switch>
      </div>
    )
  } else {
    return (
      <PageLoading />
    )
  }
}


@withRouter
@inject((allStores: any) => ({
  admin: allStores.store.admin
}))
@observer
export default class App extends React.Component<RouteComponentProps<{}> & StateProps, ComponentStates> {
  state: ComponentStates = {
    current: '1',
    openKeys: ['said'],
    // routePaths: ['said'],
    isLogin: false
  }

  // constructor(props: RouteComponentProps<{}> & StateProps) {
  //   super(props)
  //   // setTimeout(() => {
  //   //   this.setState({
  //   //     isLogin: true
  //   //   })
  //   // }, 2000)
  // }

  componentWillMount() {
    this.setMenu(this.props)
    this.login()
  }


  componentWillReceiveProps(nextProps: RouteComponentProps<{}> & StateProps) {
    this.setMenu(nextProps)
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

  /**
   * 路由切换的时候定位对应的菜单
   */
  setMenu = (props: RouteComponentProps<{}>) => {
    const pathName = props.location.pathname
    const keys = pathName.split('/')
    // 如果是 /said/blog 的路径，最前面带 / 的
    if (!keys[0]) {
      keys.shift()
    }
    this.setState({
      current: pathName,
      openKeys: [keys[0]],
    })
  }

  handleClick = (e: ClickParam) => {
    this.props.history.push(e.key)
    // let routePaths = e.key.split('/')

    // if (!routePaths[0]) {
    //   routePaths.shift()
    // }
    // this.setState({
    //   routePaths
    // })
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
              <Menu.Item key="/home">
                <Icon type="homepagenormal" />首页
              </Menu.Item>
              {
                this.state.isLogin && this.props.admin.hasRule(AdminRule.SAID) ?
                  <SubMenu key="article" title={<span><Icon type="article" />听说管理</span>}>
                    <Menu.Item key="/article"><Icon type="rizhi11" />听说概况</Menu.Item>
                    <Menu.Item key="/article/add"><Icon type="bianxie" />添加听说</Menu.Item>
                  </SubMenu> : null
              }
              {
                this.state.isLogin && this.props.admin.hasRule(AdminRule.BLOG) ?
                  <SubMenu key="blog" title={<span><Icon type="screen" />日志管理</span>}>
                    <Menu.Item key="/blog"><Icon type="rizhi11" />日志概况</Menu.Item>
                    <Menu.Item key="/blog/add"><Icon type="bianxie" />添加日志</Menu.Item>
                  </SubMenu> : null
              }
              <SubMenu key="others" title={<span><Icon type="guanli" />其他管理</span>}>
                <Menu.Item key="/others/images"><Icon type="tupian" />图片管理</Menu.Item>
                {
                  this.state.isLogin && this.props.admin.hasRule(AdminRule.SAID) ?
                    <Menu.Item key="/others/song"><Icon type="icon14" />音乐管理</Menu.Item> : null
                }
                {
                  this.state.isLogin && this.props.admin.hasRule(AdminRule.BLOG) ?
                    <Menu.Item key="/others/category"><Icon type="biaoqian" />分类管理</Menu.Item> : null
                }
              </SubMenu>
              {/* {
                this.state.isLogin && this.props.admin.hasRule(AdminRule.GLOBAL) ?
                  <SubMenu key="site" title={<span><Icon type="diannao" />站点管理</span>}>
                    <Menu.Item key="8"><Icon type="tongji" />访问概况</Menu.Item>
                    <Menu.Item key="9"><Icon type="fenlei" />站点日志</Menu.Item>
                  </SubMenu> : null
              } */}

            </Menu>
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
            <Breadcrumb className={s.appBreadcrumb}>
              {
                // this.state.routePaths.map((path: string) => {
                //   return <Breadcrumb.Item key={path}>{path}</Breadcrumb.Item>
                // })
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
