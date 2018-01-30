import * as React from 'react'
import { Icon, Modal, Radio } from 'antd'
import * as s from './song.styl'
import { inject, observer } from 'mobx-react'
import SongComponent from '../../../components/songs/song'
import { userReady } from '../../../service/user'
import { AdminStore } from '../../../store/admin'
import { ImageStore } from '../../../store/image'
import { ImageType, getUserImageTypeTexts, hasImageType } from '../../../types/image'
import { Store } from '../../../service/utils/store'
import { isEmptyObject } from '../../../service/utils'

const store = new Store('other.view.song')

const IMAGETYPESTOREKEY = 'song'

interface StateProps {
  admin: AdminStore,
  image: ImageStore,
}

interface ComponentState {
  imageTypes: { [prop: number]: string },
  selectImageType: string | undefined,
}

@inject((allStores: any) => ({
  admin: allStores.store.admin,
  image: allStores.store.image,
}))
@observer
export default class SongManage extends React.Component<StateProps, ComponentState> {
  state: ComponentState = {
    imageTypes: {},
    selectImageType: void 0,
  }

  componentWillMount() {
    const imagetypes = getUserImageTypeTexts(this.props.admin.rule)
    let selectImageType: string | undefined = void 0
    if (imagetypes) {
      selectImageType = store.has(IMAGETYPESTOREKEY) ?
        // Radio.Group 的 value 要求是 string 类型的
        store.val<string>(IMAGETYPESTOREKEY) + '' : void 0
      // 如果无法在图片的权限列表中找到对应的图片类型，则默认取列表中第一个
      if (!selectImageType || !hasImageType(selectImageType, imagetypes)) {
        selectImageType = Object.keys(imagetypes)[0]
        // 因为 store 中的值已经失效了，所以删除掉这个 key
        store.delete(IMAGETYPESTOREKEY)
      }
      // 赋值，如果没有走到这一步会显示无数据加载
      this.setState({
        imageTypes: imagetypes,
        selectImageType,
      })
    }
  }

  handleImageTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (hasImageType(value)) {
      store.val('imagetype', value)
      this.setState({
        selectImageType: e.target.value
      })
    }
  }
  render() {
    if (this.state.selectImageType == null) {
      return (
        <div className={`${s.view} ${s.imageManage} ${s.empty}`}>
          没有加载到数据 (empty)
        </div>
      )
    }
    return (
      <div className={`${s.view} ${s.imageManage}`}>
        <div>
          <SongComponent
            songStore={undefined as any}
            adminStore={undefined as any}
          />
        </div>
      </div>
    )
  }
}
