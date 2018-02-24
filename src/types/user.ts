/**
 * 用户角色
 */
export enum UserRole {
  /**
   * 普通用户
   */
  NORMAL = 0,
  /**
   * 后台用户
   */
  ADMIN = 1
}

/**
 * 用户类(前台)
 */
export interface UserModel {
  _id: string
  /**
   * email
   */
  email: string
  /**
   * 用户站点
   */
  site?: string
  /**
   * 用户昵称
   */
  nickName: string
  /**
   * 用户角色
   */
  role: UserRole
}