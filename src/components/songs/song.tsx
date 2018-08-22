import * as React from 'react'
import {
  Icon,
  Popconfirm,
  Upload,
  Modal,
  message,
  Progress,
  Spin,
  Card,
  Form,
  Row,
  Col,
  Input,
  Button,
} from 'antd'
import { FormComponentProps } from 'antd/lib/form/Form'
import * as s from './song.styl'
import { acceptMimetypes } from '../../types/song'
import { UploadChangeParam } from 'antd/lib/upload'
import { userReady } from '../../service/user'
import { inject, observer } from 'mobx-react'
import { List } from 'immutable'
import { SongStore } from '../../store/song'
import { SongModel } from '../../types/song'
import { Store } from '../../service/utils/store'
import { ImageModel, ImageType } from '../../types/image'
import SongForm, { saveCache, hasCache } from './song-from'
import { PageLoading } from '../common'
import { AdminStore } from '../../store/admin'
import { parseTime, parseBit } from '../../service/utils/format'
import { Player } from '../../models/player'
import { SongGrid } from './song-grid'




interface StateProps {
  songStore: SongStore,
  adminStore: AdminStore,
  /**
   * 模式，默认 "view" 是普通页面模式，支持上传和管理音乐资源
   * "select" 模式只支持选择音乐（每次点击都会触发 onSelect 事件）
   */
  mode?: 'view' | 'select',
  /**
   * "select" 模式下每次选择音乐触发的事件
   */
  onSelect?: (image: SongModel) => void,
  /**
   * "select" 模式下，默认选中的图片(ID)
   */
  selectSong?: SongModel | null
}


const UploadProgress = (props: {
  isUploading: boolean,
  percent: number,
}) => {
  if (props.isUploading && props.percent < 100) {
    return (
      <Progress type="circle" percent={props.percent} />
    )
  }
  if (props.isUploading && props.percent >= 100) {
    return (
      <div>
        {/* <Icon type={'loading'} className={s.iconUpload} /> */}
        <Spin size="large" className={s.iconUpload} />
        <div className="ant-upload-text">处理中</div>
      </div>
    )
  }
  return (
    <div>
      <Icon type={'upload'} className={s.iconUpload} />
      <div className="ant-upload-text">点击或拖拽音频文件上传</div>
    </div>
  )
}


interface ComponentState {
  uploading: boolean,
  percent: number,
  /**
   * 添加音乐详情信息的表单弹窗是否显示
   */
  addModalVisible: boolean,
  loadingList: boolean,
  /**
   * 正在播放中的音乐
   */
  playSong: SongModel | null,
  deleteList: List<string>,
  /**
   * 正在（添加）的歌曲对象
   */
  song: SongModel | null,

  /**
   * "select" 模式下默认被选中的歌曲
   */
  selectSong: SongModel | null,
  /**
   * 音乐播放器对象
   */
  readonly player: Player
}

@inject((allStores: any) => ({
  adminStore: allStores.store.admin,
  songStore: allStores.store.song,
}))
@observer
export class SongComponent extends React.Component<StateProps, ComponentState> {
  state: ComponentState = {
    // 是否正在上传
    uploading: false,
    // 上传进度
    percent: 0,
    addModalVisible: false,
    playSong: null,
    selectSong: null,
    deleteList: List<string>(),
    loadingList: false,
    song: null,
    // 音乐播放器对象
    player: new Player()
  }

  /**
   * constructor 中不允许操作 state
   */
  componentWillMount() {
    // 试听的歌曲播放完毕后清掉播放状态
    this.state.player.onEnded(() => {
      this.setState({
        playSong: null
      })
    })
    this.load()
  }

  /**
   * 尽量晚一点判断 props，防止 props 没有 ready
   */
  componentDidMount() {
    // 如果用 props 则对渲染性能影响太大，所以自己监听 props 再设置 state
    if (this.props.selectSong) {
      this.setState({
        selectSong: this.props.selectSong,
      })
    }
  }

  /**
   * props 改变，会触发的生命周期
   * @param nextProps 
   */
  componentWillReceiveProps(nextProps: StateProps) {
    /**
     * 如果传入了初始默认被选择的歌曲，则更新这个默认值
     */
    if (nextProps.selectSong) {
      this.state.player.stop()
      this.setState({
        selectSong: nextProps.selectSong,
        playSong: null,
      })
    }
  }

  load() {
    // 如果有待编辑的歌曲，就弹窗让继续编辑
    if (hasCache()) {
      this.setState({
        addModalVisible: true,
      })
    }
    this.setState({
      loadingList: true
    })
    this.props.songStore.query().then(returns => {
      this.setState({
        loadingList: false,
      })
    })
  }

