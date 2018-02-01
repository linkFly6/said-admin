import * as React from 'react'
import * as s from './edit.styl'
import SaidEditor from '../../components/said-editor/editor'
import { inject, observer } from 'mobx-react'
import { Button, Form, Input, Row, Col, Icon, Collapse, Select, Modal, message } from 'antd'
import { FormComponentProps } from 'antd/lib/form/Form'
import { createFormItem } from '../../components/common'
import { ArticleStore } from '../../store/article'
import { SongGrid } from '../../components/songs/song-grid'
import { ImageComponent } from '../../components/images/images'
import { ImageType, ImageModel } from '../../types/image'
import { SelectorImage, SelectorSong } from './partials/selector'
import { SongModel } from '../../types/song'
import { createFactoryStoreSave, Store } from '../../service/utils/store'
import { RouteComponentProps } from 'react-router'


/**
 * 本地存储的数据的 key
 */
const LOCALSTOREKEY = 'add'

// 创建统一风格的表单项
const FormItem = createFormItem({
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 }
  }
})

interface StateProps {
  articleStore: ArticleStore,
}

/**
 * 页面对应的数据模型
 */
interface PageArticleModel {
  /**
   * 标题
   */
  title: string
  /**
   * 正文
   */
  context: string
  /**
   * 图片
   */
  poster: ImageModel | null
  /**
   * 歌曲
   */
  song: SongModel | null
  /**
   * 描述
   */
  summary: string
}

interface ComponentStates extends PageArticleModel {
  /**
   * 文章 ID，如果 props 里面有这个属性表示是编辑模式
   */
  articleId?: string,
  /**
   * 是否激活操作过 context 输入框，如果操作过就进行校验，校验不通过就显示错误
   */
  firstActiveContext: boolean

  /**
   * 从本地或远程读取的初始化文章正文
   * 因为 SaidEdit 的 value 会监控数据变化
   * 所以初始默认读静态的值
   */
  initContextValue: string
  /**
   * 经过 createFactoryStoreSave() 创建过的高级本地保存对象
   */
  superStore: {
    store: Store,
    save: (val: {
      title?: string
      context?: string
      poster?: ImageModel | null
      song?: SongModel | null
      summary?: string
    }) => void
  }
}


