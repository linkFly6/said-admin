import * as React from 'react'
// import SaidEditor from '../../components/said-editor'
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