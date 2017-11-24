// redux 将 UI 层分为容器组件和展示组件，容器组件处理数据，展示组件负责展现数据，改动 UI 的时候只会影响到展示组件

import { connect } from 'react-redux'
import { actions } from '../../ducks/said-duck'
// import { saidType }  from  '../../constants'
import Index, { StateProps } from '../../views/blog/add-blog'
import { bindActionCreators } from 'redux'

export default connect(/** mapStateToProps */)(Index)