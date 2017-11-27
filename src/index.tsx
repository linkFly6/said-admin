import * as React from 'react'
import * as ReactDOM from 'react-dom'
import 'antd/dist/antd.css'
import './assets/fonts/iconfont'
import App from './views/App'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, HashRouter } from 'react-router-dom'
import { Router } from 'react-router'
import history from './assets/js/history'
import store from './ducks'
import { RouteComponentProps } from 'react-router-dom'

ReactDOM.render(
  <Provider store={store}>
    {/* <BrowserRouter>
      <Switch>
        <Route path="/" component={App} />
        <Route path="/login" component={Login} />
      </Switch>
    </BrowserRouter> */}
    <BrowserRouter>
      <Router history={history}>
        <App { ...({} as RouteComponentProps<any>) } />
      </Router>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root') as HTMLElement
)