@inject((allStores: any) => ({
  articleStore: allStores.store.article,
}))
@observer
class ArticleDetail extends React.Component<
RouteComponentProps<{ id: string }> & StateProps & FormComponentProps, ComponentStates
> {
  state: ComponentStates = {
    articleId: this.props.match.params.id,
    firstActiveContext: false,
    initContextValue: '',
    title: '',
    context: '',
    summary: '',
    song: null,
    poster: null,
    superStore:
      this.props.match.params.id ?
        // 有 articleId 表示是编辑模式，所以不需要从本地缓存读数据
        // 所以实现一个傀儡对象，但是 save() 函数是假的
        {
          store: new Store('article.view.edit'),
          save: (val: any) => {
            // empty
          }
        } :
        // 添加模式下，保存数据
        createFactoryStoreSave<PageArticleModel>('article.view.edit', LOCALSTOREKEY)
  }

  componentDidMount() {
    if (!this.state.articleId) {
      this.loadLocalData()
    }
  }

  /**
   * 本地 localstorage 读数据
   */
  loadLocalData = () => {
    const store = this.state.superStore.store
    const data: PageArticleModel & { initContextValue: string } = {
      title: '',
      context: '',
      summary: '',
      poster: null,
      song: null,
      initContextValue: ''
    }
    const localData = store.val(LOCALSTOREKEY) || {}
    Object.keys(data).forEach(key => {
      if (localData[key] && key in data) {
        data[key] = localData[key]
      }
    })
    if (data.context) {
      data.initContextValue = data.context
    }
    this.setState(data)
  }


  /**
   * 生成保存数据到本地 store 的函数
   */
  createHandelChangeSaveToLocal = (name: string) => {
    return (e: React.ChangeEvent<any>) => {
      this.state.superStore.save({
        [name]: e.target.value
      })
    }
  }

  handleChangeContext = (text: string) => {
    this.state.superStore.save({
      context: text,
    })
  }

  handleSelectImage = (image: ImageModel) => {
    this.state.superStore.save({
      poster: image,
    })
  }
  handleSelectSong = (song: SongModel) => {
    this.state.superStore.save({
      song,
    })
  }

  render() {
    const getFieldDecorator = this.props.form.getFieldDecorator
    return (
      <div className={`${s.view} ${s.editSaid}`}>
        <Form layout="vertical">
          <Row>
            <Col span={14} md={20}>
              <FormItem>
                {
                  getFieldDecorator(
                    'title',
                    {
                      validateTrigger: ['onChange', 'onBlur'],
                      rules: [{ required: true, message: '请输入文章标题' }],
                      initialValue: this.state.title
                    })(
                    <Input
                      placeholder="文章标题"
                      size="large"
                      autoComplete="off"
                      onChange={this.createHandelChangeSaveToLocal('title')}
                    />
                    )
                }
              </FormItem>
              <FormItem
                validateStatus={!this.state.firstActiveContext || this.state.context.length ? undefined : 'error'}
                help={!this.state.firstActiveContext || this.state.context.length ? undefined : '请输入文章内容'}
              >
                {
                  <SaidEditor
                    onChange={this.handleChangeContext}
                    value={this.state.initContextValue}
                  // onDrag={this.handleOnDrag}
                  />
                }
              </FormItem>
            </Col>
            <Col
              span={8}
              offset={2}
              md={{
                offset: 0,
                span: 20,
              }}
            >
              <FormItem>
                <Row type="flex" justify="space-between">
                  <Col>
                    <SelectorImage
                      onSelect={this.handleSelectImage}
                      initSelectModel={this.state.poster}
                    />
                  </Col>
                  <Col>
                    <SelectorSong
                      onSelect={this.handleSelectSong}
                      initSelectModel={this.state.song}
                    />
                  </Col>
                </Row>
              </FormItem>
              <FormItem>
                {
                  getFieldDecorator(
                    'summary',
                    {
                      validateTrigger: ['onChange', 'onBlur'],
                      rules: [{ required: true, message: '请输入简述,支持多行' }],
                      initialValue: this.state.summary
                    })(
                    <Input.TextArea
                      placeholder="简述\n支持多行"
                      autoComplete="off"
                      autosize={{ minRows: 4, maxRows: 4 }}
                      onChange={this.createHandelChangeSaveToLocal('summary')}
                    />
                    )
                }
              </FormItem>
              {/* <Collapse bordered={false} className={s.collapse}>
                <Collapse.Panel header="高级选项" key="1">
                  <div className={s.marginBootom}>
                    {
                      getFieldDecorator('jsCode', {
                        // initialValue: this.state.jsCode
                      })(
                        <Input.TextArea
                          placeholder="JavaScript 代码\n用于定制文章页代码"
                          autoComplete="off"
                          autosize={{ minRows: 4, maxRows: 4 }}
                        // onChange={this.createHandelChangeSaveToLocal('jsCode')}
                        />
                        )
                    }
                  </div>
                  {
                    getFieldDecorator('cssCode', {
                      // initialValue: this.state.cssCode
                    })(
                      <Input.TextArea
                        placeholder="css 代码\n用于定制文章页代码"
                        autoComplete="off"
                        autosize={{ minRows: 4, maxRows: 4 }}
                      // onChange={this.createHandelChangeSaveToLocal('cssCode')}
                      />
                      )
                  }
                </Collapse.Panel>
              </Collapse> */}
            </Col>
          </Row>
          <Row type="flex" justify="center" className={s.actions}>
            <Button loading={false} size="large">
              预览
            </Button>
            <Button type="primary" size="large" htmlType="submit" style={{ marginLeft: '2rem' }}>
              {
                // this.state.blogId ? '保存' : '发表'
                '保存'
              }
            </Button>
          </Row>
        </Form>
      </div>
    )
  }
}

export default Form.create()(ArticleDetail)