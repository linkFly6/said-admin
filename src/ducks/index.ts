/*
  辅助函数的作用是，把一个由多个不同 reducer 函数作为 value 的 object，合并成一个最终的 reducer 函数，然后就可以对这个 reducer 调用 createStore
 */
import { combineReducers } from 'redux'
import articles from './said-duck'
import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'

// Store 收到 Action 以后，必须给出一个新的 State，这样 View 才会发生变化。这种 State 的计算过程就叫做 Reducer，返回的 key 为组件的 state， value 为计算动作的 reducer
// reducer 生成的是属性(数据)
const reducer = combineReducers({
  articles // 这里的
})

declare let window: { __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: (middlewares: any) => any }

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
  reducer,
  process.env.NODE_ENV === 'production' ?
    applyMiddleware(
      thunkMiddleware
    ) :
    // chrome 插件: redux-devtools-extension => https://github.com/zalmoxisus/redux-devtools-extension
    composeEnhancers(
      applyMiddleware(
        thunkMiddleware
      )
    )
)

export default store