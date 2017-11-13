import * as React from 'react'
import * as ReactDOM from 'react-dom'
import 'antd/dist/antd.css'
import './assets/fonts/iconfont'
import App from './views/App'
import { Provider } from 'react-redux'
import { BrowserRouter, Route } from 'react-router-dom'
import { createStore } from 'redux'
import { enthusiasm } from './reducers/index'
import { StoreState } from './types/index'

import './index.styl'

import Home from './views/home'
import Said from './views/said'

const store = createStore<StoreState>(enthusiasm, {
  enthusiasmLevel: 1,
  languageName: 'TypeScript',
})

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <div>
        <Route path="/" component={App} />
        <Route path="index" component={Home} />
        <Route path="said" component={Said} />
      </div>
    </BrowserRouter>
    {/* <App /> */}
  </Provider>,
  document.getElementById('root') as HTMLElement
)
