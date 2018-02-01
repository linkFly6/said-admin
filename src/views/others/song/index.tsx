import * as React from 'react'
import { Icon, Modal, Radio } from 'antd'
import * as s from './song.styl'
import { inject, observer } from 'mobx-react'
import { SongComponent } from '../../../components/songs/song'
import { AdminStore } from '../../../store/admin'
import { SongModel } from '../../../types/song'

interface StateProps {
  admin: AdminStore,
}

interface ComponentState {
}

@inject((allStores: any) => ({
  admin: allStores.store.admin,
}))
@observer
export default class SongManage extends React.Component<StateProps, ComponentState> {
  state: ComponentState = {
  }

  render() {
    return (
      <div className={`${s.view} ${s.songManage}`}>
        <div>
          <SongComponent
            songStore={undefined as any}
            adminStore={undefined as any}
          // mode="select"
          // onSelect={this.handleSelect}
          />
        </div>
      </div>
    )
  }
}
