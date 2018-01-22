import * as React from 'react'
// import SaidEditor from '../../components/said-editor'
import SaidEditor from '../../components/said-editor/editor'
import { inject, observer } from 'mobx-react'

export interface StateProps { }

@inject('store')
@observer
class AddSaid extends React.Component<StateProps> {
  handleChangeContext = (text: string) => {
    console.log(text)
  }
  render() {
    return (
      <div>
        <SaidEditor onChange={this.handleChangeContext} />
      </div>
    )
  }
}

export default AddSaid