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


interface SelectImageStateProps { }
interface SelectImageComponentState {
  /**
   * 是否显示弹出框
   */
  visibleModal: boolean,
  /**
   * 正在使用的专辑封面图
   */
  image: ImageModel | null

  /**
   * 选择中的专辑封面图
   */
  selectImage: ImageModel | null
}

class SelectImage extends React.Component<SelectImageStateProps, SelectImageComponentState> {
  state: SelectImageComponentState = {
    visibleModal: false,
    image: null,
    selectImage: null,
  }
  /**
   * 关闭或取消选择图片
   */
  handleCloseSelectImageModal = () => {
    this.setState({
      visibleModal: false,
      // showImageSelectError: !this.state.image
    })
  }
  /**
   * 确认选择图片，选择图片的容器点击确定之后
   */
  handleOKSelectImageModal = () => {
    if (!this.state.selectImage) {
      message.error('请选择文章图片(-10000)')
      return
    }
    // this.setStore('image', this.state.selectImage)
    this.setState({
      visibleModal: false,
      image: this.state.selectImage,
      // 清空掉选择的图片
      selectImage: null,
    })
  }
  /**
   * 选择图片（注意，不是确认选择，而是每进行一次选择动作都会进行触发的事件）
   */
  handleSelectImage = (image: ImageModel) => {
    this.setState({
      selectImage: image,
    })
  }
  render() {
    return (
      <div className={`${s.selectImage} ${this.state.image ? s.zoom : ''}`}>
        <div className={s.selectMask} onClick={() => this.setState({ visibleModal: true })}>
          <Icon type="picture">
            点击选择图片
          </Icon>
        </div>
        <div
          className={s.articleImage}
          style={
            this.state.image ? { backgroundImage: `url(${this.state.image.thumb})` } : {}
          }
        />
        <Modal
          title="选择文章图片"
          width={'80%'}
          closable={false}
          visible={this.state.visibleModal}
          onCancel={this.handleCloseSelectImageModal}
          onOk={this.handleOKSelectImageModal}
          okText="确定"
          cancelText="取消"
        >
          <ImageComponent
            imageType={ImageType.Article}
            image={void 0 as any}
            mode="select"
            onSelect={this.handleSelectImage}
            selectImage={this.state.image}
          />
        </Modal>
      </div>
    )
  }
}

const SelectSong = () => {
  return (
    <div className={s.selectSong}>
      <div className={s.selectMask}>
        <Icon type="picture">
          点击选择歌曲
        </Icon>
      </div>
    </div>
  )
}

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

export interface StateProps {
  articleStore: ArticleStore,
}

@inject((allStores: any) => ({
  articleStore: allStores.store.article,
}))
@observer
class ArticleDetail extends React.Component<StateProps & FormComponentProps> {
  handleChangeContext = (text: string) => {
    console.log(text)
  }
  render() {
    const getFieldDecorator = this.props.form.getFieldDecorator
    return (
      <div className={`${s.view} ${s.editSaid}`}>
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
                      // initialValue: this.state.title
                    })(
                    <Input
                      placeholder="文章标题"
                      size="large"
                      autoComplete="off"
                    // onChange={this.createHandelChangeSaveToLocal('title')}
                    />
                    )
                }
              </FormItem>
              <FormItem
              // validateStatus={!this.state.firstActiveContext || this.state.context.length ? void 0 : 'error'}
              // help={!this.state.firstActiveContext || this.state.context.length ? void 0 : '请输入文章内容'}
              >
                {
                  <SaidEditor
                    onChange={this.handleChangeContext}
                  // value={this.state.initContext}
                  // onDrag={this.handleOnDrag}
                  />
                }
              </FormItem>
            </Col>
            <Col span={8} offset={2}>
              <FormItem>
                <Row type="flex" justify="space-between">
                  <Col>
                    <SelectImage />
                  </Col>
                  <Col>
                    <SelectSong />
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
                      // initialValue: this.state.summary
                    })(
                    <Input.TextArea
                      placeholder="简述\n支持多行"
                      autoComplete="off"
                      autosize={{ minRows: 4, maxRows: 4 }}
                    // onChange={this.createHandelChangeSaveToLocal('summary')}
                    />
                    )
                }
              </FormItem>
              <Collapse bordered={false} className={s.collapse}>
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
              </Collapse>
            </Col>
          </Row>
          <Row type="flex" justify="center">
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