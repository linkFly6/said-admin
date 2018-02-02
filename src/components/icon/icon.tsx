import * as React from 'react'
import './icon.styl'
// class Icon extends React.Component<{}> {
//   render () {
//     return <i className={"icon saidiconfont icon-" + this.props.type}></i>;
//   }
// }

// export default Icon

export const SaidIcon = (props: { type: string, children?: React.ReactNode | null }) => {

  return (
    <i className={'icon saidiconfont icon-' + props.type} >
      {props.children}
    </i>
  )
}

export default SaidIcon