import { AdminRule } from './admin'
/**
 * 图片类型枚举
 */
export enum ImageType {
  /**
   * 系统图
   */
  System = 0,
  /**
   * Blog图
   */
  Blog = 1,
  /**
   * Music图
   */
  Music = 2,
  /**
   * 文章图片
   */
  Article = 3,
  /**
   * Icon
   */
  Icon = 4,
  /**
   * 页面引用图
   */
  Page = 5,
  /**
   * 实验室图
   */
  Lab = 6,
  /**
   * 其他图
   */
  Other = 7
}

export interface InterfaceImageTypeText {
    [prop: number]: string
}

/**
 * 每个图片类型对应的文字
 */
export const ImageTypeText: InterfaceImageTypeText = {
  [ImageType.System]: '系统',
  [ImageType.Blog]: '日志',
  [ImageType.Music]: '音乐',
  [ImageType.Article]: '听说',
  [ImageType.Icon]: '图标',
  [ImageType.Page]: '页面',
  [ImageType.Lab]: '实验室',
  [ImageType.Other]: '其他',
}

/**
 * 校验图片类型是否正确
 * @param imagetype 
 * @param imagetypes 也可以指定自己的图片类型列表
 */
export const hasImageType = (imagetype: number | string, imagetypes: InterfaceImageTypeText = ImageTypeText) => {
  return !!ImageTypeText[imagetype]
}

/**
 * 获取对应用户角色可操作的图片类型
 */
export const getUserImageTypeTexts = (rule: AdminRule): InterfaceImageTypeText | null => {
  switch (rule) {
    case AdminRule.GLOBAL:
      return ImageTypeText
    case AdminRule.BLOG:
      return {
        [ImageType.Blog]: ImageTypeText[ImageType.Blog],
      }
    case AdminRule.SAID:
      return {
        [ImageType.Article]: ImageTypeText[ImageType.Article],
      }
    default:
      return null
  }
}

/**
 * 图片 Model
 */
export interface ImageModel {
  _id: string,
  /**
   * 图片 md5
   */
  name: string,
  /**
   * 图片文件名 => demo.jpg
   */
  fileName: string,
  /**
   * 图片大小
   */
  size: number,
  /**
   * 图片类型
   */
  type: ImageType,
  /**
   * 存储图片名称，该名称对应为资源路径
   * 例如完整路径为 https://tasaid.com/static/blog/demo.jpg
   * 则存储路径为 static/blog/demo.jpg(注意不带前面的 /)
   * 因为这个 name 对应的七牛云存储的文件 key
   */
  key: string,
  /**
   * 前端属性，后端数据库不存储，图片 url
   */
  url: string
  /**
   * 前端属性，后端数据库不存储，图片缩略图 url
   */
  thumb: string
}