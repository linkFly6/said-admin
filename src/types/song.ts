import { ImageModel } from './image'

/**
 * 支持的音乐文件列表
 */
export const acceptMimetypes = [
  'mp3',
  'ogg'
]
/**
 * 歌曲 Model
 */
export interface SongModel {
  _id: string,
  /**
   * url
   */
  url: string,
  /**
   * 名称
   */
  name: string,
  /**
   * 存储的资源名称
   * 例如完整路径为 https://tasaid.com/static/said/demo.mp3
   * 则存储路径为 static/said/demo.mp3(注意不带前面的 /)
   * 因为这个 key 对应的七牛云存储的文件 key
   */
  key: string,
  /**
   * 歌曲名称
   */
  title: string,
  /**
   * 文件类型
   */
  mimeType: string,
  /**
   * 大小（kb）
   */
  size: number,
  /**
   * 歌手
   */
  artist: string,
  /**
   * 专辑
   */
  album: string,
  /**
   * 时长（ms）
   */
  duration: number,
  /**
   * 歌曲图片
   */
  image: ImageModel
}