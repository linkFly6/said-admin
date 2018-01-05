import { observable, computed } from 'mobx'


export class CommonStore {
  @observable token: string = ''
  @observable demo: number = 0
}