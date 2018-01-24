import { observable, computed, observe, runInAction } from 'mobx'
import { fetch, post, postForm } from '../service/http'
import { ImageType, ImageModel } from '../types/image'
import { CategoryModel } from '../types/category'


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
  }, option: {
    onProgress?: (this: XMLHttpRequest, ev: ProgressEvent) => any,
  } = {}) {
    let data = new FormData()
    data.append('img', params.img)
    data.append('imageType', params.imageType + '')
    return postForm<ImageModel>('/back/api/user/image/upload', data, option)
      .then(returns => {
        if (returns.check()) {
          runInAction(() => {
            this.images.unshift(returns.data)
          })
        }
        return returns
      })
  }
}
