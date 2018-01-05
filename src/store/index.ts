import { CommonStore } from './common'
import { BlogStore } from './blog'
import { CategoryStore } from './category'
import { ArticleStore } from './article'

export default {
  common: new CommonStore(),
  blog: new BlogStore(),
  category: new CategoryStore(),
  article: new ArticleStore(),
}