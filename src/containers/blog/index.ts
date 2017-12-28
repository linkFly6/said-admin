import { connect } from 'react-redux'
import { actions } from '../../ducks/said-duck'
// import { saidType }  from  '../../constants'
import Index, { StateProps } from '../../views/blog'
import { bindActionCreators } from 'redux'

export default connect(/** mapStateToProps */)(Index)