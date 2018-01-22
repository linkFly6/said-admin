import * as React from 'react'
// import SaidEditor from '../../components/said-editor'
import { Button, Form, Input, Row, Col, AutoComplete, Switch, Collapse, Select, message } from 'antd'
import SaidEditor from '../../components/said-editor/editor'
import { FormComponentProps } from 'antd/lib/form/Form'
import * as s from './add-blog.styl'
import { inject, observer } from 'mobx-react'
import { BlogStore } from '../../store/blog'
import { SelectValue } from 'antd/lib/select'
import { userReady } from '../../service/user'
import history from '../../assets/js/history'
import { Store } from '../../service/utils/store'

// 本地存储
const store = new Store('add.blog')

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
  category: string,
  tags: string[],
  context: string,
}> {

  state = {
    category: '',
    tags: [],
    context: '',
  }

  constructor(props: FormComponentProps & StateProps) {
    super(props)
    this.load()
  }
  async load() {
    const loginValue = await userReady()
    if (loginValue) return
    const returns = await this.props.blog.queryCreateBlogBaseInfo()
    if (!returns) return
  }

  handleChangeCategory = (value: SelectValue) => {
    this.setState({
      category: value as string
    })
  }
  handleChangeTags = (values: string[]) => {
    this.setState({
      tags: values
    })
  }
  handleChangeContext = (text: string) => {
    this.setState({
      context: text,
    })
  }
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
        setTimeout(() => {
          history.push('/blog')
        }, 2000)
      }
    })
    e.preventDefault()
  }


  createHandelChangeSaveToLocal = (name: string) => {
    return (e: React.ChangeEvent<any>) => {
      store.val(name, e.target.value)
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
                    })(
                    <Input
                      placeholder="文章标题"
                      size="large"
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
                validateStatus={this.state.context.length ? void 0 : 'error'}
                help={this.state.context.length ? void 0 : '请输入文章内容'}
              >
                {
                  <SaidEditor onChange={this.handleChangeContext} />
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
                    })(
                    <Input.TextArea
                      placeholder="简述\n支持多行"
                      autosize={{ minRows: 4, maxRows: 4 }}
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
                      getFieldDecorator('jsCode')(
                        <Input.TextArea
                          placeholder="JavaScript 代码\n用于定制文章页代码"
                          autosize={{ minRows: 4, maxRows: 4 }}
                        />
                      )
                    }
                  </div>
                  {
                    getFieldDecorator('cssCode')(
                      <Input.TextArea
                        placeholder="css 代码\n用于定制文章页代码"
                        autosize={{ minRows: 4, maxRows: 4 }}
                      />
                    )
                  }
                </Collapse.Panel>
              </Collapse>
            </Col>
          </Row>
          <Row type="flex" justify="center">
            <Col span={2}>
              <Button loading={false} size="large" onClick={this.submit}>
                预览
              </Button>
            </Col>
            <Col span={2}>
              <Button type="primary" size="large" htmlType="submit">
                发表
              </Button>
            </Col>
          </Row>
        </Form>
      </div >
    )
  }
}

export default Form.create()(AddBlog)
