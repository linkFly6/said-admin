import { observable, computed, observe, action, runInAction } from 'mobx'
import { AdminRule } from '../types/admin'
import { innerFetch } from '../service/http'
import { setCookie } from '../service/utils/store'
import { RouteComponentProps } from 'react-router-dom'
import { setUserReadyPromise } from '../service/user'

interface SimpleAdmin {
  token: string
  nickName: string
  avatar: string
  email: string
  bio: string
  rule: AdminRule
}

export const COOKIENAME = 'token'

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
          setCookie(COOKIENAME, returns.data.token, 45)
          setUserReadyPromise(Promise.resolve(0))
        })
      }
      return returns
    })
  }

  /**
   * 检查本地是否登录
   * @returns 0: 已登录, token 可用, 1: 未登录，无 token, returns: 远程用户信息
   */
  @action
  checkUserState(token: string) {
    return innerFetch<SimpleAdmin>('/back/api/getUserByToken', {
      token,
    }).then(returns => {
      if (returns.check()) {
        runInAction(() => {
          this.token = token
          Object.assign(this, returns.data)
        })
      }
      return returns
    })
  }


  /**
   * 检测当前用户是否拥有操作某个模块的权限
   * @param rule 
   */
  hasRule(rule: AdminRule) {
    return this.rule === AdminRule.GLOBAL || this.rule === rule
  }

  /**
   * 检测当前用户是否是超级管理员
   */
  isRoot() {
    return this.rule === AdminRule.GLOBAL
  }
}