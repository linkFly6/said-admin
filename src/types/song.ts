import { ImageModel } from  './image'
/**
 * 歌曲 Model
 */
export interface SongModel {
    /**
     * url
     */
    url: string,
    /**
     * 名称
     */
    name: string,
    /**
     * 文件类型
     */
    fileType: number,
    /**
     * 大小（kb）
     */
    size: number,
    /**
     * 歌手
     */
    artist: string,
    /**
     * 专辑
     */
    album: string,
    /**
     * 发行日期
     */
    releaseDate: Date,
    /**
     * 时长（ms）
     */
    duration: number,
    /**
     * 歌曲图片
     */
    image: ImageModel
}