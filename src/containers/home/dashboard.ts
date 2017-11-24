// redux 将 UI 层分为容器组件和展示组件，容器组件处理数据，展示组件负责展现数据，改动 UI 的时候只会影响到展示组件

import { connect } from 'react-redux'
import { actions } from '../../ducks/said-duck'
// import { saidType }  from  '../../constants'
import Index, { StateProps } from '../../views/said'
import { bindActionCreators } from 'redux'

/*
  connect方法接受两个参数： mapStateToProps 和 mapDispatchToProps 。它们定义了 UI 组件的业务逻辑。
  前者负责输入逻辑，即将state映射到 UI 组件的参数（props）。
  后者负责输出逻辑，即将用户对 UI 组件的操作映射成 Action
 */

// 建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
const mapStateToProps = (state: StateProps) => ({
  articles: state.articles
})



// function mapDispatchToProps(dispatch: any) {
//   return bindActionCreators(actions, dispatch)
// }
// concat() 函数的第二个参数，可以在这里做一些特殊的逻辑处理，默认情况下用不到
// const mapDispatchToProps = (
//   dispatch,
//   ownProps // 容器组件的 props 对象
// ) => {
//   // 应该返回一个对象，该对象的每个键值对都是一个映射，定义了 UI 组件的参数怎样发出 Action
//   return {
//     add: (data) => {
//       dispatch({
//         type: saidType.ADD_LIST,
//         payload: data
//       });
//     }
//   };
// }

export default connect(mapStateToProps)(Index)