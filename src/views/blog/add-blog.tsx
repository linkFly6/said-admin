import * as React from 'react'
// import SaidEditor from '../../components/said-editor'
import { Table, Button } from 'antd'
import SaidEditor from '../../components/said-editor/editor'


export interface StateProps { }

class AddSaid extends React.Component<StateProps> {
  render() {
    return (
      <div>
        <SaidEditor />
      </div>
    )
  }
}

export default AddSaid