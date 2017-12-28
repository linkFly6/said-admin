import * as React from 'react'
// import SaidEditor from '../../components/said-editor'
import { Button, Form, Input, Row, Col, AutoComplete, Switch, Collapse } from 'antd'
import SaidEditor from '../../components/said-editor/editor'
import { FormComponentProps } from 'antd/lib/form/Form'
import * as s from './add-blog.styl'



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

export interface StateProps { }

const options: any = [
  (
    <AutoComplete.Option key="TypeScript" value="Typescript">
      <a
        href="javascript:;"
        target="_blank"
        rel="noopener noreferrer"
      >
        TypeScript
      </a>
    </AutoComplete.Option>
  )
]

class AddBlog extends React.Component<FormComponentProps & StateProps> {

  render() {
    const getFieldDecorator = this.props.form.getFieldDecorator
    return (
      <div className={`${s.view} ${s.addBlog}`}>
        <Form layout="vertical">
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
                    <Input style={{ width: '100%' }} placeholder="文章标题" size="large" />
                    )
                }
              </FormItem>
              <FormItem>
                <div className="editor">
                  <SaidEditor />
                </div>
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
                    <Input placeholder="标签" size="large" />
                    )
                }
              </FormItem>

              <FormItem>
                {
                  getFieldDecorator(
                    'category',
                    {
                      validateTrigger: ['onChange', 'onBlur'],
                      rules: [{ required: true, message: '请输入分类' }],
                    })(
                    <AutoComplete
                      className="certain-category-search"
                      dropdownClassName="certain-category-search-dropdown"
                      dropdownStyle={{ width: 300 }}
                      size="large"
                      style={{ width: '100%' }}
                      dataSource={options}
                      optionLabelProp="value"
                    >
                      <Input placeholder="分类" size="large" />
                    </AutoComplete>
                    )
                }
              </FormItem>
              <FormItem>
                <Collapse bordered={false} defaultActiveKey={['1']} className={s.collapse}>
                  <Collapse.Panel header="高级选项" key="1">
                    <div className={s.marginBootom}>
                      <Input.TextArea
                        placeholder="JavaScript 代码\n用于定制文章页代码"
                        autosize={{ minRows: 4, maxRows: 4 }}
                      />
                    </div>
                    <Input.TextArea
                      placeholder="css 代码\n用于定制文章页代码"
                      autosize={{ minRows: 4, maxRows: 4 }}
                    />
                  </Collapse.Panel>
                </Collapse>
              </FormItem>
              {/* <FormItem>

              </FormItem> */}
            </Col>
          </Row>
          <Row type="flex" justify="center">
            <Col span={2}>
              <Button loading={false} size="large">
                预览
              </Button>
            </Col>
            <Col span={2}>
              <Button type="primary" size="large">
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
