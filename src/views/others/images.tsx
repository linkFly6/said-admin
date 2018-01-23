import * as React from 'react'
import { Card, Collapse, Icon, Modal, Upload } from 'antd'
import * as s from './index.styl'
import { inject, observer } from 'mobx-react'
import ImagesView from '../../components/images/images'

interface StateProps {

}

@inject('store')
@observer
export default class ImageManager extends React.Component<StateProps> {
  state = {
  }

  // componentDidMount() { }

  render() {
    return (
      <div>
        <ImagesView imageType={0} />
      </div>
    )
  }
}
