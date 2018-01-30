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




interface StateProps {
  songStore: SongStore,
  adminStore: AdminStore,
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
      <Icon type={'plus'} className={s.iconUpload} />
      <div className="ant-upload-text">点击或拖拽音频文件上传</div>
    </div>
  )
}

const SongGrid = (props: {
  song: SongModel,
  /**
   * 是否正在删除
   */
  isDeleteting?: boolean,
  /**
   * 是否正在播放
   */
  isPlay: boolean,
  /**
   * 是否显示删除按钮
   */
  isShowDelete: boolean,
  /**
   * 点播放触发
   */
  onPlay: (song: SongModel) => void
  /**
   * 点暂停触发
   */
  onPause: (song: SongModel) => void
  /**
   * 删除触发
   */
  onDelete?: (song: SongModel) => void
}) => {
  const deleteContent = props.isDeleteting ?
    (
      <div className={s.deleteing}>
        <div className={s.deleteBox}>
          <Spin size="large" />
          <div className={s.deleteText}>删除中...</div>
        </div>
      </div>
    ) : ''
  const buttonsContent: Array<React.ReactNode> = []

  return (
    <div className={s.cardGrid}>
      <div className={s.card}>
        {deleteContent}
        <Row>
          <Col span={12}>
            <div
              className={`${s.image} ${props.isPlay ? s.player : ''}`}
              style={{ backgroundImage: `url(${props.song.image.thumb})` }}
            />
          </Col>
          <Col span={12}>
            <div className={s.detail}>
              <div className={s.content}>
                <h3>{props.song.title}</h3>
                <p><span title="歌手">{props.song.artist}</span></p>
                <p><span title="专辑">{props.song.album}</span></p>
                <p className={s.flex}>
                  <span title="时长">{parseTime(Math.round(props.song.duration))}</span>
                  <span title="大小">{parseBit(props.song.size)}</span>
                </p>
              </div>
              <div className={s.actions}>
                {
                  props.isPlay ?
                    // 播放中，显示暂停按钮
                    (
                      <div>
                        <Icon type="pause-circle-o" title="点击暂停" onClick={() => props.onPause(props.song)} />
                      </div>
                    ) : (
                      <div>
                        <Icon type="play-circle-o" title="点击播放" onClick={() => props.onPlay(props.song)} />
                      </div>
                    )
                  // buttonsContent
                }
                {
                  // 检测是否有删除权限
                  props.isShowDelete ?
                    (
                      <Popconfirm
                        title="确认是否删除？"
                        okText="是"
                        cancelText="否"
                        onConfirm={
                          () => props.onDelete ? props.onDelete(props.song) : null
                        }
                      >
                        <div>
                          <Icon
                            className={s.deleteButton}
                            type="delete"
                          />
                        </div>
                      </Popconfirm>
                    ) : null
                }
              </div>
            </div>
          </Col>
        </Row>
      </div>
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
}

@inject((allStores: any) => ({
  adminStore: allStores.store.admin,
  songStore: allStores.store.song,
}))
@observer
export default class ImageComponents extends React.Component<StateProps, ComponentState> {
  state: ComponentState = {
    // 是否正在上传
    uploading: false,
    // 上传进度
    percent: 0,
    addModalVisible: false,
    playSong: null,
    deleteList: List<string>(),
    loadingList: false,
    song: null,
  }

  /**
   * constructor 中不允许操作 state
   */
  componentWillMount() {
    this.load()
  }

  /**
   * props 改变，会触发的生命周期
   * @param nextProps 
   */
  componentWillReceiveProps(nextProps: StateProps) {
    // this.load()
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
              percent: e.loaded / e.total * 100
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
    this.setState({
      playSong: song,
    })
  }
  /**
   * 音乐暂停播放
   */
  handleSongPause = (song: SongModel) => {
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
      update.playSong = null
    }
    this.setState(update)
    // TODO 校验后端逻辑
    // this.props.songStore.deleteSongToList(song._id).then(returns => {
    //   if (returns.success) {
    //     const index = this.state.deleteList.indexOf(song._id)
    //     this.setState({
    //       deleteList: this.state.deleteList.remove(index),
    //     })
    //     message.success('删除成功')
    //   }
    // })
  }

  /**
   * 关闭上传表单
   */
  closeForm = () => {
    this.setState({
      addModalVisible: false,
      song: null,
    })
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
          <div className={s.uploadGrid}>
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
          {
            this.props.songStore.songs.map(song => {
              return (
                <SongGrid
                  key={song._id}
                  song={song}
                  isPlay={
                    this.state.playSong
                      ? this.state.playSong._id === song._id : false}
                  isShowDelete={this.props.adminStore.isRoot()}
                  onPlay={this.handleSongPlay}
                  onPause={this.handleSongPlay}
                  onDelete={this.handleSongDelete}
                  isDeleteting={this.state.deleteList.contains(song._id)}
                />
              )
            })
          }
        </div>
      </div>
    )
  }
}