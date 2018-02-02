import * as React from 'react'
// import SaidEditor from '../../components/said-editor'
import { Button, Form, Input, Row, Col, Collapse, Select, message } from 'antd'
import SaidEditor from '../../components/said-editor/editor'
import { FormComponentProps } from 'antd/lib/form/Form'
import * as s from './edit.styl'
import { inject, observer } from 'mobx-react'
import { BlogStore } from '../../store/blog'
import { SelectValue } from 'antd/lib/select'
import history from '../../assets/js/history'
import { Store } from '../../service/utils/store'
import { debounce } from '../../service/utils/index'
import { acceptMimetypes, ImageType } from '../../types/image'
import { ImageStore } from '../../store/image'
import { RouteComponentProps } from 'react-router'
import { createFormItem } from '../../components/common'


/**
 * 创建一个存储到 Store 的方法：
 * 存储数据到 store，封装为通用方法，针对每个字段的输入做函数节流
 */
const createSetStoreFn = function (store: Store) {
  const cacheFunc = {}
  return (name: string, value: any) => {
    if (!cacheFunc[name]) {
      cacheFunc[name] = debounce((n: string, v: any) => {
        store.val(n, v)
      }, 300)
    }
    cacheFunc[name](name, value)
  }
}

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

export interface StateProps {
  blog: BlogStore,
  image: ImageStore,
}

interface ComponentState {
  /**
   * 本地 Store 存储
   */
  store: Store
  firstActiveContext: boolean,
  initContext: string,
  category: string,
  tags: string[],
  context: string,
  title: string,
  summary: string,
  jsCode: string,
  cssCode: string,
  /**
   * 如果包含 blogId，则为编辑模式，否则为新增模式
   */
  blogId?: string,
}


