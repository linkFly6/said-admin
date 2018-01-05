import * as React from 'react'
// import SaidEditor from '../../components/said-editor'
import SaidEditor from '../../components/said-editor/editor'
import { inject, observer } from 'mobx-react'

export interface StateProps { }


@observer
@inject('store')
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