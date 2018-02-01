import * as React from 'react'
import * as s from './song-grid.styl'
import { SongModel } from '../../types/song'
import { Spin, Row, Col, Popconfirm, Icon } from 'antd'
import { parseTime, parseBit } from '../../service/utils/format'


export interface SongGridStateProps {
  /**
   * 模式，默认 "view" 是普通页面模式
   * "select" 模式只支持选择图片
   */
  mode: 'view' | 'select',
  /**
   * 是否被选择
   */
  actived?: boolean,
  /**
   * 选择图片触发的事件
   */
  onSelect: (song: SongModel) => void,
  /**
   * 对应渲染的歌曲对象
   */
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
}


/**
 * 歌曲展现项组件
 * @param props 
 */
export const SongGrid = (props: SongGridStateProps) => {
  const deleteContent = props.isDeleteting ?
    (
      <div className={s.deleteing}>
        <div className={s.deleteBox}>
          <Spin size="large" />
          <div className={s.deleteText}>删除中...</div>
        </div>
      </div>
    ) : null

  return (
    <div
      className={
        `${s.component} ${s.songGrid} ${props.mode === 'select' ? s.modeSelect : ''} ${props.actived ? s.actived : ''}`
      }
      onClick={
        () => {
          if (props.mode === 'select' && props.onSelect) {
            props.onSelect(props.song)
          }
        }
      }
    >
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
                        <Icon
                          type="pause-circle-o"
                          title="点击暂停"
                          onClick={
                            (e) => {
                              e.stopPropagation()
                              props.onPause(props.song)
                            }
                          }
                        />
                      </div>
                    ) : (
                      <div>
                        <Icon
                          type="play-circle-o"
                          title="点击播放"
                          onClick={
                            (e) => {
                              // 播放音乐不要影响到父级别的选择事件(props.onSelect)
                              e.stopPropagation()
                              props.onPlay(props.song)
                            }
                          }
                        />
                      </div>
                    )
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