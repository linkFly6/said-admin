import { observable, computed, observe, action, runInAction } from 'mobx'
import { AdminRule } from '../types/admin'
import { innerFetch } from '../service/http'

interface SimpleAdmin {
  token: string
  nickName: string
  avatar: string
  email: string
  bio: string
  rule: AdminRule
}


export class AdminStore implements SimpleAdmin {
  /**
   * 用户签名
   */
  @observable token: string = ''
  /**
   * 用户昵称
   */
  @observable nickName: string = ''
  /**
   * 用户头像
   */
  @observable avatar: string = ''
  /**
   * 用户邮箱
   */
  @observable email: string = ''
  /**
   * 用户个人简介
   */
  @observable bio: string = ''
  /**
   * 用户访问权限
   */
  @observable rule: AdminRule = AdminRule.BLOG

  @action
  login(username: string, password: string) {
    return innerFetch<SimpleAdmin>('/back/api/login', {
      username,
      password,
    }).then((returns) => {
      if (returns.check()) {
        runInAction(() => {
          Object.assign(this, returns.data)
        })
      }
      return returns
    })
  }
}