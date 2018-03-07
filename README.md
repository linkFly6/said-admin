# Said-Admin


感谢 [@Jemair](https://github.com/Jemair) 共同开发。

[Said](http://tasaid.com/) 的后台前端系统，使用技术：

- [react-scripts-ts](https://www.npmjs.com/package/react-scripts-ts)
- [react](https://reactjs.org/)
- [typescript](http://www.typescriptlang.org/)
- [antd](ant.design/docs/react/introduce-cn)
- [ducks](https://github.com/erikras/ducks-modular-redux)
- [stylus](http://stylus-lang.com/)


- markdown 解析引擎 - [marked](https://github.com/chjj/marked)/[remarkable](https://github.com/jonschlinkert/remarkable)/[remark](https://github.com/gnab/remark/wiki)
- 代码高亮引擎 - [prism](https://github.com/PrismJS/prism)/[highlight](https://github.com/isagalaev/highlight.js)
- 编辑器引擎 - [react-codemirror](https://github.com/JedWatson/react-codemirror)

## 开发

```bash
# yarn 目前有问题
npm i -d
npm run dev
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


## 约定和规范

- 后台登录失败返回的 `code` 统一为 `10000`
- 服务器无法处理的错误为 `1`
- 服务器错误在 `0` 以上，前端错误在 `0` 以下

### mbox

考虑到 `redux` 太恶心...使用了 `mbox`，使用起来非常方便。

1. 编写 `store` (src/store/xxx.ts)

```ts
import { observable, computed, observe, action } from 'mobx'
import { CategoryModel } from '../types/category'


export class CategoryStore {
  @observable categorys: CategoryModel[] = []

  @action.bound
  add(category: CategoryModel) {
    this.categorys.push(category)
  }
}
```

2. 在组件中引入 (src/view/xxx.tsx)：

```tsx
import { inject, observer } from 'mobx-react'

export interface StateProps {
  category: CategoryStore
}


@inject((allStores: any) => ({
  category: allStores.store.category
}))
@observer
export default class Index extends React.Component<StateProps> {
  constructor(props: StateProps) {
    super(props)
    // props.category => 指向的 category store
  }
}
```

无状态组件可以这样引入：

```tsx
// 无状态组件用这种方式绑定
export default inject('store')(observer(function ({ articles }: StateProps) {
}
```


### ~~redux(已废弃)~~

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

## 架构

字体：使用 [阿里巴巴图标库](http://www.iconfont.cn/) 和 CDN 在线加载。




## 开发 TODO

- 登录使用 `POST`
- 编辑日志/文章那里，要支持选择图片（从图库中选择图片），并且要支持粘贴图片
- 编辑内容支持查找文本(`codemirror`)
- ~~前台访问用 `cookie`，后台 + 前台管理员访问接口带 `token`， `token` 每次进行校验~~
- 图片列表要支持分页
- 静态文件处理(例如分类里面的小图片)
- 不同类型的图片不同的 url 处理（例如歌曲图片）
- 图片管理把普通用户的删除权限去掉（不显示删除按钮）
- 登录信息已失效要自动清 cookie 跳转到登录页
- 目前后台大部分接口都没有对数据字段做长度约束限制，后续会补上接口
- Home/管理员管理页/站点日志页
- 检查系统权限，没有权限的操作样式(按钮)都不做展现
- `initialValue` 的逻辑，具体参见 `src/components/songs/song-from.tsx` 的 `Form.create()` 代码
- `componentWillReceiveProps` 的逻辑处理，具体参见 `src/components/songs/song-from.tsx` 的 `componentWillReceiveProps()` 代码
- 重写 `hr` 的解析样式，浏览器默认样式太丑了
- 文章/日志列表页，点击列表项可以跳转到对应的文章落地页

## 其他

本仓库使用 `create-react-app` 脚手架生成，模板来自 [https://www.npmjs.com/package/react-scripts-ts](https://www.npmjs.com/package/react-scripts-ts)

## 版权

[Said](https://github.com/linkFly6/Said) 项目代码和内容均采用 [知识共享署名3.0 ( CC Attribution-NonCommercial )](https://creativecommons.org/licenses/by-nc/3.0/) 许可，并且 [Said](https://github.com/linkFly6/Said) 项目和代码还采用 [GPL](http://choosealicense.com/licenses/gpl-3.0/) 协议。

您必须遵循以下要求(包括但不局限于)：

 - 署名
 - 禁止商业演绎
 
 
 
 如果您希望特殊授权，请联系作者 [linkFly](mailto:linkFly6@live.com) 单独授权，则可以不必遵循以上授权协议。