@inject((allStores: any) => ({
  blog: allStores.store.blog,
  image: allStores.store.image
}))
@observer
class BlogDetail extends React.Component<
RouteComponentProps<{ id: string }>
& FormComponentProps
& StateProps, ComponentState> {

  state: ComponentState = {
    store: null!,
    // 是否激活操作过 context 输入框，如果操作过就进行校验，校验不通过就显示错误
    firstActiveContext: false,
    // context 初始值
    initContext: '',
    /**
     * 分类 ID
     */
    category: '',
    /**
     * 以标签名称组成的标签列表（注意不是 ID）
     * 提交给后端的时候是提交 name 而不是 id
     */
    tags: [],
    context: '',
    title: '',
    summary: '',
    jsCode: '',
    cssCode: '',
    blogId: undefined,
  }

  componentDidMount() {
    this.load(this.props.match.params.id)
    // 编辑模式
    if (this.props.match.params.id) {
      const store = new Store('blog.edit')
      this.setState({
        store,
      })
      // 编辑模式不会存储数据到 store
      this.setStore = () => {
        // empty
      }
    } else {
      const store = new Store('blog.add')
      // 新增模式
      this.setState({
        store,
      })
      this.setStore = createSetStoreFn(store)

      setTimeout(() => {
        // 这样里面就可以访问到更新后的 store 了
        this.loadLocalData()
      }, 0)
    }

  }
  /**
   * 远程加载数据，如果有 blog 则为编辑模式，否则为新增模式
   * @param blogId 
   */
  async load(blogId: string) {
    const returns = await this.props.blog.queryBlogBaseInfo(blogId)
    // 编辑模式
    if (returns.check() && blogId && returns.data.blog) {
      this.setState({
        blogId: blogId,
        title: returns.data.blog.title,
        initContext: returns.data.blog.context,
        context: returns.data.blog.context,
        /**
         * tag 保存的时候是以名字保存的
         */
        tags: returns.data.blog.tags.map(tag => tag.name),
        category: returns.data.blog.category._id,
        summary: returns.data.blog.summary,
        jsCode: returns.data.blog.config.script || '',
        cssCode: returns.data.blog.config.css || '',
      })
    }
  }
  /**
   * 加载本地缓存数据
   */
  loadLocalData() {
    const data: {
      title: string,
      context: string,
      summary: string,
      category: string,
      tags: string[],
      jsCode: string,
      cssCode: string,
    } = {
        title: '',
        context: '',
        summary: '',
        category: '',
        tags: [],
        jsCode: '',
        cssCode: '',
      }
    this.state.store.getAllKey().forEach((key: string) => {
      data[key] = this.state.store.val(key)
    })
    this.setState(data)
    if (this.state.store.val('context')) {
      this.setState({
        initContext: this.state.store.val('context')
      })
    }
  }

  setStore = (name: string, value: any) => {
    // empty，该方法会在 store 确认下来之后被重写
  }

  handleChangeCategory = (value: string) => {
    this.setState({
      category: value
    })
    this.setStore('category', value)
  }
  handleChangeTags = (values: string[]) => {
    this.setState({
      tags: values
    })
    this.setStore('tags', values)
  }
  handleChangeContext = (text: string) => {
    this.setState({
      context: text,
      // firstActiveContext: true,
    })
    this.setStore('context', text)
  }
  /**
   * 提交数据
   */
  submit = (e: React.FormEvent<any>) => {
    this.props.form.validateFields(async (err, field: {
      category: string,
      tags: string[],
      title: string,
      summary: string,
      jsCode: string | void,
      cssCode: string | void,
    }) => {
      if (err) return
      this.setState({
        firstActiveContext: true,
      })
      if (!this.state.context.length) {
        return
      }
      const returns = await this.props.blog.save({
        _id: this.state.blogId,
        title: field.title,
        summary: field.summary,
        context: this.state.context,
        tags: field.tags,
        category: field.category,
        config: {
          script: field.jsCode,
          css: field.cssCode,
        }
      })
      if (returns.check()) {
        if (this.state.blogId) {
          message.success(`编辑文章《${field.title}》成功`)
        } else {
          message.success(`新增文章《${field.title}》成功`)
        }
        this.state.store.clear()
        setTimeout(() => {
          history.push('/blog')
        }, 1000)
      }
    })
    e.preventDefault()
  }

  /**
   * 保存数据到本地 store
   */
  createHandelChangeSaveToLocal = (name: string) => {
    return (e: React.ChangeEvent<any>) => {
      this.setStore(name, e.target.value)
    }
  }

  /**
   * 编辑器拖拽事件
   */
  handleOnDrag = (
    /**
     * 拖拽事件
     */
    e: DragEvent,
    /**
     * 调用后会插入临时上传文本
     * 参数 success 标识是否插入文本
     */
    inserUploadingFlag: (success: boolean) => void,
    /**
     * 调用后会用 text 替换掉临时上传文本
     */
    next: (text: string) => void
  ) => {
    if (e.dataTransfer.files.length) {
      // 只处理第一个文件
      const file = e.dataTransfer.files[0]
      if (~acceptMimetypes.indexOf(file.type)) {
        // 在编辑器插入占位符
        inserUploadingFlag(true)
        // 上传图片
        this.uploadImage(file).then(returns => {
          if (!returns.check()) {
            message.error(`${returns.message}${returns.code == null ? '' : `(${returns.code})`}`)
            // 清掉占位符
            next('')
          } else {
            // 插入替换占位符后的 markdown 文本
            next(`![alt](${returns.data.url})`)
          }
        })
      } else {
        // 表示不支持该文件，不要在编辑器插入占位符
        inserUploadingFlag(false)
      }
    }
    return false
  }

  // 上传文件
  uploadImage = (file: File) => {
    return this.props.image.upload({
      imageType: ImageType.Blog,
      img: file,
    })
  }

  render() {
    const getFieldDecorator = this.props.form.getFieldDecorator
    return (
      <div className={`${s.view} ${s.addBlog}`}>
        <Form layout="vertical" onSubmit={this.submit}>
          <Row>
            <Col span={14}>
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
                validateStatus={!this.state.firstActiveContext || this.state.context.length ? void 0 : 'error'}
                help={!this.state.firstActiveContext || this.state.context.length ? void 0 : '请输入文章内容'}
              >
                {
                  <SaidEditor
                    onChange={this.handleChangeContext}
                    value={this.state.initContext}
                    onDrag={this.handleOnDrag}
                  />
                }
              </FormItem>
            </Col>
            <Col span={8} offset={2}>
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
              <FormItem>
                {
                  getFieldDecorator(
                    'tags',
                    {
                      validateTrigger: ['onChange', 'onBlur'],
                      rules: [{ required: true, message: '请输入标签' }],
                      initialValue: this.state.tags
                    })(
                    <Select
                      mode="tags"
                      size="large"
                      placeholder="选择或输入标签"
                      onChange={this.handleChangeTags}
                    >
                      {
                        this.props.blog.tags.map(tag => {
                          return <Select.Option key={tag._id} value={tag.name}>{tag.name}</Select.Option>
                        })
                      }
                    </Select>
                    )
                }
              </FormItem>

              <FormItem>
                {
                  getFieldDecorator(
                    'category',
                    {
                      validateTrigger: ['onChange', 'onBlur'],
                      rules: [{ required: true, message: '请选择分类' }],
                      initialValue: this.state.category
                    })(
                    // <AutoComplete
                    //   className="certain-category-search"
                    //   dropdownClassName="certain-category-search-dropdown"
                    //   dropdownStyle={{ width: 300 }}
                    //   size="large"
                    //   style={{ width: '100%' }}
                    //   dataSource={options}
                    //   optionLabelProp="value"
                    // >
                    //   <Input placeholder="分类" size="large" readOnly />
                    // </AutoComplete>
                    <Select
                      size="large"
                      showSearch
                      optionFilterProp="children"
                      filterOption={
                        (input, option) => option
                          .props.children!.toString().toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      onChange={this.handleChangeCategory}
                    >
                      {
                        this.props.blog.categorys.map(category => {
                          return <Select.Option key={category._id} value={category._id}>{category.name}</Select.Option>
                        })
                      }
                    </Select>
                    )
                }
              </FormItem>
              <Collapse bordered={false} className={s.collapse}>
                <Collapse.Panel header="高级选项" key="1">
                  <div className={s.marginBootom}>
                    {
                      getFieldDecorator('jsCode', {
                        initialValue: this.state.jsCode
                      })(
                        <Input.TextArea
                          placeholder="JavaScript 代码\n用于定制文章页代码"
                          autoComplete="off"
                          autosize={{ minRows: 4, maxRows: 4 }}
                          onChange={this.createHandelChangeSaveToLocal('jsCode')}
                        />
                        )
                    }
                  </div>
                  {
                    getFieldDecorator('cssCode', {
                      initialValue: this.state.cssCode
                    })(
                      <Input.TextArea
                        placeholder="css 代码\n用于定制文章页代码"
                        autoComplete="off"
                        autosize={{ minRows: 4, maxRows: 4 }}
                        onChange={this.createHandelChangeSaveToLocal('cssCode')}
                      />
                      )
                  }
                </Collapse.Panel>
              </Collapse>
            </Col>
          </Row>
          <Row type="flex" justify="center">
            <Button loading={false} size="large" onClick={this.submit}>
              预览
            </Button>
            <Button type="primary" size="large" htmlType="submit" style={{ marginLeft: '2rem' }}>
              {
                this.state.blogId ? '保存' : '发表'
              }
            </Button>
          </Row>
        </Form>
      </div >
    )
  }
}

export default Form.create()(BlogDetail)
