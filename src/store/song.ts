import { observable, computed, observe, action, runInAction } from 'mobx'
import { SongModel } from '../types/song'
import { postForm, post, fetch } from '../service/http'

export class SongStore {
  @observable songs: SongModel[] = []

  /**
   * 查询列表
   */
  @action
  query() {
    return fetch<SongModel[]>('/back/api/user/song/query').then(returns => {
      if (returns.check()) {
        runInAction(() => {
          this.songs = returns.data
        })
      }
      return returns
    })
  }
  /**
   * 上传文件，返回解析文件后得到的歌曲信息
   * @param params 
   * @param option 
   */
  @action
  upload(params: {
    file: Blob,
  }, option: {
    onProgress?: (this: XMLHttpRequest, ev: ProgressEvent) => any,
  } = {}) {
    let data = new FormData()
    data.append('song', params.file)
    return postForm<SongModel>('/back/api/user/song/upload', data, option)
  }


  /**
   * 上传歌曲
   * @param params 
   */
  save(params: SongModel) {
    return post<SongModel>('/back/api/user/song/save', {
      entity: params
    })
  }

  /**
   * 上传歌曲并追加到 store 的 song list 中
   * @param params 
   */
  saveToList(params: SongModel) {
    return this.save(params).then(returns => {
      if (returns.check()) {
        runInAction(() => {
          this.songs.unshift(returns.data)
        })
      }
      return returns
    })
  }

  removeSongFile(md5: string) {
    return post<null>('/back/api/user/song/removeFile', { md5 })
  }

  deleteSong(songId: string) {
    return post<null>('/back/api/user/song/delete', { songId })
  }

  /**
   * 删除歌曲，并且删除 store 中对应的图片资源
   */
  deleteImageToList(songId: string) {
    return this.deleteSong(songId).then(returns => {
      if (returns.success) {
        const index = this.songs.findIndex(song => song._id === songId)
        if (~index) {
          runInAction(() => {
            this.songs.splice(index, 1)
          })
        }
      }
      return returns
    })
  }
}