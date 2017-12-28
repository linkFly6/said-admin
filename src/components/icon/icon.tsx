import * as React from 'react'
import './icon.styl'
// class Icon extends React.Component<{}> {
//   render () {
//     return <i className={"icon saidiconfont icon-" + this.props.type}></i>;
//   }
// }

// export default Icon

let Icon = ({ type }: { type: string }) => <i className={'icon saidiconfont icon-' + type} />

export default Icon