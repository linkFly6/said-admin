import { CommonStore } from './common'
import { BlogStore } from './blog'
import { CategoryStore } from './category'
import { ArticleStore } from './article'
import { AdminStore } from './admin'

export default {
  common: new CommonStore(),
  blog: new BlogStore(),
  category: new CategoryStore(),
  article: new ArticleStore(),
  admin: new AdminStore(),
}