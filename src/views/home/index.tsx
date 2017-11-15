import * as React from 'react'
import { connect, DispatchProp } from 'react-redux'
import { actions, DispatchProps } from '../../ducks/dashboard'
import { LogFileModel } from '../../types/dashboard'
import { Dispatch } from 'redux'

interface StateProps {
  logFiles: LogFileModel[],
}


// @connnet 的 *.d.ts 是 ts2.4 的，项目用的 ts2.6，mmp 2.6 对参数做了强校验
// @connect<StateProps, DispatchProps, any>(mapStateToProps, mapDispatchToProps)
export default class extends React.Component<StateProps & DispatchProps> {
  render() {
    return (
      <div>
        简单的页面 index
      </div>
    )
  }
}