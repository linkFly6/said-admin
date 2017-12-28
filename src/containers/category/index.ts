import { connect } from 'react-redux'
import { actions } from '../../ducks/category-duck'
import Index, { StateProps } from '../../views/category'

const mapStateToProps = (state: StateProps) => ({
  categorys: state.categorys
})

export default connect(mapStateToProps)(Index)