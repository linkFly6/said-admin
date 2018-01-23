import { observable, computed, observe, runInAction } from 'mobx'
import { fetch, post } from '../service/http'
import { ImageType } from '../types/image'
import { CategoryModel } from '../types/category'
import { BlogModel } from '../types/blog'


export class Image {
  _id: string = ''
  name: string = ''
  fileName: string = ''
  size: number = 0
  type: ImageType = ImageType.System
}

export class ImageStore {
  @observable images: Image[] = []
  /**
   * 查询列表
   */
  query(imageType: ImageType) {
    return fetch<Image[]>('/back/api/user/image/query', { imageType: imageType }).then(returns => {
      if (returns.check()) {
        runInAction(() => {
          this.images = returns.data
        })
      }
      return returns
    })
  }

  upload(params: {
    img: Blob,
    imageType: ImageType,
  }) {
    let data = new FormData()
    data.append('img', params.img)
    data.append('imageType', params.imageType + '')
    return post<Image>('/back/api/user/image/upload', data).then(returns => {
      if (returns.check()) {
        runInAction(() => {
          this.images.push(returns.data)
        })
      }
      return returns
    })
  }
}
