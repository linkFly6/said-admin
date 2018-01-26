import * as React from 'react'
// import SaidEditor from '../../components/said-editor'
import { Button, Form, Input, Row, Col, AutoComplete, Switch, Collapse, Select, message } from 'antd'
import SaidEditor from '../../components/said-editor/editor'
import { FormComponentProps } from 'antd/lib/form/Form'
import * as s from './add-blog.styl'
import { inject, observer } from 'mobx-react'
import { BlogStore } from '../../store/blog'
import { SelectValue } from 'antd/lib/select'
import history from '../../assets/js/history'
import { Store } from '../../service/utils/store'
import { debounce } from '../../service/utils/index'

// 本地存储
const store = new Store('add.blog')

/**
 * 存储数据到 store，封装为通用方法，针对每个字段的输入做函数节流
 */
const setStore = function () {
  const cacheFunc = {}
  return (name: string, value: any) => {
    if (!cacheFunc[name]) {
      cacheFunc[name] = debounce((n: string, v: any) => {
        store.val(n, v)
      }, 300)
    }
    cacheFunc[name](name, value)
  }
}()

class FormItem extends React.Component<{}> {
  render() {
    return (
      <Form.Item
        labelCol={{
          xs: { span: 24 },
          sm: { span: 24 },
        }}
        wrapperCol={{
          xs: { span: 24 },
          sm: { span: 24 }
        }}
      // validateStatus="error"
      // hasFeedback
      >
        {
          this.props.children
        }
      </Form.Item>
    )
  }
}

export interface StateProps {
  blog: BlogStore
}


@inject((allStores: any) => ({
  blog: allStores.store.blog
}))
@observer
class AddBlog extends React.Component<FormComponentProps & StateProps, {
  firstActiveContext: boolean,
  initContext: string,
  category: string,
  tags: string[],
  context: string,
  title: string,
  summary: string,
  jsCode: string,
  cssCode: string,
}> {

  state = {
    // 是否激活操作过 context 输入框，如果操作过就进行校验，校验不通过就显示错误
    firstActiveContext: false,
    // context 初始值
    initContext: '',
    category: '',
    tags: [],
    context: '',
    title: '',
    summary: '',
    jsCode: '',
    cssCode: '',
  }

  componentDidMount() {
    this.load()
    this.loadLocalData()
  }
  /**
   * 远程加载数据
   */
  async load() {
    const returns = await this.props.blog.queryCreateBlogBaseInfo()
    if (!returns) return
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
    store.getAllKey().forEach((key: string) => {
      data[key] = store.val(key)
    })
    this.setState(data)
    if (store.val('context')) {
      this.setState({
        initContext: store.val('context')
      })
    }
  }

  handleChangeCategory = (value: string) => {
    this.setState({
      category: value
    })
    setStore('category', value)
  }
  handleChangeTags = (values: string[]) => {
    this.setState({
      tags: values
    })
    setStore('tags', values)
  }
  handleChangeContext = (text: string) => {
    this.setState({
      context: text,
      // firstActiveContext: true,
    })
    setStore('context', text)
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
      const returns = await this.props.blog.create({
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
        message.success(`新增文章《${field.title}》成功`)
        store.clear()
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
      setStore(name, e.target.value)
    }
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
              <Form.Item
                labelCol={{
                  xs: { span: 24 },
                  sm: { span: 24 },
                }}
                wrapperCol={{
                  xs: { span: 24 },
                  sm: { span: 24 }
                }}
                validateStatus={!this.state.firstActiveContext || this.state.context.length ? void 0 : 'error'}
                help={!this.state.firstActiveContext || this.state.context.length ? void 0 : '请输入文章内容'}
              >
                {
                  <SaidEditor onChange={this.handleChangeContext} value={this.state.initContext} />
                }
              </Form.Item>
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
                      // defaultValue={['新增']}
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
              发表
            </Button>
          </Row>
        </Form>
      </div >
    )
  }
}

export default Form.create()(AddBlog)
