import { AdminModel } from './admin'
import { TagModel } from './tag'
import { CategoryModel } from './category'
import { CommentModel } from './comment'


/**
 * blog Model(日志)
 */
export interface BlogModel {
  /**
   * mongoDB 默认 ID
   */
  _id: string,
  /**
   * 日志标题
   */
  title: string,
  /**
   * 文章正文
   */
  context: string,
  /**
   * 标记，可以自定义，也可以自动生成，url 中使用
   */
  urlKey: string,
  /**
   * 作者信息
   */
  author: AdminModel
  /**
   * 描述
   */
  summary: string,
  /**
   * 文件名
   */
  fileName: string,
  /**
   * 标签
   */
  tags: TagModel[],
  /**
   * 分类
   */
  category: CategoryModel,
  /**
   * 处理过后的资源
   */
  other: {
    /**
     * 处理后的 XML
     */
    xml: string,
    /**
     * 处理后的 HTML
     */
    html: string,
    /**
     * 处理后的描述 HTML
     */
    summaryHTML: string,
  },
  /**
   * 评论
   */
  comments: CommentModel[]
  /**
   * 相关信息
   */
  info: {
    /**
     * 访问量
     */
    pv?: number,
    /**
     * 喜欢数
     */
    likeCount?: number,
    /**
     * 创建时间
     */
    createTime: number,
    /**
     * 最后一次更新时间
     */
    updateTime: number,
  }
  /**
   * 配置
   */
  config: {
    /**
     * 是否私有
     */
    isPrivate?: boolean,
    /**
     * 是否转载
     */
    isReprint?: boolean,
    /**
     * 排序规则
     */
    sort?: number,
    /**
     * script 脚本
     */
    script?: string,
    /**
     * css 脚本
     */
    css?: string,
    /**
     * 访问密码
     */
    password?: string,
  }
}