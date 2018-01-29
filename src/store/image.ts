import { observable, computed, observe, runInAction, action } from 'mobx'
import { fetch, post, postForm } from '../service/http'
import { ImageType, ImageModel } from '../types/image'
import { CategoryModel } from '../types/category'

export class ImageStore {
  @observable images: ImageModel[] = []
  /**
   * 查询列表
   */
  @action
  query(imageType: ImageType) {
    return fetch<ImageModel[]>('/back/api/user/image/query', { imageType: imageType }).then(returns => {
      if (returns.check()) {
        runInAction(() => {
          this.images = returns.data
          // this.images.push.apply(this.images, returns.data)
        })
      }
      return returns
    })
  }
  /**
   * 上传图片
   * @param params 
   * @param option 
   */
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
  }

  /**
   * 上传图片并追加到 store 的 images list 中
   * @param params 
   * @param option 
   */
  uploadToLists(params: {
    img: Blob,
    imageType: ImageType,
  }, option: {
    onProgress?: (this: XMLHttpRequest, ev: ProgressEvent) => any,
  } = {}) {
    return this.upload(params, option).then(returns => {
      if (returns.check()) {
        runInAction(() => {
          this.images.unshift(returns.data)
        })
      }
      return returns
    })
  }

  deleteImage(imageId: string) {
    return post<null>('/back/api/user/image/delete', { imageId })
  }

  /**
   * 删除图片，并且删除 store 中对应的图片资源
   */
  deleteImageToList(imageId: string) {
    return this.deleteImage(imageId).then(returns => {
      if (returns.success) {
        const index = this.images.findIndex(img => img._id === imageId)
        if (~index) {
          runInAction(() => {
            this.images.splice(index, 1)
          })
        }
      }
      return returns
    })
  }
}