  /**
   * 上传功能
   */
  handleRequest = (option: any) => {
    this.setState({
      uploading: true,
      percent: 0,
    })
    // const intervalId = setInterval(() => {
    //   if (this.state.percent === 100) {
    //     clearInterval(intervalId)
    //   }
    //   this.setState({
    //     percent: this.state.percent + 10
    //   })
    // }, 1000)
    // if (1 === 1) return
    this.props.songStore.upload({
      file: option.file,
    }, {
        onProgress: (e) => {
          // 表示上传进度是否可用
          if (e.lengthComputable) {
            // loaded 表示已上传字节， total 为总数
            this.setState({
              percent: Math.round(e.loaded / e.total * 100)
            })
          }
        }
      }).then(returns => {
        this.setState({
          uploading: false,
          percent: 0,
        })
        if (!returns.check()) {
          message.error(`${returns.message}${returns.code == null ? '' : `(${returns.code})`}`)
          return
        }
        message.success('上传成功')
        saveCache(returns.data)
        this.setState({
          addModalVisible: true,
          song: returns.data,
        })
      })
  }

  /**
   * 播放音乐
   */
  handleSongPlay = (song: SongModel) => {
    this.state.player.play(song.url)
    this.setState({
      playSong: song,
    })
  }
  /**
   * 音乐暂停播放
   */
  handleSongPause = (song: SongModel) => {
    this.state.player.stop()
    this.setState({
      playSong: null
    })
  }

  /**
   * 删除音乐
   */
  handleSongDelete = (song: SongModel) => {
    const update: any = {
      deleteList: this.state.deleteList.push(song._id)
    }
    // 如果被删除的歌曲正在播放，则停止播放
    if (this.state.playSong && this.state.playSong._id === song._id) {
      this.state.player.stop()
      update.playSong = null
    }
    this.setState(update)

    this.props.songStore.deleteSongToList(song._id).then(returns => {
      if (returns.success) {
        const index = this.state.deleteList.indexOf(song._id)
        this.setState({
          deleteList: this.state.deleteList.remove(index),
        })
        message.success('删除成功')
      } else if (returns.code === 101 && returns.data) {
        // 101 表示歌曲被文章引用，需要弹出提示
        Modal.error({
          title: '删除失败，歌曲正在被下列文章引用:',
          content: (
            <div className={s.remoteFailModal}>
              <ul>
                {
                  // 101 会返回应用歌曲的文章列表
                  (returns.data as any).map(article => {
                    return (
                      <li
                        key={article._id}
                      >
                        《<a href={`/said/${article.key}.html`} target="_blank">{article.title}</a>》
                      </li>
                    )
                  })
                }
              </ul>
            </div>
          ),
          okText: '确定'
        })
      }
    })
  }

  /**
   * 关闭上传表单
   */
  closeForm = () => {
    this.state.player.stop()
    this.setState({
      addModalVisible: false,
      playSong: null,
      song: null,
    })
  }

  /**
   * 选择音乐触发
   */
  handleSelectImage = (song: SongModel) => {
    if (this.props.mode === 'select') {
      this.setState({
        selectSong: song,
      })
      if (this.props.onSelect) {
        this.props.onSelect(song)
      }
    }
  }
  render() {
    if (this.state.loadingList) {
      return <PageLoading />
    }
    return (
      <div
        className={s.songComponents}
      >
        <div className={s.cardBox}>
          {
            this.props.mode !== 'select' ?
              (
                // 普通模式才可以上传音乐，选择模式不显示上传歌曲的逻辑
                <div className={`${s.uploadGrid} ${s.songGrid}`}>
                  <Modal
                    title="新增歌曲"
                    closable={false}
                    maskClosable={false}
                    visible={this.state.addModalVisible}
                    footer={null}
                  >
                    <SongForm
                      ref="formImage"
                      songStore={void 0 as any}
                      onCancel={this.closeForm}
                      onSuccess={this.closeForm}
                      song={this.state.song}
                    />
                  </Modal>
                  <Upload
                    name="img"
                    customRequest={this.handleRequest}
                    accept={acceptMimetypes.join(',')}
                    listType="picture-card"
                    showUploadList={false}
                    disabled={this.state.uploading}
                  >
                    <UploadProgress percent={this.state.percent} isUploading={this.state.uploading} />
                  </Upload>
                </div>
              ) : null
          }
          {
            this.props.songStore.songs.map(song => {
              return (
                <div key={song._id} className={s.songGrid}>
                  <SongGrid
                    mode={this.props.mode || 'view'}
                    onSelect={this.handleSelectImage}
                    actived={this.state.selectSong ? this.state.selectSong._id === song._id : false}
                    song={song}
                    isPlay={
                      this.state.playSong
                        ? this.state.playSong._id === song._id : false}
                    isShowDelete={this.props.mode !== 'select' && this.props.adminStore.isRoot()}
                    onPlay={this.handleSongPlay}
                    onPause={this.handleSongPause}
                    onDelete={this.handleSongDelete}
                    isDeleteting={this.state.deleteList.contains(song._id)}
                  />
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}