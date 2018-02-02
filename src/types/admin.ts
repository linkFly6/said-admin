/**
 * 管理员访问权限
 */
export enum AdminRule {
  /**
   * 不限制访问
   */
  GLOBAL = 0,
  /**
   * 只可以访问自己的 blog
   */
  BLOG = 1,
  /**
   * 只可以访问自己的 Said
   */
  SAID = 2
}

/**
 * 后台管理员（作者类）
 */
export interface AdminModel {
  /**
   * mongoDB 默认 ID
   */
  _id: string
  /**
   * 用户名
   */
  username?: string
  /**
   * 昵称
   */
  nickName: string

  /**
   * 头像文件名（待定）
   */
  avatar?: string
  /**
   * 作者邮箱
   */
  email: string
  /**
   * 个人简介
   */
  bio?: string

  /**
   * 访问权限
   */
  rule: AdminRule
}