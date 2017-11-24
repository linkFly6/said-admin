import { UserModel } from './user'
import { ReplyModel } from './reply'
/**
 * 用户评论
 */
export interface CommentModel {
  _id: string
  /**
   * 用户
   */
  user: UserModel
  /**
   * 评论源码
   */
  context: string
  /**
   * 评论 HTML
   */
  contextHTML: string
  /**
   * 针对评论的回复
   */
  replys: ReplyModel[]
}