import { observable, computed, observe } from 'mobx'


export class Blog {
  _id: string = ''
  title: string = ''
  urlKey: string = ''
  author: string = ''
  summary: string = ''
  fileName: string = ''
  tags: string = ''
  category: string = ''
  config = {
    isPrivate: false,
    isReprint: false,
    script: '',
    css: '',
    password: '',
  }
}

export class BlogStore {
  @observable blogs: Blog[] = []
}
