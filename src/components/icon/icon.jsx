import React from 'react';
import './Icon.scss'
// class Icon extends Component {
//   render() {
//     return <i className={"icon saidiconfont icon-" + this.props.type}></i>;
//   }
// }

// export default Icon;

let Icon = ({ type }) => <i className={"icon saidiconfont icon-" + type}></i>;

Icon.propTypes = {
  type: React.PropTypes.string.isRequired
}

export default Icon