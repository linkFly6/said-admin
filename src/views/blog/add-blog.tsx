import * as React from 'react'
// import SaidEditor from '../../components/said-editor'
import './add-blog.styl'
import { Button, Form, Input, Row, Col, AutoComplete, Switch, Collapse } from 'antd'
import * as antd from 'antd'
import SaidEditor from '../../components/said-editor/editor'
import { FormComponentProps } from 'antd/lib/form/Form'



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

  // tslint:disable-next-line:no-empty
  onToggleCustom(checked: boolean) { }

  render() {
    const getFieldDecorator = this.props.form.getFieldDecorator
    return (
      <div className="view add-blog">
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
                    'xxxxx',
                    {
                      validateTrigger: ['onChange', 'onBlur'],
                      rules: [{ required: true, message: '分类xxx' }],
                    })(
                    <Input style={{ width: '100%' }} placeholder="文章标题" size="large" />
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
                      <Input style={{ width: '100%' }} placeholder="文章标题" size="large" />
                    </AutoComplete>
                    )
                }
              </FormItem>
              <FormItem>
                <Collapse bordered={false} defaultActiveKey={['1']}>
                  <Collapse.Panel header="高级选项" key="1">
                    <Row>
                      <Col span={24}>
                        <Input.TextArea
                          placeholder="JavaScript 代码\n用于定制文章页代码"
                          autosize={{ minRows: 4, maxRows: 4 }}
                        />
                        <Input.TextArea
                          placeholder="css 代码\n用于定制文章页代码"
                          autosize={{ minRows: 4, maxRows: 4 }}
                        />
                      </Col>
                    </Row>
                  </Collapse.Panel>
                </Collapse>
              </FormItem>
              {/* <FormItem>

              </FormItem> */}
            </Col>
          </Row>
          <Row>
            <Col span={12} offset={12}>
              <Button loading={false} size="large">
                预览
              </Button>
            </Col>
          </Row>
        </Form>
      </div >
    )
  }
}

export default Form.create()(AddBlog)