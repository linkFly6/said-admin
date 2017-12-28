import { UserModel } from './user'

/**
 * 用户针对评论的回复
 */
export interface ReplyModel {
  _id: string
  /**
   * 回复评论的用户
   */
  user: UserModel
  /**
   * 针对回复的回复
   */
  toReply?: ReplyModel
  /**
   * 回复源码
   */
  context: string
  /**
   * 回复 HTML
   */
  contextHTML: string
  /**
   * 创建时间
   */
  createTime: number
}