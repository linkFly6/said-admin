# Said-Admin


感谢 [@Jemair](https://github.com/Jemair) 共同开发。

[Said](http://tasaid.com/) 的后台前端系统，使用技术：

- [react-scripts-ts](https://www.npmjs.com/package/react-scripts-ts)
- [react](https://reactjs.org/)
- [typescript](http://www.typescriptlang.org/)
- [antd](ant.design/docs/react/introduce-cn)
- [ducks](https://github.com/erikras/ducks-modular-redux)
- [stylus](http://stylus-lang.com/)


## 开发

```bash
# yarn 目前有问题
npm i -d
npm start
```

- Said 模块 [@Jemair](https://github.com/Jemair)
  - 列表
  - 添加/修改
  - 图片管理
  - 音乐管理
- Blog 模块 [@linkFly](https://github.com/linkFly6)
  - 列表
  - 添加/修改
  - 分类管理 (标签待定开发)
  - 首页


### redux

想要在 `view` 引入 `redux` 目前关联项比较多（虽然引入 `ducks` 已经统一了很多关联项），后续会持续优化这个环节，先踩坑再跳坑。

以下步骤介绍了如何在 `view` 中引入 `redux`。

1. 编写 `type(model)` (src/types/tag.ts)

```ts
export interface CategoryModel {
  _id: string
  /**
   * 分类 icon 文件名
   */
  icon: string
  /**
   * 分类名
   */
  name: string
}
```

2. 编写 `ducks` (src/ducks/tag.ts)

```ts
import { TagModel } from '../types/category-duck.ts'

/*
 redux 围绕 actionTypes/actions/reducer 进行工作，但是拆开之后样板文件太多了
 所以这里采用 ducks 设计：https://github.com/erikras/ducks-modular-redux
*/

// actionTypes
import { CategoryModel } from '../types/category'


// action type
export const constants = {
  ADD: 'CATEGORY/ADD',
  UPDATE: 'CATEGORY/UPDATE',
  LOAD: 'CATEGORY/LOAD',
  REMOVE: 'CATEGORY/REMOVE',
}

// actions data model
export interface ActionModel<T> {
  type: typeof constants.ADD,
  payload: T,
  error: boolean | null,
  meta: string,
}


// actions interface
export interface DispatchProps {
  add(item: CategoryModel): ActionModel<CategoryModel>
}

// actions
export const actions: DispatchProps = {
  // 社区规范参见这里：https://github.com/acdlite/flux-standard-action
  add: (item: CategoryModel): ActionModel<CategoryModel> => ({
    type: constants.ADD,
    // 数据载体， containers 中的容器组件会 dispatch 数据到这里（也就是 item）
    payload: item,
    error: false, // error 的情况下为 true，并且 payload 为 Error 数据
    meta: 'meta'
  }),
}


const initialState: CategoryModel[] = [] // default data

// reducer
export default function (
  state: CategoryModel[] = initialState,
  action: ActionAdd<CategoryModel>
  ) {
  switch (action.type) {
    case constants.ADD: {
      return [
        ...state,
        action.payload
      ]
    }
    case constants.UPDATE:
      break
    case constants.LOAD:
      break
    case constants.REMOVE:
      break
    default:
      break
  }
  return state
}

```

注意这些 `export` 后续都是要用到的。


3. 在 `ducks` 入口加入新增的 `module` (src/ducks/index.ts)

```ts
import { combineReducers } from 'redux'
import categorys from './category-duck'
import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'

const reducer = combineReducers({
  // 在这里加入 module
  categorys,
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
```

4. 编写容器组件 `containers` (src/containers/category)

```ts
import { connect } from 'react-redux'
import { actions } from '../../ducks/category-duck'
// 注意这里的 StateProps 是从 View 来的
import Index, { StateProps } from '../../views/category'

const mapStateToProps = (state: StateProps) => ({
  categorys: state.categorys
})

export default connect(mapStateToProps)(Index)
```

5. 在 `components` 里面引用

```tsx
import * as React from 'react'
import { DispatchProp } from 'react-redux'
import { Button, Table } from 'antd'
import { FormItemProps } from 'antd/lib/form/FormItem'
import { CategoryModel } from '../../types/category'
import * as duckCategory from '../../ducks/category-duck'


const columns = [
  {
    title: 'Icon',
    dataIndex: 'icon',
    key: 'icon',
  }, {
    title: '分类',
    dataIndex: 'name',
    key: 'name',
  }
]

// 这里 export 是因为 StateProps 最贴近 view
export interface StateProps {
  categorys: CategoryModel[],
}


class Index extends React.Component<DispatchProp<duckCategory.DispatchProps>> {

  handleAddCategory = () => {
    if (this.props.dispatch) {
      /**
       * 也可以 import store from '../../ducks'
       * 然后通过 store.dispatch(duckCategory.actions.add({})) 来 dispatch redux
       **/
      this.props.dispatch(duckCategory.actions.add({
        _id: Math.random().toString(),
        name: 'this is name',
        icon: 'this is icon',
      }))
    }
  }

  render() {
    return (
      <div>
        <Button onClick={this.handleAddCategory}>新增</Button>
        <Table
          columns={columns}
          dataSource={this.props.categorys}
          bordered={true}
        />
      </div>
    )
  }
}

export default Index
```

## 请求架构

待定




## 开发 TODO

- 前台访问用 `cookie`，后台 + 前台管理员访问接口带 `token`， `token` 每次进行校验


## 开发计划

- 访问量/阅读量/浏览量：通过 `log` 文件定期收集(例如 10min)

## 版权

[Said](https://github.com/linkFly6/Said) 项目代码和内容均采用 [知识共享署名3.0 ( CC Attribution-NonCommercial )](https://creativecommons.org/licenses/by-nc/3.0/) 许可，并且 [Said](https://github.com/linkFly6/Said) 项目和代码还采用 [GPL](http://choosealicense.com/licenses/gpl-3.0/) 协议。

您必须遵循以下要求(包括但不局限于)：

 - 署名
 - 禁止商业演绎
 
 
 
 如果您希望特殊授权，请联系作者 [linkFly](mailto:linkFly6@live.com) 单独授权，则可以不必遵循以上授权协议。

