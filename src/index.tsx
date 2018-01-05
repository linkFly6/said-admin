import * as React from 'react'
import * as ReactDOM from 'react-dom'
import 'antd/dist/antd.css'
import './assets/fonts/iconfont.css'
import { LocaleProvider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import App from './views/App'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, HashRouter } from 'react-router-dom'
import { Router, Switch } from 'react-router'
import history from './assets/js/history'
import store from './ducks'
import Login from './containers/home/login'

ReactDOM.render(
  <LocaleProvider locale={zhCN}>
    <Provider store={store}>
      {/* <BrowserRouter>
      <Switch>
        <Route path="/" component={App} />
        <Route path="/login" component={Login} />
      </Switch>
    </BrowserRouter> */}
      <BrowserRouter>
        <Router history={history}>
          <Switch>
            {/* <App { ...({} as RouteComponentProps<any>) } /> */}
            <Route path="/login" component={Login}/>
            <Route path="/" component={App}/>
          </Switch>
        </Router>
      </BrowserRouter>
    </Provider>
  </LocaleProvider>,
  document.getElementById('root') as HTMLElement
)
