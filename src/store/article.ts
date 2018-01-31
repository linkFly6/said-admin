import { observable, computed, observe } from 'mobx'
import { ImageType } from '../types/image'


export class Article {
  _id: string = ''
  title: string = ''
  key: string = ''
  author: string = ''
  summary: string = ''
  fileName: string = ''
  poster = {
    _id: '',
    /**
     * 图片名称
     */
    name: '',
    /**
     * 图片文件名
     */
    fileName: '',
    /**
     * 图片大小
     */
    size: '',
    /**
     * 图片类型
     */
    type: ImageType.Article,
  }
  song = {
    /**
     * url
     */
    url: '',
    /**
     * 名称
     */
    name: '',
    /**
     * 文件类型
     */
    fileType: '',
    /**
     * 大小（kb）
     */
    size: 0,
    /**
     * 歌手
     */
    artist: '',
    /**
     * 专辑
     */
    album: '',
    /**
     * 发行日期
     */
    releaseDate: 0,
    /**
     * 时长（ms）
     */
    duration: 0,
    /**
     * 歌曲图片
     */
    image: {
      _id: '',
      name: '',
      fileName: '',
      size: '',
      type: ImageType.Article,
    }
  }
  category: string = ''
  config = {
    isPrivate: false,
    isReprint: false,
    script: '',
    css: '',
    password: '',
  }
}

export class ArticleStore {
  @observable articles: Article[] = []
}
