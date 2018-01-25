import * as React from 'react'
import { Card, Collapse, Icon, Modal, Upload } from 'antd'
import * as s from './index.styl'
import { inject, observer } from 'mobx-react'
import ImagesView from '../../components/images/images'
import { userReady } from '../../service/user'
import { AdminStore } from '../../store/admin'
import { ImageStore } from '../../store/image'

interface StateProps {
  admin: AdminStore,
  image: ImageStore,
}

@inject((allStores: any) => ({
  admin: allStores.store.admin,
  image: allStores.store.image,
}))
@observer
export default class ImageManager extends React.Component<StateProps> {
  state = {
  }

  // componentDidMount() { }
  render() {
    return (
      <div>
        <ImagesView
          imageType={0}
          token={this.props.admin.token}
          image={void 0 as any}
        />
      </div>
    )
  }
}
